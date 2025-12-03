package service

import (
	"errors"

	"api_go/internal/domain"
)

type voteService struct {
	repo domain.VoteRepository
}

// NewVoteService creates a new VoteService instance
func NewVoteService(repo domain.VoteRepository) domain.VoteService {
	return &voteService{repo: repo}
}

// toResponseDTO converts Vote entity to VoteResponseDTO
func toResponseDTO(v *domain.Vote) *domain.VoteResponseDTO {
	if v == nil {
		return nil
	}

	return &domain.VoteResponseDTO{
		ID:         v.ID,
		UserID:     v.UserID,
		EntityType: v.EntityType,
		EntityID:   v.EntityID,
		VoteType:   v.VoteType,
	}
}

// toResponseDTOList converts slice of Vote entities to slice of VoteResponseDTO
func toResponseDTOList(votes []domain.Vote) []domain.VoteResponseDTO {
	result := make([]domain.VoteResponseDTO, len(votes))
	for i := range votes {
		result[i] = *toResponseDTO(&votes[i])
	}
	return result
}

// Create creates a new vote
func (s *voteService) Create(dto domain.CreateVoteDTO) (*domain.VoteResponseDTO, error) {
	// Check if user already voted on this entity
	existing, err := s.repo.FindByUserAndEntity(dto.UserID, dto.EntityType, dto.EntityID)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, errors.New("user already voted on this entity")
	}

	vote := &domain.Vote{
		UserID:     dto.UserID,
		EntityType: dto.EntityType,
		EntityID:   dto.EntityID,
		VoteType:   dto.VoteType,
	}

	if err := s.repo.Create(vote); err != nil {
		return nil, err
	}

	// Fetch with relations
	created, err := s.repo.FindOne(vote.ID)
	if err != nil {
		return nil, err
	}

	return toResponseDTO(created), nil
}

// FindAll retrieves all votes
func (s *voteService) FindAll() ([]domain.VoteResponseDTO, error) {
	votes, err := s.repo.FindAll()
	if err != nil {
		return nil, err
	}
	return toResponseDTOList(votes), nil
}

// FindOne retrieves a vote by ID
func (s *voteService) FindOne(id uint) (*domain.VoteResponseDTO, error) {
	vote, err := s.repo.FindOne(id)
	if err != nil {
		return nil, err
	}
	if vote == nil {
		return nil, errors.New("vote not found")
	}
	return toResponseDTO(vote), nil
}

// Update updates a vote
func (s *voteService) Update(id uint, dto domain.UpdateVoteDTO) (*domain.VoteResponseDTO, error) {
	existing, err := s.repo.FindOne(id)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, errors.New("vote not found")
	}

	update := &domain.Vote{}
	if dto.VoteType != nil {
		update.VoteType = *dto.VoteType
	}

	if err := s.repo.Update(id, update); err != nil {
		return nil, err
	}

	updated, err := s.repo.FindOne(id)
	if err != nil {
		return nil, err
	}

	return toResponseDTO(updated), nil
}

// Remove deletes a vote
func (s *voteService) Remove(id uint) error {
	existing, err := s.repo.FindOne(id)
	if err != nil {
		return err
	}
	if existing == nil {
		return errors.New("vote not found")
	}
	return s.repo.Delete(id)
}

// FindByEntity retrieves votes by entity
func (s *voteService) FindByEntity(entityType domain.EntityType, entityID int64) ([]domain.VoteResponseDTO, error) {
	votes, err := s.repo.FindByEntity(entityType, entityID)
	if err != nil {
		return nil, err
	}
	return toResponseDTOList(votes), nil
}

// FindByUser retrieves votes by user
func (s *voteService) FindByUser(userID uint) ([]domain.VoteResponseDTO, error) {
	votes, err := s.repo.FindByUser(userID)
	if err != nil {
		return nil, err
	}
	return toResponseDTOList(votes), nil
}

// FindUserVoteOnEntity finds a user's vote on a specific entity
func (s *voteService) FindUserVoteOnEntity(userID uint, entityType domain.EntityType, entityID int64) (*domain.VoteResponseDTO, error) {
	vote, err := s.repo.FindByUserAndEntity(userID, entityType, entityID)
	if err != nil {
		return nil, err
	}
	if vote == nil {
		return nil, nil
	}
	return toResponseDTO(vote), nil
}

// GetVoteCounts returns upvote and downvote counts for an entity
func (s *voteService) GetVoteCounts(entityType domain.EntityType, entityID int64) (upvotes int64, downvotes int64, err error) {
	upvotes, err = s.repo.CountByEntity(entityType, entityID, domain.VoteTypeUp)
	if err != nil {
		return 0, 0, err
	}
	downvotes, err = s.repo.CountByEntity(entityType, entityID, domain.VoteTypeDown)
	if err != nil {
		return 0, 0, err
	}
	return upvotes, downvotes, nil
}

// ChangeVote creates, removes, or changes vote based on current state
func (s *voteService) ChangeVote(userID uint, entityType domain.EntityType, entityID int64, voteType domain.VoteType) (*domain.VoteResponseDTO, error) {
	existing, err := s.repo.FindByUserAndEntity(userID, entityType, entityID)
	if err != nil {
		return nil, err
	}

	// No existing vote - create new one
	if existing == nil {
		return s.Create(domain.CreateVoteDTO{
			UserID:     userID,
			EntityType: entityType,
			EntityID:   entityID,
			VoteType:   voteType,
		})
	}

	// Same vote type - remove it (toggle off)
	if existing.VoteType == voteType {
		if err := s.repo.Delete(existing.ID); err != nil {
			return nil, err
		}
		return nil, nil // Return nil to indicate vote removed
	}

	// Different vote type - change it
	update := &domain.Vote{VoteType: voteType}
	if err := s.repo.Update(existing.ID, update); err != nil {
		return nil, err
	}

	updated, err := s.repo.FindOne(existing.ID)
	if err != nil {
		return nil, err
	}

	return toResponseDTO(updated), nil
}

// RemoveUserVote removes a user's vote on an entity
func (s *voteService) RemoveUserVote(userID uint, entityType domain.EntityType, entityID int64) error {
	vote, err := s.repo.FindByUserAndEntity(userID, entityType, entityID)
	if err != nil {
		return err
	}
	if vote == nil {
		return errors.New("vote not found")
	}
	return s.repo.Delete(vote.ID)
}
