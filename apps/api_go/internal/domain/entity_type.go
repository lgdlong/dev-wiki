package domain

// EntityType enum for votes and comments
type EntityType string

const (
	EntityTypeTutorial EntityType = "tutorial"
	EntityTypeVideo    EntityType = "video"
	EntityTypeProduct  EntityType = "product"
)
