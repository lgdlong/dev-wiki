package domain

import "gorm.io/gorm"

type Tag struct {
	gorm.Model
	Name        string  `gorm:"column:name;type:text;unique;not null"`
	Description *string `gorm:"column:description;type:text"`
}

func (Tag) TableName() string {
	return "tags"
}
