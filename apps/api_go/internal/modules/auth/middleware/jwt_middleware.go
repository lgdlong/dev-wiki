package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"

	"api_go/internal/domain"
)

// JWTMiddleware creates a JWT authentication middleware
func JWTMiddleware(authService domain.AuthService) gin.HandlerFunc {
	return func(c *gin.Context) {
		// 1. Extract token from Authorization header or cookie
		token := extractToken(c)
		if token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "no token provided"})
			c.Abort()
			return
		}

		// 2. Validate token
		payload, err := authService.ValidateJWT(token)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			c.Abort()
			return
		}

		// 3. Set user info in context
		c.Set("user_id", payload.Sub)
		c.Set("user_email", payload.Email)
		c.Set("user_role", payload.Role)
		c.Set("user_name", payload.Name)
		c.Set("user_provider", payload.Provider)
		c.Set("jwt_payload", payload)

		c.Next()
	}
}

// OptionalJWTMiddleware creates an optional JWT middleware (doesn't block if no token)
func OptionalJWTMiddleware(authService domain.AuthService) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := extractToken(c)
		if token == "" {
			c.Next()
			return
		}

		payload, err := authService.ValidateJWT(token)
		if err != nil {
			c.Next()
			return
		}

		c.Set("user_id", payload.Sub)
		c.Set("user_email", payload.Email)
		c.Set("user_role", payload.Role)
		c.Set("user_name", payload.Name)
		c.Set("user_provider", payload.Provider)
		c.Set("jwt_payload", payload)

		c.Next()
	}
}

// RoleMiddleware creates a role-based authorization middleware
func RoleMiddleware(allowedRoles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("user_role")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			c.Abort()
			return
		}

		userRole := role.(string)
		for _, allowedRole := range allowedRoles {
			if userRole == allowedRole {
				c.Next()
				return
			}
		}

		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		c.Abort()
	}
}

// extractToken extracts JWT token from Authorization header or cookie
func extractToken(c *gin.Context) string {
	// Try Authorization header first
	authHeader := c.GetHeader("Authorization")
	if authHeader != "" && strings.HasPrefix(authHeader, "Bearer ") {
		return strings.TrimPrefix(authHeader, "Bearer ")
	}

	// Try cookie
	if token, err := c.Cookie("token"); err == nil && token != "" {
		return token
	}

	return ""
}

// GetUserID helper to get user ID from context
func GetUserID(c *gin.Context) (uint, bool) {
	userID, exists := c.Get("user_id")
	if !exists {
		return 0, false
	}
	return userID.(uint), true
}

// GetUserRole helper to get user role from context
func GetUserRole(c *gin.Context) (string, bool) {
	role, exists := c.Get("user_role")
	if !exists {
		return "", false
	}
	return role.(string), true
}
