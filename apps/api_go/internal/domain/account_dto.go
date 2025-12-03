package domain

type AccountResponseDTO struct {
	ID        uint    `json:"id"`
	Email     string  `json:"email"`
	Name      string  `json:"name"`
	AvatarURL *string `json:"avatar_url,omitempty"`
}

type CreateAccountDTO struct {
	Email    string `json:"email"`
	Name     string `json:"name"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

type UpdateAccountDTO struct {
	Email     *string `json:"email,omitempty"`
	Name      *string `json:"name,omitempty"`
	Password  *string `json:"password,omitempty"`
	Role      *string `json:"role,omitempty"`
	AvatarURL *string `json:"avatar_url,omitempty"`
}
