# ==================================
# CONFIGURATION
# ==================================

SHELL := bash

DB_NAME = dev_wiki
DB_USER = devwiki_admin
CONTAINER_NAME = dev-wiki-postgres
DOCKER_IMAGE_NAME = dev-wiki-postgres
DUMP_DIR = apps/db
TIMESTAMP = $(shell date +%Y%m%d-%H%M)
DUMP_FILE = $(DUMP_DIR)/dump-$(DB_NAME)-$(TIMESTAMP).dump

# ==================================
# UTILITIES
# ==================================

.PHONY: all up down restart logs dump reset clean ensure-dirs

# ==================================
# RUNTIME TASKS
# ==================================

up:
	@echo "Starting PostgreSQL container..."
	docker compose up -d --build

down:
	@echo "Stopping and removing container and volumes..."
	docker compose down -v

restart:
	@echo "Full restart (clean volumes and rebuild)..."
	docker compose down -v
	docker compose up --build

# ==================================
# DATABASE TASKS
# ==================================

reset: down up dump

# ==================================
# CLEAN TASK
# ==================================

clean:
	@echo "Cleaning dump files and Docker image..."
	rm -rf $(DUMP_DIR)/*.dump
	docker rmi -f $(DOCKER_IMAGE_NAME) || true
