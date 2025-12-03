package repo

import (
	"errors"

	"gorm.io/gorm"

	"api_go/internal/domain"
)

type voteRepository struct {
	db *gorm.DB
}

// NewVoteRepository creates a new VoteRepository instance
func NewVoteRepository(db *gorm.DB) domain.VoteRepository {
	return &voteRepository{db: db}
}

// Create inserts a new vote into the database
func (r *voteRepository) Create(vote *domain.Vote) error {
	return r.db.Create(vote).Error
}

// FindAll retrieves all votes from the database
func (r *voteRepository) FindAll() ([]domain.Vote, error) {
	var votes []domain.Vote
	err := r.db.Preload("User").Order("created_at DESC").Find(&votes).Error
	return votes, err
}

// FindOne retrieves a vote by ID
func (r *voteRepository) FindOne(id uint) (*domain.Vote, error) {
	var vote domain.Vote
	err := r.db.Preload("User").First(&vote, id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &vote, nil
}

// Update updates an existing vote
func (r *voteRepository) Update(id uint, update *domain.Vote) error {
	result := r.db.Model(&domain.Vote{}).Where("id = ?", id).Updates(update)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

// Delete removes a vote by ID
func (r *voteRepository) Delete(id uint) error {
	result := r.db.Delete(&domain.Vote{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

// FindByEntity retrieves votes by entity type and ID
func (r *voteRepository) FindByEntity(entityType domain.EntityType, entityID int64) ([]domain.Vote, error) {
	var votes []domain.Vote
	err := r.db.Preload("User").
		Where("entity_type = ? AND entity_id = ?", entityType, entityID).
		Order("created_at DESC").Find(&votes).Error
	return votes, err
}

// FindByUser retrieves votes by user ID
func (r *voteRepository) FindByUser(userID uint) ([]domain.Vote, error) {
	var votes []domain.Vote
	err := r.db.Preload("User").
		Where("user_id = ?", userID).
		Order("created_at DESC").Find(&votes).Error
	return votes, err
}

// FindByUserAndEntity finds a user's vote on a specific entity
func (r *voteRepository) FindByUserAndEntity(userID uint, entityType domain.EntityType, entityID int64) (*domain.Vote, error) {
	var vote domain.Vote
	err := r.db.Preload("User").
		Where("user_id = ? AND entity_type = ? AND entity_id = ?", userID, entityType, entityID).
		First(&vote).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &vote, nil
}

// CountByEntity counts votes for an entity by vote type
func (r *voteRepository) CountByEntity(entityType domain.EntityType, entityID int64, voteType domain.VoteType) (int64, error) {
	var count int64
	err := r.db.Model(&domain.Vote{}).
		Where("entity_type = ? AND entity_id = ? AND vote_type = ?", entityType, entityID, voteType).
		Count(&count).Error
	return count, err
}
