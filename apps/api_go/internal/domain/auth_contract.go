package domain

// AuthService interface - handles authentication logic
type AuthService interface {
	// ValidateUser validates email/password and returns JWT + account info
	ValidateUser(email, password string) (*AuthResponseDTO, error)

	// Register creates a new user account
	Register(dto RegisterDTO) error

	// HandleGoogleLogin handles Google OAuth login (creates user if not exists)
	HandleGoogleLogin(profile GoogleProfile) (*AuthResponseDTO, error)

	// GenerateJWT generates a JWT token from payload
	GenerateJWT(payload JWTPayload) (string, error)

	// ValidateJWT validates a JWT token and returns the payload
	ValidateJWT(token string) (*JWTPayload, error)

	// GetUserFromToken extracts user info from JWT token
	GetUserFromToken(token string) (*AccountResponseDTO, error)
}
