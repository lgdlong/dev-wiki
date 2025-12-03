package repo

import (
	"errors"

	"gorm.io/gorm"

	"api_go/internal/domain"
)

type commentRepository struct {
	db *gorm.DB
}

// NewCommentRepository creates a new CommentRepository instance
func NewCommentRepository(db *gorm.DB) domain.CommentRepository {
	return &commentRepository{db: db}
}

// Create inserts a new comment into the database
func (r *commentRepository) Create(comment *domain.Comment) error {
	return r.db.Create(comment).Error
}

// FindAll retrieves all comments from the database
func (r *commentRepository) FindAll() ([]domain.Comment, error) {
	var comments []domain.Comment
	err := r.db.Preload("Author").Preload("Parent").Preload("Replies").Order("created_at DESC").Find(&comments).Error
	return comments, err
}

// FindOne retrieves a comment by ID
func (r *commentRepository) FindOne(id uint) (*domain.Comment, error) {
	var comment domain.Comment
	err := r.db.Preload("Author").Preload("Parent").Preload("Replies").First(&comment, id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &comment, nil
}

// Update updates an existing comment
func (r *commentRepository) Update(id uint, update *domain.Comment) error {
	result := r.db.Model(&domain.Comment{}).Where("id = ?", id).Updates(update)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

// Delete removes a comment by ID
func (r *commentRepository) Delete(id uint) error {
	result := r.db.Delete(&domain.Comment{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

// FindByEntity retrieves comments by entity type and ID
func (r *commentRepository) FindByEntity(entityType domain.EntityType, entityID int64) ([]domain.Comment, error) {
	var comments []domain.Comment
	err := r.db.Preload("Author").Preload("Parent").Preload("Replies").
		Where("entity_type = ? AND entity_id = ?", entityType, entityID).
		Order("created_at DESC").Find(&comments).Error
	return comments, err
}

// FindByAuthor retrieves comments by author ID
func (r *commentRepository) FindByAuthor(authorID uint) ([]domain.Comment, error) {
	var comments []domain.Comment
	err := r.db.Preload("Author").Preload("Parent").Preload("Replies").
		Where("author_id = ?", authorID).
		Order("created_at DESC").Find(&comments).Error
	return comments, err
}

// FindByParent retrieves replies to a comment
func (r *commentRepository) FindByParent(parentID uint) ([]domain.Comment, error) {
	var comments []domain.Comment
	err := r.db.Preload("Author").Preload("Replies").
		Where("parent_id = ?", parentID).
		Order("created_at ASC").Find(&comments).Error
	return comments, err
}
