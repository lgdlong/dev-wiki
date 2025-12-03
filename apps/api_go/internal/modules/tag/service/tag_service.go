package service

import (
	"errors"
	"strings"

	"api_go/internal/domain"
)

type tagService struct {
	repo domain.TagRepository
}

// NewTagService creates a new TagService instance
func NewTagService(repo domain.TagRepository) domain.TagService {
	return &tagService{repo: repo}
}

// toResponseDTO converts Tag entity to TagResponseDTO
func toResponseDTO(tag *domain.Tag) *domain.TagResponseDTO {
	if tag == nil {
		return nil
	}
	return &domain.TagResponseDTO{
		ID:          tag.ID,
		Name:        tag.Name,
		Description: tag.Description,
	}
}

// toResponseDTOList converts slice of Tag entities to slice of TagResponseDTO
func toResponseDTOList(tags []domain.Tag) []domain.TagResponseDTO {
	result := make([]domain.TagResponseDTO, len(tags))
	for i, tag := range tags {
		result[i] = domain.TagResponseDTO{
			ID:          tag.ID,
			Name:        tag.Name,
			Description: tag.Description,
		}
	}
	return result
}

// Create creates a new tag
func (s *tagService) Create(dto domain.CreateTagDTO) (*domain.TagResponseDTO, error) {
	// 1. Normalize name (lowercase, trim)
	normalizedName := strings.ToLower(strings.TrimSpace(dto.Name))

	// 2. Check if tag with same name already exists
	existing, err := s.repo.FindByName(normalizedName)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, errors.New("tag with this name already exists")
	}

	// 3. Create tag entity
	tag := &domain.Tag{
		Name:        normalizedName,
		Description: dto.Description,
	}

	// 4. Save to database
	if err := s.repo.Create(tag); err != nil {
		return nil, err
	}

	return toResponseDTO(tag), nil
}

// FindAll retrieves all tags
func (s *tagService) FindAll() ([]domain.TagResponseDTO, error) {
	tags, err := s.repo.FindAll()
	if err != nil {
		return nil, err
	}
	return toResponseDTOList(tags), nil
}

// FindOne retrieves a tag by ID
func (s *tagService) FindOne(id uint) (*domain.TagResponseDTO, error) {
	tag, err := s.repo.FindOne(id)
	if err != nil {
		return nil, err
	}
	if tag == nil {
		return nil, nil
	}
	return toResponseDTO(tag), nil
}

// FindByName retrieves a tag by name
func (s *tagService) FindByName(name string) (*domain.TagResponseDTO, error) {
	normalizedName := strings.ToLower(strings.TrimSpace(name))
	tag, err := s.repo.FindByName(normalizedName)
	if err != nil {
		return nil, err
	}
	if tag == nil {
		return nil, nil
	}
	return toResponseDTO(tag), nil
}

// Update updates an existing tag
func (s *tagService) Update(id uint, dto domain.UpdateTagDTO) (*domain.TagResponseDTO, error) {
	// 1. Check if tag exists
	existing, err := s.repo.FindOne(id)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, errors.New("tag not found")
	}

	// 2. Build update entity
	update := &domain.Tag{}

	if dto.Name != nil {
		normalizedName := strings.ToLower(strings.TrimSpace(*dto.Name))

		// Check if new name already exists (and is not the same tag)
		if normalizedName != existing.Name {
			existingWithName, err := s.repo.FindByName(normalizedName)
			if err != nil {
				return nil, err
			}
			if existingWithName != nil {
				return nil, errors.New("tag with this name already exists")
			}
		}
		update.Name = normalizedName
	}

	if dto.Description != nil {
		update.Description = dto.Description
	}

	// 3. Update in database
	if err := s.repo.Update(id, update); err != nil {
		return nil, err
	}

	// 4. Fetch updated tag
	updatedTag, err := s.repo.FindOne(id)
	if err != nil {
		return nil, err
	}

	return toResponseDTO(updatedTag), nil
}

// Remove deletes a tag by ID
func (s *tagService) Remove(id uint) error {
	// Check if tag exists
	existing, err := s.repo.FindOne(id)
	if err != nil {
		return err
	}
	if existing == nil {
		return errors.New("tag not found")
	}

	return s.repo.Delete(id)
}

// Search performs prefix search with keyset pagination
func (s *tagService) Search(params domain.TagSearchParams) (*domain.TagSearchResultDTO, error) {
	// Validate minChars
	minChars := params.MinChars
	if minChars <= 0 {
		minChars = 2
	}

	term := strings.TrimSpace(params.Q)

	// Don't query if query is too short
	if len(term) < minChars {
		return &domain.TagSearchResultDTO{
			Items:      []domain.TagResponseDTO{},
			NextCursor: nil,
		}, nil
	}

	// Set default limit
	limit := params.Limit
	if limit <= 0 {
		limit = 10
	}
	if limit > 50 {
		limit = 50
	}
	params.Limit = limit

	// Perform search
	tags, count, err := s.repo.Search(params)
	if err != nil {
		return nil, err
	}

	// Determine if there's more results
	hasMore := count > int64(limit)
	var items []domain.Tag
	if hasMore {
		items = tags[:limit]
	} else {
		items = tags
	}

	// Determine next cursor
	var nextCursor *string
	if hasMore && len(items) > 0 {
		lastItem := items[len(items)-1]
		nextCursor = &lastItem.Name
	}

	return &domain.TagSearchResultDTO{
		Items:      toResponseDTOList(items),
		NextCursor: nextCursor,
	}, nil
}
