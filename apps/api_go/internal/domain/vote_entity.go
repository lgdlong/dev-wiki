package domain

import "gorm.io/gorm"

type Vote struct {
	gorm.Model
	UserID     uint       `gorm:"column:user_id;not null"`
	User       *Account   `gorm:"foreignKey:UserID"`
	EntityID   int64      `gorm:"column:entity_id;type:bigint;not null"`
	EntityType EntityType `gorm:"column:entity_type;type:varchar(20);not null"`
	VoteType   VoteType   `gorm:"column:vote_type;type:varchar(10);not null"`
}

func (Vote) TableName() string {
	return "votes"
}
