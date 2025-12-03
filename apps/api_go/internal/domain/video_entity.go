package domain

import (
	"encoding/json"

	"gorm.io/gorm"
)

type Video struct {
	gorm.Model
	YoutubeID    string          `gorm:"column:youtube_id;unique;not null"`
	Title        string          `gorm:"column:title;type:text;not null"`
	Description  *string         `gorm:"column:description;type:text"`
	ThumbnailURL *string         `gorm:"column:thumbnail_url;type:text"`
	Duration     *int64          `gorm:"column:duration;type:bigint"` // duration in seconds
	UploaderID   *uint           `gorm:"column:uploader_id;type:bigint"`
	ChannelTitle *string         `gorm:"column:channel_title;type:text"`
	Metadata     json.RawMessage `gorm:"column:metadata;type:jsonb"`
}

func (Video) TableName() string {
	return "videos"
}
