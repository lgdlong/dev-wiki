package domain

import "gorm.io/gorm"

type Account struct {
	gorm.Model
	Email     string  `gorm:"column:email"`
	Name      string  `gorm:"column:name"`
	Password  string  `gorm:"column:password"`
	AvatarURL *string `gorm:"column:avatar_url"`
	Role      string  `gorm:"column:role"`
	Status    string  `gorm:"column:status"`
}

func (Account) TableName() string {
	return "accounts"
}
