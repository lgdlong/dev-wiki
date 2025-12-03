package service

import (
	"errors"
	"math/rand"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"api_go/internal/config"
	"api_go/internal/domain"
)

type authService struct {
	config      *config.Config
	accountSvc  domain.AccountService
	accountRepo domain.AccountRepository
}

// NewAuthService creates a new AuthService instance
func NewAuthService(cfg *config.Config, accountSvc domain.AccountService, accountRepo domain.AccountRepository) domain.AuthService {
	return &authService{
		config:      cfg,
		accountSvc:  accountSvc,
		accountRepo: accountRepo,
	}
}

// ValidateUser validates email/password and returns JWT + account info
func (s *authService) ValidateUser(email, password string) (*domain.AuthResponseDTO, error) {
	// 1. Normalize email
	normalizedEmail := strings.ToLower(strings.TrimSpace(email))

	// 2. Find account by email (need raw entity with password)
	account, err := s.accountRepo.FindByEmail(normalizedEmail)
	if err != nil {
		return nil, err
	}
	if account == nil {
		return nil, errors.New("invalid credentials")
	}

	// 3. Compare password
	if err := bcrypt.CompareHashAndPassword([]byte(account.Password), []byte(password)); err != nil {
		return nil, errors.New("invalid credentials")
	}

	// 4. Generate JWT token
	payload := domain.JWTPayload{
		Sub:      account.ID,
		Email:    account.Email,
		Role:     account.Role,
		Name:     account.Name,
		Provider: "local",
	}
	if account.AvatarURL != nil {
		payload.Avatar = *account.AvatarURL
	}

	token, err := s.GenerateJWT(payload)
	if err != nil {
		return nil, err
	}

	// 5. Build response
	return &domain.AuthResponseDTO{
		AccessToken: token,
		Account: domain.AuthAccountResponse{
			ID:        account.ID,
			Email:     account.Email,
			Role:      account.Role,
			Name:      account.Name,
			AvatarURL: account.AvatarURL,
		},
	}, nil
}

// Register creates a new user account
func (s *authService) Register(dto domain.RegisterDTO) error {
	_, err := s.accountSvc.Create(domain.CreateAccountDTO{
		Email:    dto.Email,
		Name:     dto.Name,
		Password: dto.Password,
		Role:     string(domain.AccountRoleUser), // Default role for registration
	})
	return err
}

// HandleGoogleLogin handles Google OAuth login (creates user if not exists)
func (s *authService) HandleGoogleLogin(profile domain.GoogleProfile) (*domain.AuthResponseDTO, error) {
	// 1. Check if user exists by email
	account, err := s.accountRepo.FindByEmail(profile.Email)
	if err != nil {
		return nil, err
	}

	// 2. If user doesn't exist, create a new one
	if account == nil {
		// Generate a random password for Google users (they won't use it)
		randomPassword := generateRandomPassword(24)

		// Create account via service (handles password hashing)
		created, err := s.accountSvc.Create(domain.CreateAccountDTO{
			Email:    profile.Email,
			Name:     profile.Name,
			Password: randomPassword,
			Role:     string(domain.AccountRoleUser),
		})
		if err != nil {
			return nil, err
		}

		// Update avatar if provided
		if profile.Avatar != "" && created.ID != 0 {
			_, _ = s.accountSvc.Update(created.ID, domain.UpdateAccountDTO{
				AvatarURL: &profile.Avatar,
			})
		}

		// Fetch the created account
		account, err = s.accountRepo.FindByEmail(profile.Email)
		if err != nil {
			return nil, err
		}
	}

	// 3. Generate JWT token
	payload := domain.JWTPayload{
		Sub:      account.ID,
		Email:    account.Email,
		Role:     account.Role,
		Name:     account.Name,
		Provider: "google",
	}
	if account.AvatarURL != nil {
		payload.Avatar = *account.AvatarURL
	}

	token, err := s.GenerateJWT(payload)
	if err != nil {
		return nil, err
	}

	return &domain.AuthResponseDTO{
		AccessToken: token,
		Account: domain.AuthAccountResponse{
			ID:        account.ID,
			Email:     account.Email,
			Role:      account.Role,
			Name:      account.Name,
			AvatarURL: account.AvatarURL,
		},
	}, nil
}

// GenerateJWT generates a JWT token from payload
func (s *authService) GenerateJWT(payload domain.JWTPayload) (string, error) {
	claims := jwt.MapClaims{
		"sub":      payload.Sub,
		"email":    payload.Email,
		"role":     payload.Role,
		"name":     payload.Name,
		"avatar":   payload.Avatar,
		"provider": payload.Provider,
		"iat":      time.Now().Unix(),
		"exp":      time.Now().Add(7 * 24 * time.Hour).Unix(), // 7 days
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.config.JWTSecret))
}

// ValidateJWT validates a JWT token and returns the payload
func (s *authService) ValidateJWT(tokenString string) (*domain.JWTPayload, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Validate signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("unexpected signing method")
		}
		return []byte(s.config.JWTSecret), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		payload := &domain.JWTPayload{
			Email:    claims["email"].(string),
			Role:     claims["role"].(string),
			Name:     claims["name"].(string),
			Provider: claims["provider"].(string),
		}

		// Handle sub as float64 (JSON numbers are decoded as float64)
		if sub, ok := claims["sub"].(float64); ok {
			payload.Sub = uint(sub)
		}

		if avatar, ok := claims["avatar"].(string); ok {
			payload.Avatar = avatar
		}

		return payload, nil
	}

	return nil, errors.New("invalid token")
}

// GetUserFromToken extracts user info from JWT token
func (s *authService) GetUserFromToken(tokenString string) (*domain.AccountResponseDTO, error) {
	payload, err := s.ValidateJWT(tokenString)
	if err != nil {
		return nil, err
	}

	// Fetch user from database
	account, err := s.accountRepo.FindByEmail(payload.Email)
	if err != nil {
		return nil, err
	}
	if account == nil {
		return nil, errors.New("user not found")
	}

	return &domain.AccountResponseDTO{
		ID:        account.ID,
		Email:     account.Email,
		Name:      account.Name,
		AvatarURL: account.AvatarURL,
	}, nil
}

// generateRandomPassword generates a random password
func generateRandomPassword(length int) string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
	seededRand := rand.New(rand.NewSource(time.Now().UnixNano()))
	b := make([]byte, length)
	for i := range b {
		b[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(b)
}
