package domain

import "time"

type CreateVideoTagDTO struct {
	VideoID uint `json:"videoId" binding:"required"`
	TagID   uint `json:"tagId" binding:"required"`
}

type UpsertVideoTagsDTO struct {
	VideoID uint   `json:"videoId" binding:"required"`
	TagIDs  []uint `json:"tagIds" binding:"required"`
}

type VideoTagResponseDTO struct {
	ID        uint      `json:"id"`
	VideoID   uint      `json:"videoId"`
	TagID     uint      `json:"tagId"`
	CreatedAt time.Time `json:"createdAt"`
	CreatedBy *uint     `json:"createdBy,omitempty"`
}
