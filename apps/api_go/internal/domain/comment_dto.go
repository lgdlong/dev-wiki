package domain

import "time"

type CreateCommentDTO struct {
	Content    string     `json:"content" binding:"required"`
	AuthorID   uint       `json:"authorId" binding:"required"`
	ParentID   *uint      `json:"parentId,omitempty"`
	EntityType EntityType `json:"entityType" binding:"required"`
	EntityID   int64      `json:"entityId" binding:"required"`
}

type UpdateCommentDTO struct {
	Content *string `json:"content,omitempty"`
	Upvotes *int64  `json:"upvotes,omitempty"`
}

type CommentResponseDTO struct {
	ID         uint                 `json:"id"`
	Content    string               `json:"content"`
	AuthorID   uint                 `json:"authorId"`
	AuthorName string               `json:"authorName,omitempty"`
	ParentID   *uint                `json:"parentId,omitempty"`
	EntityType EntityType           `json:"entityType"`
	EntityID   int64                `json:"entityId"`
	Upvotes    int64                `json:"upvotes"`
	CreatedAt  time.Time            `json:"createdAt"`
	UpdatedAt  time.Time            `json:"updatedAt"`
	Replies    []CommentResponseDTO `json:"replies,omitempty"`
}
