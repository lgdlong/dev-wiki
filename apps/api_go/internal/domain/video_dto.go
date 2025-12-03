package domain

import (
	"encoding/json"
	"time"
)

type CreateVideoDTO struct {
	YoutubeID    string          `json:"youtubeId" binding:"required"`
	Title        string          `json:"title,omitempty"`
	Description  *string         `json:"description,omitempty"`
	ThumbnailURL *string         `json:"thumbnailUrl,omitempty"`
	Duration     *int64          `json:"duration,omitempty"`
	UploaderID   *uint           `json:"uploaderId,omitempty"`
	ChannelTitle *string         `json:"channelTitle,omitempty"`
	Metadata     json.RawMessage `json:"metadata,omitempty"`
}

type UpdateVideoDTO struct {
	YoutubeID    *string         `json:"youtubeId,omitempty"`
	Title        *string         `json:"title,omitempty"`
	Description  *string         `json:"description,omitempty"`
	ThumbnailURL *string         `json:"thumbnailUrl,omitempty"`
	Duration     *int64          `json:"duration,omitempty"`
	UploaderID   *uint           `json:"uploaderId,omitempty"`
	ChannelTitle *string         `json:"channelTitle,omitempty"`
	Metadata     json.RawMessage `json:"metadata,omitempty"`
}

type VideoResponseDTO struct {
	ID           uint            `json:"id"`
	YoutubeID    string          `json:"youtubeId"`
	Title        string          `json:"title"`
	Description  *string         `json:"description,omitempty"`
	ThumbnailURL *string         `json:"thumbnailUrl,omitempty"`
	Duration     *int64          `json:"duration,omitempty"`
	UploaderID   *uint           `json:"uploaderId,omitempty"`
	ChannelTitle *string         `json:"channelTitle,omitempty"`
	Metadata     json.RawMessage `json:"metadata,omitempty"`
	CreatedAt    time.Time       `json:"createdAt"`
}
