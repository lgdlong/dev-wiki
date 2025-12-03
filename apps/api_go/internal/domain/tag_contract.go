package domain

// TagService interface - returns DTOs, not entities
type TagService interface {
	Create(dto CreateTagDTO) (*TagResponseDTO, error)
	FindAll() ([]TagResponseDTO, error)
	FindOne(id uint) (*TagResponseDTO, error)
	FindByName(name string) (*TagResponseDTO, error)
	Update(id uint, dto UpdateTagDTO) (*TagResponseDTO, error)
	Remove(id uint) error
	Search(params TagSearchParams) (*TagSearchResultDTO, error)
}

// TagRepository interface - returns entities
type TagRepository interface {
	Create(tag *Tag) error
	FindAll() ([]Tag, error)
	FindOne(id uint) (*Tag, error)
	FindByName(name string) (*Tag, error)
	Update(id uint, tag *Tag) error
	Delete(id uint) error
	Search(params TagSearchParams) ([]Tag, int64, error)
}
