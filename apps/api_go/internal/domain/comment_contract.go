package domain

// CommentService interface - returns DTOs
type CommentService interface {
	Create(dto CreateCommentDTO) (*CommentResponseDTO, error)
	FindAll() ([]CommentResponseDTO, error)
	FindOne(id uint) (*CommentResponseDTO, error)
	Update(id uint, dto UpdateCommentDTO) (*CommentResponseDTO, error)
	Remove(id uint) error
	FindByEntity(entityType EntityType, entityID int64) ([]CommentResponseDTO, error)
	FindByAuthor(authorID uint) ([]CommentResponseDTO, error)
	FindReplies(parentID uint) ([]CommentResponseDTO, error)
	IncrementUpvotes(id uint) (*CommentResponseDTO, error)
	DecrementUpvotes(id uint) (*CommentResponseDTO, error)
}

// CommentRepository interface - returns entities
type CommentRepository interface {
	Create(comment *Comment) error
	FindAll() ([]Comment, error)
	FindOne(id uint) (*Comment, error)
	Update(id uint, comment *Comment) error
	Delete(id uint) error
	FindByEntity(entityType EntityType, entityID int64) ([]Comment, error)
	FindByAuthor(authorID uint) ([]Comment, error)
	FindByParent(parentID uint) ([]Comment, error)
}
