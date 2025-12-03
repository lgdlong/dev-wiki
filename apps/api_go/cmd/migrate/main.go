package main

import (
	"fmt"
	"log"

	"api_go/internal/config"
	"api_go/internal/database"
	"api_go/internal/domain"
)

func main() {
	// Load config
	cfg := config.Load()

	// Use shared GORM connection
	db := database.NewGormDB(cfg)

	// AutoMigrate all entities
	err := db.AutoMigrate(
		&domain.Account{},
		&domain.Tag{},
		&domain.Tutorial{},
		&domain.Video{},
		&domain.VideoTag{},
		&domain.Comment{},
		&domain.Vote{},
	)
	if err != nil {
		log.Fatalf("migration failed: %v", err)
	}

	fmt.Println("Migration completed successfully!")
}
