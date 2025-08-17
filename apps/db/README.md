# Database - Dev Wiki PostgreSQL Setup

> Database initialization scripts and sample data for the Dev Wiki platform.

## Directory Contents

- **`init.sh`** - Database initialization script that automatically restores from dump files
- **`*.dump`** - PostgreSQL database dump files with sample data
- **`sample_accounts.json`** - Sample user accounts for testing and development

## Quick Setup

### Using Docker (Recommended)

For step-by-step instructions on creating a database backup using DBeaver (with screenshots), see [How to Backup with DBeaver](./BACKUP_DUMP_DBEAVER.md).

```bash
# Start PostgreSQL with sample data
docker compose up -d

# Reset database (removes all data)
docker compose down -v
docker compose up -d
```

### Manual Database Operations

```bash
# Create database backup
pg_dump -U postgres -h localhost dev_wiki > backup_$(date +%Y%m%d_%H%M).dump

# Restore from backup
psql -U postgres -h localhost -d dev_wiki < backup_file.dump
```

## Sample Data

The database includes:
- Sample user accounts (see `sample_accounts.json`)
- Test categories and tags
- Example videos and tutorials
- Comment and voting data

### Default Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@admin.com | Abcd1234@ | Admin |
| phungluuhoanglong@gmail.com | Abcd1234@ | User |
| mod@mod.com | Abcd1234@ | Moderator |

## Configuration

Database runs on (development local defaults):

```env
DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=dev_wiki_local
USERNAME=postgres
PASSWORD=postgres
```

## Notes

- The `init.sh` script automatically runs when the container starts
- Only restores data if the database is empty
- Uses the most recent `.dump` file found
- Check the main [README](../../README.md) for full setup instructions
