package repo

import (
	"errors"

	"gorm.io/gorm"

	"api_go/internal/domain"
)

type tutorialRepository struct {
	db *gorm.DB
}

// NewTutorialRepository creates a new TutorialRepository instance
func NewTutorialRepository(db *gorm.DB) domain.TutorialRepository {
	return &tutorialRepository{db: db}
}

// Create inserts a new tutorial into the database
func (r *tutorialRepository) Create(tutorial *domain.Tutorial) error {
	return r.db.Create(tutorial).Error
}

// FindAll retrieves all tutorials from the database
func (r *tutorialRepository) FindAll() ([]domain.Tutorial, error) {
	var tutorials []domain.Tutorial
	err := r.db.Preload("Author").Order("created_at DESC").Find(&tutorials).Error
	return tutorials, err
}

// FindOne retrieves a tutorial by ID
func (r *tutorialRepository) FindOne(id uint) (*domain.Tutorial, error) {
	var tutorial domain.Tutorial
	err := r.db.Preload("Author").First(&tutorial, id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &tutorial, nil
}

// FindBySlug retrieves a tutorial by slug
func (r *tutorialRepository) FindBySlug(slug string) (*domain.Tutorial, error) {
	var tutorial domain.Tutorial
	err := r.db.Preload("Author").Where("slug = ?", slug).First(&tutorial).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &tutorial, nil
}

// FindOneWithTags retrieves a tutorial by ID with tags
func (r *tutorialRepository) FindOneWithTags(id uint) (*domain.Tutorial, error) {
	var tutorial domain.Tutorial
	err := r.db.Preload("Author").Preload("Tags").First(&tutorial, id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &tutorial, nil
}

// FindBySlugWithTags retrieves a tutorial by slug with tags
func (r *tutorialRepository) FindBySlugWithTags(slug string) (*domain.Tutorial, error) {
	var tutorial domain.Tutorial
	err := r.db.Preload("Author").Preload("Tags").Where("slug = ?", slug).First(&tutorial).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &tutorial, nil
}

// Update updates an existing tutorial
func (r *tutorialRepository) Update(id uint, update *domain.Tutorial) error {
	result := r.db.Model(&domain.Tutorial{}).Where("id = ?", id).Updates(update)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

// Delete removes a tutorial by ID
func (r *tutorialRepository) Delete(id uint) error {
	result := r.db.Delete(&domain.Tutorial{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}
