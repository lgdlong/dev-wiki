package domain

// VideoTagService interface
type VideoTagService interface {
	AttachOne(dto CreateVideoTagDTO, createdBy *uint) (*VideoTagResponseDTO, error)
	DetachOne(videoID, tagID uint) error
	UpsertForVideo(dto UpsertVideoTagsDTO, createdBy *uint) ([]TagResponseDTO, error)
	FindTagsByVideo(videoID uint) ([]TagResponseDTO, error)
	FindVideosByTag(tagID uint) ([]VideoResponseDTO, error)
	FindVideosByTagName(tagName string) ([]VideoResponseDTO, error)
}

// VideoTagRepository interface
type VideoTagRepository interface {
	Create(videoTag *VideoTag) error
	Delete(videoID, tagID uint) error
	DeleteByVideoID(videoID uint) error
	FindByVideoID(videoID uint) ([]VideoTag, error)
	FindByTagID(tagID uint) ([]VideoTag, error)
	FindOne(videoID, tagID uint) (*VideoTag, error)
	BulkCreate(videoTags []VideoTag) error
}
