package service

import (
	"errors"
	"os"
	"strconv"
	"strings"

	"golang.org/x/crypto/bcrypt"

	"api_go/internal/domain"
)

const defaultSaltRounds = 10

type accountService struct {
	repo domain.AccountRepository
}

// NewAccountService creates a new AccountService instance
func NewAccountService(repo domain.AccountRepository) domain.AccountService {
	return &accountService{repo: repo}
}

// toResponseDTO converts Account entity to AccountResponseDTO
func toResponseDTO(account *domain.Account) *domain.AccountResponseDTO {
	if account == nil {
		return nil
	}
	return &domain.AccountResponseDTO{
		ID:        account.ID,
		Email:     account.Email,
		Name:      account.Name,
		Role:      account.Role,
		AvatarURL: account.AvatarURL,
	}
}

// toResponseDTOList converts slice of Account entities to slice of AccountResponseDTO
func toResponseDTOList(accounts []domain.Account) []domain.AccountResponseDTO {
	result := make([]domain.AccountResponseDTO, len(accounts))
	for i, account := range accounts {
		result[i] = domain.AccountResponseDTO{
			ID:        account.ID,
			Email:     account.Email,
			Name:      account.Name,
			Role:      account.Role,
			AvatarURL: account.AvatarURL,
		}
	}
	return result
}

// Create creates a new account with hashed password
func (s *accountService) Create(dto domain.CreateAccountDTO) (*domain.AccountResponseDTO, error) {
	// 1. Normalize email
	normalizedEmail := strings.ToLower(strings.TrimSpace(dto.Email))

	// 2. Check if email already exists
	existing, err := s.repo.FindByEmail(normalizedEmail)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, errors.New("email already registered")
	}

	// 3. Hash password
	saltRounds := defaultSaltRounds
	if envSalt := os.Getenv("HASH_SALT_ROUNDS"); envSalt != "" {
		if parsed, err := strconv.Atoi(envSalt); err == nil && parsed >= 4 {
			saltRounds = parsed
		}
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(dto.Password), saltRounds)
	if err != nil {
		return nil, err
	}

	// 4. Create account entity
	account := &domain.Account{
		Email:    normalizedEmail,
		Name:     dto.Name,
		Password: string(hashedPassword),
		Role:     dto.Role,
		Status:   string(domain.AccountStatusActive),
	}

	// 5. Save to database
	if err := s.repo.Create(account); err != nil {
		return nil, err
	}

	return toResponseDTO(account), nil
}

// FindAll retrieves all accounts
func (s *accountService) FindAll() ([]domain.AccountResponseDTO, error) {
	accounts, err := s.repo.FindAll()
	if err != nil {
		return nil, err
	}
	return toResponseDTOList(accounts), nil
}

// FindOne retrieves an account by ID
func (s *accountService) FindOne(id uint) (*domain.AccountResponseDTO, error) {
	account, err := s.repo.FindOne(id)
	if err != nil {
		return nil, err
	}
	if account == nil {
		return nil, nil
	}
	return toResponseDTO(account), nil
}

// FindByEmail retrieves an account by email
func (s *accountService) FindByEmail(email string) (*domain.AccountResponseDTO, error) {
	normalizedEmail := strings.ToLower(strings.TrimSpace(email))
	account, err := s.repo.FindByEmail(normalizedEmail)
	if err != nil {
		return nil, err
	}
	if account == nil {
		return nil, nil
	}
	return toResponseDTO(account), nil
}

// Update updates an existing account
func (s *accountService) Update(id uint, dto domain.UpdateAccountDTO) (*domain.AccountResponseDTO, error) {
	// Build update entity
	update := &domain.Account{}

	if dto.Email != nil {
		update.Email = strings.ToLower(strings.TrimSpace(*dto.Email))
	}
	if dto.Name != nil {
		update.Name = *dto.Name
	}
	if dto.Password != nil {
		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(*dto.Password), defaultSaltRounds)
		if err != nil {
			return nil, err
		}
		update.Password = string(hashedPassword)
	}
	if dto.Role != nil {
		update.Role = *dto.Role
	}
	if dto.AvatarURL != nil {
		update.AvatarURL = dto.AvatarURL
	}

	// Update in database
	if err := s.repo.Update(id, update); err != nil {
		return nil, err
	}

	// Fetch updated account
	return s.FindOne(id)
}

// Remove deletes an account by ID
func (s *accountService) Remove(id uint) (bool, error) {
	err := s.repo.Delete(id)
	if err != nil {
		return false, err
	}
	return true, nil
}
