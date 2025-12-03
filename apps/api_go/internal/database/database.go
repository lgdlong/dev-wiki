package database

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"strconv"
	"sync"
	"time"

	"api_go/internal/config"

	_ "github.com/jackc/pgx/v5/stdlib"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

// Service represents a service that interacts with a database.
type Service interface {
	// Health returns a map of health status information.
	Health() map[string]string

	// Close terminates the database connection.
	Close() error

	// DB returns the underlying sql.DB instance
	DB() *sql.DB
}

type service struct {
	db     *sql.DB
	config *config.Config
}

var (
	dbInstance *service
	gormDB     *gorm.DB
	once       sync.Once
	gormOnce   sync.Once
)

// NewWithConfig creates a new database service using config
func NewWithConfig(cfg *config.Config) Service {
	once.Do(func() {
		connStr := fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable&search_path=%s",
			cfg.DBUser, cfg.DBPassword, cfg.DBHost, cfg.DBPort, cfg.DBName, cfg.DBSchema)
		db, err := sql.Open("pgx", connStr)
		if err != nil {
			log.Fatalf("Failed to connect to database: %v", err)
		}
		dbInstance = &service{
			db:     db,
			config: cfg,
		}
		log.Printf("[%s] Database connected to %s:%s/%s", cfg.Env, cfg.DBHost, cfg.DBPort, cfg.DBName)
	})
	return dbInstance
}

// NewGormDB creates a GORM database connection using config (singleton, reusable)
func NewGormDB(cfg *config.Config) *gorm.DB {
	gormOnce.Do(func() {
		dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable search_path=%s",
			cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBPort, cfg.DBSchema)

		// Configure GORM logger based on environment
		var gormLogger logger.Interface
		if cfg.IsDevelopment() {
			gormLogger = logger.Default.LogMode(logger.Info)
		} else {
			gormLogger = logger.Default.LogMode(logger.Silent)
		}

		db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
			Logger: gormLogger,
		})
		if err != nil {
			log.Fatalf("Failed to connect to database with GORM: %v", err)
		}

		gormDB = db
		log.Printf("[%s] GORM Database connected to %s:%s/%s", cfg.Env, cfg.DBHost, cfg.DBPort, cfg.DBName)
	})
	return gormDB
}

// DB returns the underlying sql.DB instance
func (s *service) DB() *sql.DB {
	return s.db
}

// Health checks the health of the database connection by pinging the database.
// It returns a map with keys indicating various health statistics.
func (s *service) Health() map[string]string {
	ctx, cancel := context.WithTimeout(context.Background(), 1*time.Second)
	defer cancel()

	stats := make(map[string]string)

	// Ping the database
	err := s.db.PingContext(ctx)
	if err != nil {
		stats["status"] = "down"
		stats["error"] = fmt.Sprintf("db down: %v", err)
		log.Fatalf("db down: %v", err) // Log the error and terminate the program
		return stats
	}

	// Database is up, add more statistics
	stats["status"] = "up"
	stats["message"] = "It's healthy"

	// Get database stats (like open connections, in use, idle, etc.)
	dbStats := s.db.Stats()
	stats["open_connections"] = strconv.Itoa(dbStats.OpenConnections)
	stats["in_use"] = strconv.Itoa(dbStats.InUse)
	stats["idle"] = strconv.Itoa(dbStats.Idle)
	stats["wait_count"] = strconv.FormatInt(dbStats.WaitCount, 10)
	stats["wait_duration"] = dbStats.WaitDuration.String()
	stats["max_idle_closed"] = strconv.FormatInt(dbStats.MaxIdleClosed, 10)
	stats["max_lifetime_closed"] = strconv.FormatInt(dbStats.MaxLifetimeClosed, 10)

	// Evaluate stats to provide a health message
	if dbStats.OpenConnections > 40 { // Assuming 50 is the max for this example
		stats["message"] = "The database is experiencing heavy load."
	}

	if dbStats.WaitCount > 1000 {
		stats["message"] = "The database has a high number of wait events, indicating potential bottlenecks."
	}

	if dbStats.MaxIdleClosed > int64(dbStats.OpenConnections)/2 {
		stats["message"] = "Many idle connections are being closed, consider revising the connection pool settings."
	}

	if dbStats.MaxLifetimeClosed > int64(dbStats.OpenConnections)/2 {
		stats["message"] = "Many connections are being closed due to max lifetime, consider increasing max lifetime or revising the connection usage pattern."
	}

	return stats
}

// Close closes the database connection.
// It logs a message indicating the disconnection from the specific database.
// If the connection is successfully closed, it returns nil.
// If an error occurs while closing the connection, it returns the error.
func (s *service) Close() error {
	log.Printf("Disconnected from database: %s", s.config.DBName)
	return s.db.Close()
}
