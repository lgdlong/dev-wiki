package domain

// LoginDTO for user login request
type LoginDTO struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
}

// RegisterDTO for user registration request
type RegisterDTO struct {
	Email    string `json:"email" binding:"required,email"`
	Name     string `json:"name" binding:"required"`
	Password string `json:"password" binding:"required,min=8"`
}

// AuthResponseDTO for login/register response
type AuthResponseDTO struct {
	AccessToken string              `json:"access_token"`
	Account     AuthAccountResponse `json:"account"`
}

// AuthAccountResponse for authenticated user info
type AuthAccountResponse struct {
	ID        uint    `json:"id"`
	Email     string  `json:"email"`
	Role      string  `json:"role"`
	Name      string  `json:"name,omitempty"`
	AvatarURL *string `json:"avatar_url,omitempty"`
}

// JWTPayload for JWT token claims
type JWTPayload struct {
	Sub      uint   `json:"sub"`      // User ID
	Email    string `json:"email"`    // User email
	Role     string `json:"role"`     // User role
	Name     string `json:"name"`     // User name
	Avatar   string `json:"avatar"`   // Avatar URL (optional)
	Provider string `json:"provider"` // "local" or "google"
}

// GoogleProfile for Google OAuth user info
type GoogleProfile struct {
	GoogleID      string `json:"google_id"`
	Email         string `json:"email"`
	Name          string `json:"name"`
	Avatar        string `json:"avatar"`
	Provider      string `json:"provider"`
	EmailVerified bool   `json:"email_verified"`
}

// MeResponseDTO for /me endpoint
type MeResponseDTO struct {
	User        AccountResponseDTO `json:"user"`
	AccessToken string             `json:"access_token,omitempty"`
}
