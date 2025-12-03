package domain

import "time"

type CreateTutorialDTO struct {
	Title   string `json:"title" binding:"required,min=1,max=100"`
	Content string `json:"content" binding:"required"`
}

type UpdateTutorialDTO struct {
	Title   *string `json:"title,omitempty" binding:"omitempty,min=1,max=100"`
	Content *string `json:"content,omitempty" binding:"omitempty,min=1"`
}

type TutorialListItemDTO struct {
	ID              uint      `json:"id"`
	Title           string    `json:"title"`
	Slug            string    `json:"slug"`
	CreatedAt       time.Time `json:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt"`
	AuthorName      string    `json:"authorName"`
	AuthorAvatarURL string    `json:"authorAvatarUrl"`
}

type TutorialDetailDTO struct {
	ID              uint             `json:"id"`
	Title           string           `json:"title"`
	Slug            string           `json:"slug"`
	Content         string           `json:"content"`
	Views           int64            `json:"views"`
	IsPublished     bool             `json:"isPublished"`
	CreatedAt       time.Time        `json:"createdAt"`
	UpdatedAt       time.Time        `json:"updatedAt"`
	AuthorName      string           `json:"authorName"`
	AuthorAvatarURL string           `json:"authorAvatarUrl"`
	Tags            []TagResponseDTO `json:"tags"`
}
