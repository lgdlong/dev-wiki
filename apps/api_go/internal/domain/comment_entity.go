package domain

import "gorm.io/gorm"

// Comment entity - maps to 'comments' table
type Comment struct {
	gorm.Model
	Content    string     `gorm:"column:content;type:text;not null"`
	AuthorID   uint       `gorm:"column:author_id;not null"`
	Author     *Account   `gorm:"foreignKey:AuthorID"`
	ParentID   *uint      `gorm:"column:parent_id"`
	Parent     *Comment   `gorm:"foreignKey:ParentID"`
	Replies    []Comment  `gorm:"foreignKey:ParentID"`
	EntityType EntityType `gorm:"column:entity_type;type:varchar(20);not null;index:idx_entity"`
	EntityID   int64      `gorm:"column:entity_id;type:bigint;not null;index:idx_entity"`
	Upvotes    int64      `gorm:"column:upvotes;default:0"`
}

// TableName specifies the table name for Comment
func (Comment) TableName() string {
	return "comments"
}
