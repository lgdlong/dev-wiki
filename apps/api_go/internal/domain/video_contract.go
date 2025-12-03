package domain

// VideoService interface - returns DTOs
type VideoService interface {
	Create(dto CreateVideoDTO) (*VideoResponseDTO, error)
	FindAll() ([]VideoResponseDTO, error)
	FindOne(id uint) (*VideoResponseDTO, error)
	FindByYoutubeID(youtubeID string) (*VideoResponseDTO, error)
	Update(id uint, dto UpdateVideoDTO) (*VideoResponseDTO, error)
	Remove(id uint) error
	FindByUploaderID(uploaderID uint) ([]VideoResponseDTO, error)
	FindByTagID(tagID uint) ([]VideoResponseDTO, error)
	FindByTagName(tagName string) ([]VideoResponseDTO, error)
}

// VideoRepository interface - returns entities
type VideoRepository interface {
	Create(video *Video) error
	FindAll() ([]Video, error)
	FindOne(id uint) (*Video, error)
	FindByYoutubeID(youtubeID string) (*Video, error)
	Update(id uint, video *Video) error
	Delete(id uint) error
	FindByUploaderID(uploaderID uint) ([]Video, error)
}
