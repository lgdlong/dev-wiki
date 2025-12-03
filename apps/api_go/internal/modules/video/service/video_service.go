package service

import (
	"errors"

	"api_go/internal/domain"
)

type videoService struct {
	repo        domain.VideoRepository
	videoTagSvc domain.VideoTagService
}

// NewVideoService creates a new VideoService instance
func NewVideoService(repo domain.VideoRepository, videoTagSvc domain.VideoTagService) domain.VideoService {
	return &videoService{
		repo:        repo,
		videoTagSvc: videoTagSvc,
	}
}

// toResponseDTO converts Video entity to VideoResponseDTO
func toResponseDTO(v *domain.Video) *domain.VideoResponseDTO {
	if v == nil {
		return nil
	}
	return &domain.VideoResponseDTO{
		ID:           v.ID,
		YoutubeID:    v.YoutubeID,
		Title:        v.Title,
		Description:  v.Description,
		ThumbnailURL: v.ThumbnailURL,
		Duration:     v.Duration,
		UploaderID:   v.UploaderID,
		ChannelTitle: v.ChannelTitle,
		Metadata:     v.Metadata,
		CreatedAt:    v.CreatedAt,
	}
}

// toResponseDTOList converts slice of Video entities to slice of VideoResponseDTO
func toResponseDTOList(videos []domain.Video) []domain.VideoResponseDTO {
	result := make([]domain.VideoResponseDTO, len(videos))
	for i := range videos {
		result[i] = *toResponseDTO(&videos[i])
	}
	return result
}

// Create creates a new video
func (s *videoService) Create(dto domain.CreateVideoDTO) (*domain.VideoResponseDTO, error) {
	// 1. Check duplicate YouTube ID
	existing, err := s.repo.FindByYoutubeID(dto.YoutubeID)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, errors.New("video with this YouTube ID already exists")
	}

	// 2. Create entity (YouTube metadata can be fetched externally)
	video := &domain.Video{
		YoutubeID:    dto.YoutubeID,
		Title:        dto.Title,
		Description:  dto.Description,
		ThumbnailURL: dto.ThumbnailURL,
		Duration:     dto.Duration,
		UploaderID:   dto.UploaderID,
		ChannelTitle: dto.ChannelTitle,
		Metadata:     dto.Metadata,
	}

	// 3. Save
	if err := s.repo.Create(video); err != nil {
		return nil, err
	}

	return toResponseDTO(video), nil
}

// FindAll retrieves all videos
func (s *videoService) FindAll() ([]domain.VideoResponseDTO, error) {
	videos, err := s.repo.FindAll()
	if err != nil {
		return nil, err
	}
	return toResponseDTOList(videos), nil
}

// FindOne retrieves a video by ID
func (s *videoService) FindOne(id uint) (*domain.VideoResponseDTO, error) {
	video, err := s.repo.FindOne(id)
	if err != nil {
		return nil, err
	}
	if video == nil {
		return nil, errors.New("video not found")
	}
	return toResponseDTO(video), nil
}

// FindByYoutubeID retrieves a video by YouTube ID
func (s *videoService) FindByYoutubeID(youtubeID string) (*domain.VideoResponseDTO, error) {
	video, err := s.repo.FindByYoutubeID(youtubeID)
	if err != nil {
		return nil, err
	}
	if video == nil {
		return nil, errors.New("video not found")
	}
	return toResponseDTO(video), nil
}

// Update updates a video
func (s *videoService) Update(id uint, dto domain.UpdateVideoDTO) (*domain.VideoResponseDTO, error) {
	// 1. Check exists
	existing, err := s.repo.FindOne(id)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, errors.New("video not found")
	}

	// 2. Build update
	update := &domain.Video{}
	if dto.Title != nil {
		update.Title = *dto.Title
	}
	if dto.Description != nil {
		update.Description = dto.Description
	}
	if dto.ThumbnailURL != nil {
		update.ThumbnailURL = dto.ThumbnailURL
	}
	if dto.Duration != nil {
		update.Duration = dto.Duration
	}
	if dto.ChannelTitle != nil {
		update.ChannelTitle = dto.ChannelTitle
	}
	if dto.Metadata != nil {
		update.Metadata = dto.Metadata
	}

	// 3. Update
	if err := s.repo.Update(id, update); err != nil {
		return nil, err
	}

	// 4. Fetch updated
	updated, err := s.repo.FindOne(id)
	if err != nil {
		return nil, err
	}

	return toResponseDTO(updated), nil
}

// Remove deletes a video
func (s *videoService) Remove(id uint) error {
	existing, err := s.repo.FindOne(id)
	if err != nil {
		return err
	}
	if existing == nil {
		return errors.New("video not found")
	}
	return s.repo.Delete(id)
}

// FindByUploaderID retrieves videos by uploader
func (s *videoService) FindByUploaderID(uploaderID uint) ([]domain.VideoResponseDTO, error) {
	videos, err := s.repo.FindByUploaderID(uploaderID)
	if err != nil {
		return nil, err
	}
	return toResponseDTOList(videos), nil
}

// FindByTagID retrieves videos by tag ID (via VideoTagService)
func (s *videoService) FindByTagID(tagID uint) ([]domain.VideoResponseDTO, error) {
	if s.videoTagSvc == nil {
		return nil, errors.New("video tag service not available")
	}
	return s.videoTagSvc.FindVideosByTag(tagID)
}

// FindByTagName retrieves videos by tag name
func (s *videoService) FindByTagName(tagName string) ([]domain.VideoResponseDTO, error) {
	if s.videoTagSvc == nil {
		return nil, errors.New("video tag service not available")
	}
	return s.videoTagSvc.FindVideosByTagName(tagName)
}
