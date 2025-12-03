package domain

// AccountService interface - business logic layer
type AccountService interface {
	Create(dto CreateAccountDTO) (*AccountResponseDTO, error)
	FindAll() ([]AccountResponseDTO, error)
	FindOne(id uint) (*AccountResponseDTO, error)
	FindByEmail(email string) (*AccountResponseDTO, error)
	Update(id uint, dto UpdateAccountDTO) (*AccountResponseDTO, error)
	Remove(id uint) (bool, error)
}

// AccountRepository interface - data access layer
type AccountRepository interface {
	Create(account *Account) error
	FindAll() ([]Account, error)
	FindOne(id uint) (*Account, error)
	FindByEmail(email string) (*Account, error)
	Update(id uint, update *Account) error
	Delete(id uint) error
}
