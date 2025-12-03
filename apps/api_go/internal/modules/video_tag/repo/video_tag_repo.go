package repo

import (
	"errors"

	"gorm.io/gorm"

	"api_go/internal/domain"
)

type videoTagRepository struct {
	db *gorm.DB
}

// NewVideoTagRepository creates a new VideoTagRepository instance
func NewVideoTagRepository(db *gorm.DB) domain.VideoTagRepository {
	return &videoTagRepository{db: db}
}

// Create inserts a new video_tag into the database
func (r *videoTagRepository) Create(videoTag *domain.VideoTag) error {
	return r.db.Create(videoTag).Error
}

// Delete removes a video_tag by video_id and tag_id
func (r *videoTagRepository) Delete(videoID, tagID uint) error {
	result := r.db.Where("video_id = ? AND tag_id = ?", videoID, tagID).Delete(&domain.VideoTag{})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

// DeleteByVideoID removes all video_tags for a video
func (r *videoTagRepository) DeleteByVideoID(videoID uint) error {
	return r.db.Where("video_id = ?", videoID).Delete(&domain.VideoTag{}).Error
}

// FindByVideoID retrieves all video_tags for a video
func (r *videoTagRepository) FindByVideoID(videoID uint) ([]domain.VideoTag, error) {
	var videoTags []domain.VideoTag
	err := r.db.Preload("Tag").Where("video_id = ?", videoID).Find(&videoTags).Error
	return videoTags, err
}

// FindByTagID retrieves all video_tags for a tag
func (r *videoTagRepository) FindByTagID(tagID uint) ([]domain.VideoTag, error) {
	var videoTags []domain.VideoTag
	err := r.db.Preload("Video").Where("tag_id = ?", tagID).Order("created_at DESC").Find(&videoTags).Error
	return videoTags, err
}

// FindOne retrieves a specific video_tag
func (r *videoTagRepository) FindOne(videoID, tagID uint) (*domain.VideoTag, error) {
	var videoTag domain.VideoTag
	err := r.db.Preload("Video").Preload("Tag").Where("video_id = ? AND tag_id = ?", videoID, tagID).First(&videoTag).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &videoTag, nil
}

// BulkCreate inserts multiple video_tags
func (r *videoTagRepository) BulkCreate(videoTags []domain.VideoTag) error {
	if len(videoTags) == 0 {
		return nil
	}
	return r.db.Create(&videoTags).Error
}
