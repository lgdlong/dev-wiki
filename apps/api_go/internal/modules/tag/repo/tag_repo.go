package repo

import (
	"errors"
	"strings"

	"gorm.io/gorm"

	"api_go/internal/domain"
)

type tagRepository struct {
	db *gorm.DB
}

// NewTagRepository creates a new TagRepository instance
func NewTagRepository(db *gorm.DB) domain.TagRepository {
	return &tagRepository{db: db}
}

// Create inserts a new tag into the database
func (r *tagRepository) Create(tag *domain.Tag) error {
	return r.db.Create(tag).Error
}

// FindAll retrieves all tags from the database
func (r *tagRepository) FindAll() ([]domain.Tag, error) {
	var tags []domain.Tag
	err := r.db.Find(&tags).Error
	return tags, err
}

// FindOne retrieves a tag by ID
func (r *tagRepository) FindOne(id uint) (*domain.Tag, error) {
	var tag domain.Tag
	err := r.db.First(&tag, id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &tag, nil
}

// FindByName retrieves a tag by name
func (r *tagRepository) FindByName(name string) (*domain.Tag, error) {
	var tag domain.Tag
	err := r.db.Where("name = ?", name).First(&tag).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &tag, nil
}

// Update updates an existing tag
func (r *tagRepository) Update(id uint, update *domain.Tag) error {
	result := r.db.Model(&domain.Tag{}).Where("id = ?", id).Updates(update)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

// Delete removes a tag by ID (soft delete via gorm.Model)
func (r *tagRepository) Delete(id uint) error {
	result := r.db.Delete(&domain.Tag{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

// Search performs prefix search with keyset pagination
func (r *tagRepository) Search(params domain.TagSearchParams) ([]domain.Tag, int64, error) {
	term := strings.ToLower(strings.TrimSpace(params.Q))
	limit := params.Limit
	if limit <= 0 {
		limit = 10
	}
	if limit > 50 {
		limit = 50
	}

	var tags []domain.Tag
	query := r.db.Model(&domain.Tag{}).
		Select("id, name").
		Where("LOWER(name) LIKE ?", term+"%").
		Order("name ASC").
		Limit(limit + 1) // fetch one extra to determine if there's more

	if params.Cursor != nil && *params.Cursor != "" {
		query = query.Where("name > ?", *params.Cursor)
	}

	err := query.Find(&tags).Error
	if err != nil {
		return nil, 0, err
	}

	return tags, int64(len(tags)), nil
}
