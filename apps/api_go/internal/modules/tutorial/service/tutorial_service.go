package service

import (
	"errors"
	"regexp"
	"strings"
	"unicode"

	"golang.org/x/text/unicode/norm"

	"api_go/internal/domain"
)

const (
	defaultAuthorName   = "Anonymous"
	defaultAuthorAvatar = ""
)

type tutorialService struct {
	repo domain.TutorialRepository
}

// NewTutorialService creates a new TutorialService instance
func NewTutorialService(repo domain.TutorialRepository) domain.TutorialService {
	return &tutorialService{repo: repo}
}

// generateSlug creates URL-friendly slug from title
func generateSlug(title string) string {
	// Normalize unicode
	s := norm.NFD.String(title)
	// Remove diacritics
	var result strings.Builder
	for _, r := range s {
		if unicode.Is(unicode.Mn, r) {
			continue
		}
		result.WriteRune(r)
	}
	slug := result.String()
	// To lowercase
	slug = strings.ToLower(slug)
	// Replace spaces with hyphens
	slug = strings.ReplaceAll(slug, " ", "-")
	// Remove special characters
	reg := regexp.MustCompile(`[^a-z0-9\-]`)
	slug = reg.ReplaceAllString(slug, "")
	// Remove multiple hyphens
	reg = regexp.MustCompile(`-+`)
	slug = reg.ReplaceAllString(slug, "-")
	// Trim hyphens
	slug = strings.Trim(slug, "-")
	return slug
}

// toListItemDTO converts Tutorial entity to TutorialListItemDTO
func toListItemDTO(t *domain.Tutorial) domain.TutorialListItemDTO {
	authorName := defaultAuthorName
	authorAvatar := defaultAuthorAvatar
	if t.Author != nil {
		authorName = t.Author.Name
		if t.Author.AvatarURL != nil {
			authorAvatar = *t.Author.AvatarURL
		}
	}
	return domain.TutorialListItemDTO{
		ID:              t.ID,
		Title:           t.Title,
		Slug:            t.Slug,
		CreatedAt:       t.CreatedAt,
		UpdatedAt:       t.UpdatedAt,
		AuthorName:      authorName,
		AuthorAvatarURL: authorAvatar,
	}
}

// toDetailDTO converts Tutorial entity to TutorialDetailDTO
func toDetailDTO(t *domain.Tutorial) *domain.TutorialDetailDTO {
	authorName := defaultAuthorName
	authorAvatar := defaultAuthorAvatar
	if t.Author != nil {
		authorName = t.Author.Name
		if t.Author.AvatarURL != nil {
			authorAvatar = *t.Author.AvatarURL
		}
	}

	tags := make([]domain.TagResponseDTO, len(t.Tags))
	for i, tag := range t.Tags {
		tags[i] = domain.TagResponseDTO{
			ID:          tag.ID,
			Name:        tag.Name,
			Description: tag.Description,
		}
	}

	return &domain.TutorialDetailDTO{
		ID:              t.ID,
		Title:           t.Title,
		Slug:            t.Slug,
		Content:         t.Content,
		Views:           t.Views,
		IsPublished:     t.IsPublished,
		CreatedAt:       t.CreatedAt,
		UpdatedAt:       t.UpdatedAt,
		AuthorName:      authorName,
		AuthorAvatarURL: authorAvatar,
		Tags:            tags,
	}
}

// Create creates a new tutorial
func (s *tutorialService) Create(dto domain.CreateTutorialDTO, authorID uint) (*domain.TutorialDetailDTO, error) {
	// 1. Validate
	title := strings.TrimSpace(dto.Title)
	content := strings.TrimSpace(dto.Content)
	slug := generateSlug(title)

	// 2. Check duplicate slug
	existing, err := s.repo.FindBySlug(slug)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, errors.New("a tutorial with a similar title already exists")
	}

	// 3. Create entity
	tutorial := &domain.Tutorial{
		Title:       title,
		Content:     content,
		Slug:        slug,
		AuthorID:    authorID,
		Views:       0,
		IsPublished: true,
	}

	// 4. Save
	if err := s.repo.Create(tutorial); err != nil {
		return nil, err
	}

	// 5. Fetch with author
	created, err := s.repo.FindOneWithTags(tutorial.ID)
	if err != nil {
		return nil, err
	}

	return toDetailDTO(created), nil
}

// FindAll retrieves all tutorials
func (s *tutorialService) FindAll() ([]domain.TutorialListItemDTO, error) {
	tutorials, err := s.repo.FindAll()
	if err != nil {
		return nil, err
	}

	result := make([]domain.TutorialListItemDTO, len(tutorials))
	for i := range tutorials {
		result[i] = toListItemDTO(&tutorials[i])
	}
	return result, nil
}

// FindOne retrieves a tutorial by ID
func (s *tutorialService) FindOne(id uint) (*domain.TutorialDetailDTO, error) {
	tutorial, err := s.repo.FindOneWithTags(id)
	if err != nil {
		return nil, err
	}
	if tutorial == nil {
		return nil, errors.New("tutorial not found")
	}
	return toDetailDTO(tutorial), nil
}

// FindBySlug retrieves a tutorial by slug
func (s *tutorialService) FindBySlug(slug string) (*domain.TutorialDetailDTO, error) {
	tutorial, err := s.repo.FindBySlugWithTags(slug)
	if err != nil {
		return nil, err
	}
	if tutorial == nil {
		return nil, errors.New("tutorial not found")
	}
	return toDetailDTO(tutorial), nil
}

// Update updates a tutorial
func (s *tutorialService) Update(id uint, dto domain.UpdateTutorialDTO, requesterID uint) (*domain.TutorialDetailDTO, error) {
	// 1. Check exists
	existing, err := s.repo.FindOne(id)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, errors.New("tutorial not found")
	}

	// 2. Build update
	update := &domain.Tutorial{}
	if dto.Title != nil {
		title := strings.TrimSpace(*dto.Title)
		update.Title = title
		update.Slug = generateSlug(title)
	}
	if dto.Content != nil {
		update.Content = strings.TrimSpace(*dto.Content)
	}

	// 3. Update
	if err := s.repo.Update(id, update); err != nil {
		return nil, err
	}

	// 4. Fetch updated
	updated, err := s.repo.FindOneWithTags(id)
	if err != nil {
		return nil, err
	}

	return toDetailDTO(updated), nil
}

// Remove deletes a tutorial
func (s *tutorialService) Remove(id uint, requesterID uint) error {
	existing, err := s.repo.FindOne(id)
	if err != nil {
		return err
	}
	if existing == nil {
		return errors.New("tutorial not found")
	}
	return s.repo.Delete(id)
}
