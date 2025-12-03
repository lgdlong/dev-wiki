package domain

// VoteService interface - returns DTOs
type VoteService interface {
	Create(dto CreateVoteDTO) (*VoteResponseDTO, error)
	FindAll() ([]VoteResponseDTO, error)
	FindOne(id uint) (*VoteResponseDTO, error)
	Update(id uint, dto UpdateVoteDTO) (*VoteResponseDTO, error)
	Remove(id uint) error
	FindByEntity(entityType EntityType, entityID int64) ([]VoteResponseDTO, error)
	FindByUser(userID uint) ([]VoteResponseDTO, error)
	FindUserVoteOnEntity(userID uint, entityType EntityType, entityID int64) (*VoteResponseDTO, error)
	GetVoteCounts(entityType EntityType, entityID int64) (upvotes int64, downvotes int64, err error)
	ChangeVote(userID uint, entityType EntityType, entityID int64, voteType VoteType) (*VoteResponseDTO, error)
	RemoveUserVote(userID uint, entityType EntityType, entityID int64) error
}

// VoteRepository interface - returns entities
type VoteRepository interface {
	Create(vote *Vote) error
	FindAll() ([]Vote, error)
	FindOne(id uint) (*Vote, error)
	FindByUserAndEntity(userID uint, entityType EntityType, entityID int64) (*Vote, error)
	Update(id uint, vote *Vote) error
	Delete(id uint) error
	FindByEntity(entityType EntityType, entityID int64) ([]Vote, error)
	FindByUser(userID uint) ([]Vote, error)
	CountByEntity(entityType EntityType, entityID int64, voteType VoteType) (int64, error)
}
