package domain

import "gorm.io/gorm"

type Tutorial struct {
	gorm.Model
	Title       string   `gorm:"column:title;type:text;not null"`
	Content     string   `gorm:"column:content;type:text;not null"`
	AuthorID    uint     `gorm:"column:author_id;not null;index"`
	Author      *Account `gorm:"foreignKey:AuthorID"`
	Views       int64    `gorm:"column:views;default:0"`
	Slug        string   `gorm:"column:slug;type:varchar(255);unique;not null;index"`
	IsPublished bool     `gorm:"column:is_published;default:true"`
	// Many2Many with Tag through tutorial_tags table
	Tags []Tag `gorm:"many2many:tutorial_tags;joinForeignKey:tutorial_id;joinReferences:tag_id"`
}

func (Tutorial) TableName() string {
	return "tutorials"
}
