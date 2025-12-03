package domain

type CreateVoteDTO struct {
	UserID     uint       `json:"userId" binding:"required"`
	EntityID   int64      `json:"entityId" binding:"required"`
	EntityType EntityType `json:"entityType" binding:"required"`
	VoteType   VoteType   `json:"voteType" binding:"required"`
}

type UpdateVoteDTO struct {
	UserID     *uint       `json:"userId,omitempty"`
	EntityID   *int64      `json:"entityId,omitempty"`
	EntityType *EntityType `json:"entityType,omitempty"`
	VoteType   *VoteType   `json:"voteType,omitempty"`
}

type VoteResponseDTO struct {
	ID         uint       `json:"id"`
	UserID     uint       `json:"userId"`
	EntityID   int64      `json:"entityId"`
	EntityType EntityType `json:"entityType"`
	VoteType   VoteType   `json:"voteType"`
}
