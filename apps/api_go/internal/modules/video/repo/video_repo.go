package repo

import (
	"errors"

	"gorm.io/gorm"

	"api_go/internal/domain"
)

type videoRepository struct {
	db *gorm.DB
}

// NewVideoRepository creates a new VideoRepository instance
func NewVideoRepository(db *gorm.DB) domain.VideoRepository {
	return &videoRepository{db: db}
}

// Create inserts a new video into the database
func (r *videoRepository) Create(video *domain.Video) error {
	return r.db.Create(video).Error
}

// FindAll retrieves all videos from the database
func (r *videoRepository) FindAll() ([]domain.Video, error) {
	var videos []domain.Video
	err := r.db.Order("created_at DESC").Find(&videos).Error
	return videos, err
}

// FindOne retrieves a video by ID
func (r *videoRepository) FindOne(id uint) (*domain.Video, error) {
	var video domain.Video
	err := r.db.First(&video, id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &video, nil
}

// FindByYoutubeID retrieves a video by YouTube ID
func (r *videoRepository) FindByYoutubeID(youtubeID string) (*domain.Video, error) {
	var video domain.Video
	err := r.db.Where("youtube_id = ?", youtubeID).First(&video).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &video, nil
}

// Update updates an existing video
func (r *videoRepository) Update(id uint, update *domain.Video) error {
	result := r.db.Model(&domain.Video{}).Where("id = ?", id).Updates(update)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

// Delete removes a video by ID
func (r *videoRepository) Delete(id uint) error {
	result := r.db.Delete(&domain.Video{}, id)
	if result.Error != nil {
		return result.Error
	}
	if result.RowsAffected == 0 {
		return gorm.ErrRecordNotFound
	}
	return nil
}

// FindByUploaderID retrieves videos by uploader ID
func (r *videoRepository) FindByUploaderID(uploaderID uint) ([]domain.Video, error) {
	var videos []domain.Video
	err := r.db.Where("uploader_id = ?", uploaderID).Order("created_at DESC").Find(&videos).Error
	return videos, err
}
