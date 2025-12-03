package domain

type CreateTagDTO struct {
	Name        string  `json:"name" binding:"required,min=1,max=50"`
	Description *string `json:"description,omitempty"`
}

type UpdateTagDTO struct {
	Name        *string `json:"name,omitempty" binding:"omitempty,min=1,max=50"`
	Description *string `json:"description,omitempty"`
}

type TagResponseDTO struct {
	ID          uint    `json:"id"`
	Name        string  `json:"name"`
	Description *string `json:"description,omitempty"`
}

type TagSearchParams struct {
	Q        string  `form:"q"`
	Limit    int     `form:"limit"`
	Cursor   *string `form:"cursor"`
	MinChars int     `form:"minChars"`
}

// TagSearchResultDTO returns DTOs, not entities
type TagSearchResultDTO struct {
	Items      []TagResponseDTO `json:"items"`
	NextCursor *string          `json:"nextCursor"`
}
