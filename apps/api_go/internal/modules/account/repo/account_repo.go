package repo

import (
	"errors"

	"gorm.io/gorm"

	"api_go/internal/domain"
)

type accountRepository struct {
	db *gorm.DB
}

// NewAccountRepository creates a new AccountRepository instance
func NewAccountRepository(db *gorm.DB) domain.AccountRepository {
	return &accountRepository{db: db}
}

// Create inserts a new account into the database
func (r *accountRepository) Create(account *domain.Account) error {
	return r.db.Create(account).Error
}

// FindAll retrieves all accounts from the database
func (r *accountRepository) FindAll() ([]domain.Account, error) {
	var accounts []domain.Account
	err := r.db.Find(&accounts).Error
	return accounts, err
}

// FindOne retrieves an account by ID
func (r *accountRepository) FindOne(id uint) (*domain.Account, error) {
	var account domain.Account
	err := r.db.First(&account, id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &account, nil
}

// FindByEmail retrieves an account by email
func (r *accountRepository) FindByEmail(email string) (*domain.Account, error) {
	var account domain.Account
	err := r.db.Where("email = ?", email).First(&account).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &account, nil
}

// Update updates an existing account
func (r *accountRepository) Update(id uint, update *domain.Account) error {
	result := r.db.Model(&domain.Account{}).Where("id = ?", id).Updates(update)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

// Delete removes an account by ID
func (r *accountRepository) Delete(id uint) error {
	result := r.db.Delete(&domain.Account{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}
