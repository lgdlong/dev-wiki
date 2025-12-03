package domain

import "time"

// VideoTag entity - maps to 'video_tags' table (junction table with extra field)
type VideoTag struct {
	ID        uint      `gorm:"primaryKey"`
	VideoID   uint      `gorm:"column:video_id;not null;uniqueIndex:idx_video_tag"`
	Video     *Video    `gorm:"foreignKey:VideoID;constraint:OnDelete:CASCADE"`
	TagID     uint      `gorm:"column:tag_id;not null;uniqueIndex:idx_video_tag"`
	Tag       *Tag      `gorm:"foreignKey:TagID;constraint:OnDelete:CASCADE"`
	CreatedAt time.Time `gorm:"column:created_at;autoCreateTime"`
	CreatedBy *uint     `gorm:"column:created_by"`
}

func (VideoTag) TableName() string {
	return "video_tags"
}
