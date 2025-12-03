package config

import (
	"os"
	"strconv"

	_ "github.com/joho/godotenv/autoload"
)

// Config holds all configuration for the application
type Config struct {
	Env         string
	Port        int
	APIBaseURL  string
	FrontendURL string

	// Database
	DBHost     string
	DBPort     string
	DBName     string
	DBUser     string
	DBPassword string
	DBSchema   string

	// Auth
	JWTSecret         string
	HashSaltRounds    int
	GoogleClientID    string
	GoogleSecret      string
	GoogleCallbackURL string

	// External
	YoutubeAPIKey string
}

// Load returns config based on NODE_ENV
func Load() *Config {
	env := getEnv("NODE_ENV", "development")
	isProd := env == "production"

	cfg := &Config{
		Env: env,

		// Shared
		JWTSecret:      getEnv("JWT_SECRET", "secret"),
		HashSaltRounds: getEnvInt("HASH_SALT_ROUNDS", 12),
		GoogleClientID: getEnv("GOOGLE_CLIENT_ID", ""),
		GoogleSecret:   getEnv("GOOGLE_CLIENT_SECRET", ""),
		YoutubeAPIKey:  getEnv("YOUTUBE_API_KEY", ""),
	}

	if isProd {
		cfg.Port = getEnvInt("PORT", 3000)
		cfg.APIBaseURL = getEnv("API_BASE_URL", "")
		cfg.FrontendURL = getEnv("FRONTEND_URL", "")
		cfg.GoogleCallbackURL = getEnv("GOOGLE_CALLBACK_URL", "")

		cfg.DBHost = getEnv("DB_HOST", "postgres")
		cfg.DBPort = getEnv("DB_PORT", "5432")
		cfg.DBName = getEnv("DB_NAME", "dev_wiki_prod")
		cfg.DBUser = getEnv("DB_USER", "postgres")
		cfg.DBPassword = getEnv("DB_PASSWORD", "")
		cfg.DBSchema = getEnv("DB_SCHEMA", "public")
	} else {
		cfg.Port = getEnvInt("PORT", 8080)
		cfg.APIBaseURL = getEnv("API_BASE_URL", "http://localhost:8080")
		cfg.FrontendURL = getEnv("FRONTEND_URL", "http://localhost:3000")
		cfg.GoogleCallbackURL = getEnv("GOOGLE_CALLBACK_URL", "http://localhost:8080/google-redirect")

		cfg.DBHost = getEnv("DB_HOST", "127.0.0.1")
		cfg.DBPort = getEnv("DB_PORT", "5432")
		cfg.DBName = getEnv("DB_NAME", "dev_wiki_local")
		cfg.DBUser = getEnv("DB_USER", "postgres")
		cfg.DBPassword = getEnv("DB_PASSWORD", "postgres")
		cfg.DBSchema = getEnv("DB_SCHEMA", "public")
	}

	return cfg
}

// LoadConfig is an alias for Load() for backward compatibility
func LoadConfig() (*Config, error) {
	return Load(), nil
}

// IsDevelopment returns true if running in development mode
func (c *Config) IsDevelopment() bool {
	return c.Env == "development"
}

// IsProduction returns true if running in production mode
func (c *Config) IsProduction() bool {
	return c.Env == "production"
}

func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

func getEnvInt(key string, fallback int) int {
	if value, exists := os.LookupEnv(key); exists {
		if intVal, err := strconv.Atoi(value); err == nil {
			return intVal
		}
	}
	return fallback
}
