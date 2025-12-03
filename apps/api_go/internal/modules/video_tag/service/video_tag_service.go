package service

import (
	"errors"

	"api_go/internal/domain"
)

type videoTagService struct {
	repo      domain.VideoTagRepository
	videoRepo domain.VideoRepository
	tagRepo   domain.TagRepository
}

// NewVideoTagService creates a new VideoTagService instance
func NewVideoTagService(
	repo domain.VideoTagRepository,
	videoRepo domain.VideoRepository,
	tagRepo domain.TagRepository,
) domain.VideoTagService {
	return &videoTagService{
		repo:      repo,
		videoRepo: videoRepo,
		tagRepo:   tagRepo,
	}
}

// toTagResponseDTO converts Tag entity to TagResponseDTO
func toTagResponseDTO(tag *domain.Tag) domain.TagResponseDTO {
	return domain.TagResponseDTO{
		ID:          tag.ID,
		Name:        tag.Name,
		Description: tag.Description,
	}
}

// toVideoResponseDTO converts Video entity to VideoResponseDTO
func toVideoResponseDTO(video *domain.Video) domain.VideoResponseDTO {
	return domain.VideoResponseDTO{
		ID:           video.ID,
		YoutubeID:    video.YoutubeID,
		Title:        video.Title,
		Description:  video.Description,
		ThumbnailURL: video.ThumbnailURL,
		Duration:     video.Duration,
		UploaderID:   video.UploaderID,
		ChannelTitle: video.ChannelTitle,
		Metadata:     video.Metadata,
		CreatedAt:    video.CreatedAt,
	}
}

// AttachOne attaches a single tag to a video
func (s *videoTagService) AttachOne(dto domain.CreateVideoTagDTO, createdBy *uint) (*domain.VideoTagResponseDTO, error) {
	// 1. Check video exists
	video, err := s.videoRepo.FindOne(dto.VideoID)
	if err != nil {
		return nil, err
	}
	if video == nil {
		return nil, errors.New("video not found")
	}

	// 2. Check tag exists
	tag, err := s.tagRepo.FindOne(dto.TagID)
	if err != nil {
		return nil, err
	}
	if tag == nil {
		return nil, errors.New("tag not found")
	}

	// 3. Check if mapping already exists
	existing, err := s.repo.FindOne(dto.VideoID, dto.TagID)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, errors.New("mapping already exists")
	}

	// 4. Create video_tag
	videoTag := &domain.VideoTag{
		VideoID:   dto.VideoID,
		TagID:     dto.TagID,
		CreatedBy: createdBy,
	}

	if err := s.repo.Create(videoTag); err != nil {
		return nil, err
	}

	return &domain.VideoTagResponseDTO{
		ID:        videoTag.ID,
		VideoID:   videoTag.VideoID,
		TagID:     videoTag.TagID,
		CreatedAt: videoTag.CreatedAt,
		CreatedBy: videoTag.CreatedBy,
	}, nil
}

// DetachOne removes a tag from a video
func (s *videoTagService) DetachOne(videoID, tagID uint) error {
	return s.repo.Delete(videoID, tagID)
}

// UpsertForVideo replaces all tags for a video (idempotent)
func (s *videoTagService) UpsertForVideo(dto domain.UpsertVideoTagsDTO, createdBy *uint) ([]domain.TagResponseDTO, error) {
	// 1. Check video exists
	video, err := s.videoRepo.FindOne(dto.VideoID)
	if err != nil {
		return nil, err
	}
	if video == nil {
		return nil, errors.New("video not found")
	}

	// 2. Validate all tagIds exist
	for _, tagID := range dto.TagIDs {
		tag, err := s.tagRepo.FindOne(tagID)
		if err != nil {
			return nil, err
		}
		if tag == nil {
			return nil, errors.New("one or more tags not found")
		}
	}

	// 3. Get current mappings
	currentMappings, err := s.repo.FindByVideoID(dto.VideoID)
	if err != nil {
		return nil, err
	}

	currentTagIDs := make(map[uint]bool)
	for _, m := range currentMappings {
		currentTagIDs[m.TagID] = true
	}

	newTagIDs := make(map[uint]bool)
	for _, id := range dto.TagIDs {
		newTagIDs[id] = true
	}

	// 4. Calculate diff
	var toAdd []uint
	for id := range newTagIDs {
		if !currentTagIDs[id] {
			toAdd = append(toAdd, id)
		}
	}

	var toRemove []uint
	for id := range currentTagIDs {
		if !newTagIDs[id] {
			toRemove = append(toRemove, id)
		}
	}

	// 5. Remove old mappings
	for _, tagID := range toRemove {
		if err := s.repo.Delete(dto.VideoID, tagID); err != nil {
			return nil, err
		}
	}

	// 6. Add new mappings
	if len(toAdd) > 0 {
		newVideoTags := make([]domain.VideoTag, len(toAdd))
		for i, tagID := range toAdd {
			newVideoTags[i] = domain.VideoTag{
				VideoID:   dto.VideoID,
				TagID:     tagID,
				CreatedBy: createdBy,
			}
		}
		if err := s.repo.BulkCreate(newVideoTags); err != nil {
			return nil, err
		}
	}

	// 7. Return final tags
	return s.FindTagsByVideo(dto.VideoID)
}

// FindTagsByVideo returns all tags for a video
func (s *videoTagService) FindTagsByVideo(videoID uint) ([]domain.TagResponseDTO, error) {
	videoTags, err := s.repo.FindByVideoID(videoID)
	if err != nil {
		return nil, err
	}

	result := make([]domain.TagResponseDTO, 0, len(videoTags))
	for _, vt := range videoTags {
		if vt.Tag != nil {
			result = append(result, toTagResponseDTO(vt.Tag))
		}
	}
	return result, nil
}

// FindVideosByTag returns all videos for a tag
func (s *videoTagService) FindVideosByTag(tagID uint) ([]domain.VideoResponseDTO, error) {
	videoTags, err := s.repo.FindByTagID(tagID)
	if err != nil {
		return nil, err
	}

	result := make([]domain.VideoResponseDTO, 0, len(videoTags))
	for _, vt := range videoTags {
		if vt.Video != nil {
			result = append(result, toVideoResponseDTO(vt.Video))
		}
	}
	return result, nil
}

// FindVideosByTagName returns all videos for a tag by tag name
func (s *videoTagService) FindVideosByTagName(tagName string) ([]domain.VideoResponseDTO, error) {
	// Find tag by name
	tag, err := s.tagRepo.FindByName(tagName)
	if err != nil {
		return nil, err
	}
	if tag == nil {
		return []domain.VideoResponseDTO{}, nil
	}

	// Reuse existing FindVideosByTag method
	return s.FindVideosByTag(tag.ID)
}
