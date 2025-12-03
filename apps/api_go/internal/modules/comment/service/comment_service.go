package service

import (
	"errors"

	"api_go/internal/domain"
)

type commentService struct {
	repo domain.CommentRepository
}

// NewCommentService creates a new CommentService instance
func NewCommentService(repo domain.CommentRepository) domain.CommentService {
	return &commentService{repo: repo}
}

// toResponseDTO converts Comment entity to CommentResponseDTO
func toResponseDTO(c *domain.Comment) *domain.CommentResponseDTO {
	if c == nil {
		return nil
	}

	authorName := ""
	if c.Author != nil {
		authorName = c.Author.Name
	}

	dto := &domain.CommentResponseDTO{
		ID:         c.ID,
		Content:    c.Content,
		AuthorID:   c.AuthorID,
		AuthorName: authorName,
		ParentID:   c.ParentID,
		EntityType: c.EntityType,
		EntityID:   c.EntityID,
		Upvotes:    c.Upvotes,
		CreatedAt:  c.CreatedAt,
		UpdatedAt:  c.UpdatedAt,
	}

	// Convert replies
	if len(c.Replies) > 0 {
		dto.Replies = make([]domain.CommentResponseDTO, len(c.Replies))
		for i, reply := range c.Replies {
			dto.Replies[i] = *toResponseDTO(&reply)
		}
	}

	return dto
}

// toResponseDTOList converts slice of Comment entities to slice of CommentResponseDTO
func toResponseDTOList(comments []domain.Comment) []domain.CommentResponseDTO {
	result := make([]domain.CommentResponseDTO, len(comments))
	for i := range comments {
		result[i] = *toResponseDTO(&comments[i])
	}
	return result
}

// Create creates a new comment
func (s *commentService) Create(dto domain.CreateCommentDTO) (*domain.CommentResponseDTO, error) {
	comment := &domain.Comment{
		Content:    dto.Content,
		AuthorID:   dto.AuthorID,
		ParentID:   dto.ParentID,
		EntityType: dto.EntityType,
		EntityID:   dto.EntityID,
		Upvotes:    0,
	}

	if err := s.repo.Create(comment); err != nil {
		return nil, err
	}

	// Fetch with relations
	created, err := s.repo.FindOne(comment.ID)
	if err != nil {
		return nil, err
	}

	return toResponseDTO(created), nil
}

// FindAll retrieves all comments
func (s *commentService) FindAll() ([]domain.CommentResponseDTO, error) {
	comments, err := s.repo.FindAll()
	if err != nil {
		return nil, err
	}
	return toResponseDTOList(comments), nil
}

// FindOne retrieves a comment by ID
func (s *commentService) FindOne(id uint) (*domain.CommentResponseDTO, error) {
	comment, err := s.repo.FindOne(id)
	if err != nil {
		return nil, err
	}
	if comment == nil {
		return nil, errors.New("comment not found")
	}
	return toResponseDTO(comment), nil
}

// Update updates a comment
func (s *commentService) Update(id uint, dto domain.UpdateCommentDTO) (*domain.CommentResponseDTO, error) {
	existing, err := s.repo.FindOne(id)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		return nil, errors.New("comment not found")
	}

	update := &domain.Comment{}
	if dto.Content != nil {
		update.Content = *dto.Content
	}
	if dto.Upvotes != nil {
		update.Upvotes = *dto.Upvotes
	}

	if err := s.repo.Update(id, update); err != nil {
		return nil, err
	}

	updated, err := s.repo.FindOne(id)
	if err != nil {
		return nil, err
	}

	return toResponseDTO(updated), nil
}

// Remove deletes a comment
func (s *commentService) Remove(id uint) error {
	existing, err := s.repo.FindOne(id)
	if err != nil {
		return err
	}
	if existing == nil {
		return errors.New("comment not found")
	}
	return s.repo.Delete(id)
}

// FindByEntity retrieves comments by entity
func (s *commentService) FindByEntity(entityType domain.EntityType, entityID int64) ([]domain.CommentResponseDTO, error) {
	comments, err := s.repo.FindByEntity(entityType, entityID)
	if err != nil {
		return nil, err
	}
	return toResponseDTOList(comments), nil
}

// FindByAuthor retrieves comments by author
func (s *commentService) FindByAuthor(authorID uint) ([]domain.CommentResponseDTO, error) {
	comments, err := s.repo.FindByAuthor(authorID)
	if err != nil {
		return nil, err
	}
	return toResponseDTOList(comments), nil
}

// FindReplies retrieves replies to a comment
func (s *commentService) FindReplies(parentID uint) ([]domain.CommentResponseDTO, error) {
	comments, err := s.repo.FindByParent(parentID)
	if err != nil {
		return nil, err
	}
	return toResponseDTOList(comments), nil
}

// IncrementUpvotes increments upvotes for a comment
func (s *commentService) IncrementUpvotes(id uint) (*domain.CommentResponseDTO, error) {
	comment, err := s.repo.FindOne(id)
	if err != nil {
		return nil, err
	}
	if comment == nil {
		return nil, errors.New("comment not found")
	}

	newUpvotes := comment.Upvotes + 1
	update := &domain.Comment{Upvotes: newUpvotes}

	if err := s.repo.Update(id, update); err != nil {
		return nil, err
	}

	updated, err := s.repo.FindOne(id)
	if err != nil {
		return nil, err
	}

	return toResponseDTO(updated), nil
}

// DecrementUpvotes decrements upvotes for a comment
func (s *commentService) DecrementUpvotes(id uint) (*domain.CommentResponseDTO, error) {
	comment, err := s.repo.FindOne(id)
	if err != nil {
		return nil, err
	}
	if comment == nil {
		return nil, errors.New("comment not found")
	}

	newUpvotes := comment.Upvotes - 1
	if newUpvotes < 0 {
		newUpvotes = 0
	}
	update := &domain.Comment{Upvotes: newUpvotes}

	if err := s.repo.Update(id, update); err != nil {
		return nil, err
	}

	updated, err := s.repo.FindOne(id)
	if err != nil {
		return nil, err
	}

	return toResponseDTO(updated), nil
}
