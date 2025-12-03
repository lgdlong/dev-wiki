package domain

// TutorialService interface - returns DTOs
type TutorialService interface {
	Create(dto CreateTutorialDTO, authorID uint) (*TutorialDetailDTO, error)
	FindAll() ([]TutorialListItemDTO, error)
	FindOne(id uint) (*TutorialDetailDTO, error)
	FindBySlug(slug string) (*TutorialDetailDTO, error)
	Update(id uint, dto UpdateTutorialDTO, requesterID uint) (*TutorialDetailDTO, error)
	Remove(id uint, requesterID uint) error
}

// TutorialRepository interface - returns entities
type TutorialRepository interface {
	Create(tutorial *Tutorial) error
	FindAll() ([]Tutorial, error)
	FindOne(id uint) (*Tutorial, error)
	FindBySlug(slug string) (*Tutorial, error)
	FindOneWithTags(id uint) (*Tutorial, error)
	FindBySlugWithTags(slug string) (*Tutorial, error)
	Update(id uint, tutorial *Tutorial) error
	Delete(id uint) error
}
