package controller

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strings"

	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"

	"api_go/internal/config"
	"api_go/internal/domain"
)

type AuthController struct {
	config       *config.Config
	authService  domain.AuthService
	oauth2Config *oauth2.Config
}

// GoogleUserInfo represents the response from Google's userinfo endpoint
type GoogleUserInfo struct {
	ID            string `json:"id"`
	Email         string `json:"email"`
	VerifiedEmail bool   `json:"verified_email"`
	Name          string `json:"name"`
	GivenName     string `json:"given_name"`
	FamilyName    string `json:"family_name"`
	Picture       string `json:"picture"`
}

// NewAuthController creates a new AuthController instance
func NewAuthController(cfg *config.Config, authService domain.AuthService) *AuthController {
	oauth2Config := &oauth2.Config{
		ClientID:     cfg.GoogleClientID,
		ClientSecret: cfg.GoogleSecret,
		RedirectURL:  cfg.GoogleCallbackURL,
		Scopes: []string{
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		Endpoint: google.Endpoint,
	}

	return &AuthController{
		config:       cfg,
		authService:  authService,
		oauth2Config: oauth2Config,
	}
}

// RegisterRoutes registers auth routes
func (ctrl *AuthController) RegisterRoutes(r *gin.RouterGroup) {
	r.POST("/register", ctrl.Register)
	r.POST("/login", ctrl.Login)
	r.POST("/logout", ctrl.Logout)
	r.GET("/me", ctrl.GetMe)
	r.GET("/google", ctrl.GoogleAuth)
	r.GET("/google-redirect", ctrl.GoogleCallback)
}

// Register handles POST /register
// @Summary Register a new user
// @Description Create a new user account
// @Tags auth
// @Accept json
// @Produce json
// @Param dto body domain.RegisterDTO true "Register DTO"
// @Success 201 {object} map[string]string
// @Failure 400 {object} map[string]string
// @Router /register [post]
func (ctrl *AuthController) Register(c *gin.Context) {
	var dto domain.RegisterDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := ctrl.authService.Register(dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Registration successful! Please login to continue.",
	})
}

// Login handles POST /login
// @Summary Login user
// @Description Authenticate user with email and password
// @Tags auth
// @Accept json
// @Produce json
// @Param dto body domain.LoginDTO true "Login DTO"
// @Success 200 {object} domain.AuthResponseDTO
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Router /login [post]
func (ctrl *AuthController) Login(c *gin.Context) {
	var dto domain.LoginDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Normalize email
	email := strings.ToLower(strings.TrimSpace(dto.Email))
	password := strings.TrimSpace(dto.Password)

	result, err := ctrl.authService.ValidateUser(email, password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	// Set cookies
	ctrl.setAuthCookies(c, result)

	c.JSON(http.StatusOK, result)
}

// GetMe handles GET /me
// @Summary Get current user
// @Description Get the currently authenticated user
// @Tags auth
// @Produce json
// @Security BearerAuth
// @Success 200 {object} domain.MeResponseDTO
// @Failure 401 {object} map[string]string
// @Router /me [get]
func (ctrl *AuthController) GetMe(c *gin.Context) {
	// Extract token
	token := ctrl.extractToken(c)
	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "no token provided"})
		return
	}

	// Get user from token
	user, err := ctrl.authService.GetUserFromToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, domain.MeResponseDTO{
		User:        *user,
		AccessToken: token,
	})
}

// GoogleAuth handles GET /google
// @Summary Start Google OAuth
// @Description Redirect to Google OAuth login page
// @Tags auth
// @Success 302
// @Router /google [get]
func (ctrl *AuthController) GoogleAuth(c *gin.Context) {
	// Generate OAuth state token (in production, store this in session)
	state := "random-state-string" // TODO: Use secure random state

	url := ctrl.oauth2Config.AuthCodeURL(state, oauth2.AccessTypeOffline)
	c.Redirect(http.StatusTemporaryRedirect, url)
}

// GoogleCallback handles GET /google-redirect
// @Summary Google OAuth callback
// @Description Handle Google OAuth callback and authenticate user
// @Tags auth
// @Param code query string true "OAuth code"
// @Param state query string true "OAuth state"
// @Success 302
// @Failure 400 {object} map[string]string
// @Router /google-redirect [get]
func (ctrl *AuthController) GoogleCallback(c *gin.Context) {
	code := c.Query("code")
	if code == "" {
		ctrl.redirectWithError(c, "missing_code")
		return
	}

	// Exchange code for token
	token, err := ctrl.oauth2Config.Exchange(context.Background(), code)
	if err != nil {
		ctrl.redirectWithError(c, "token_exchange_failed")
		return
	}

	// Get user info from Google
	userInfo, err := ctrl.getGoogleUserInfo(token.AccessToken)
	if err != nil {
		ctrl.redirectWithError(c, "failed_to_get_user_info")
		return
	}

	// Create Google profile
	profile := domain.GoogleProfile{
		GoogleID:      userInfo.ID,
		Email:         userInfo.Email,
		Name:          userInfo.Name,
		Avatar:        userInfo.Picture,
		Provider:      "google",
		EmailVerified: userInfo.VerifiedEmail,
	}

	// Handle Google login (create user if not exists)
	result, err := ctrl.authService.HandleGoogleLogin(profile)
	if err != nil {
		ctrl.redirectWithError(c, "login_failed")
		return
	}

	// Set cookies
	ctrl.setAuthCookies(c, result)

	// Build redirect URL with user info
	redirectURL := ctrl.buildGoogleRedirectURL(result.Account)
	c.Redirect(http.StatusTemporaryRedirect, redirectURL)
}

// Logout handles POST /logout
// @Summary Logout user
// @Description Clear authentication cookies
// @Tags auth
// @Produce json
// @Success 200 {object} map[string]string
// @Router /logout [post]
func (ctrl *AuthController) Logout(c *gin.Context) {
	ctrl.clearAuthCookies(c)
	c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
}

// Helper methods

func (ctrl *AuthController) extractToken(c *gin.Context) string {
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

func (ctrl *AuthController) setAuthCookies(c *gin.Context, result *domain.AuthResponseDTO) {
	secure := ctrl.config.IsProduction()
	sameSite := http.SameSiteLaxMode
	maxAge := 7 * 24 * 60 * 60 // 7 days

	// Set JWT token cookie
	c.SetCookie("token", result.AccessToken, maxAge, "/", "", secure, true)

	// Set role cookie (not httpOnly so frontend can read it)
	c.SetSameSite(sameSite)
	c.SetCookie("role", result.Account.Role, maxAge, "/", "", secure, false)
}

func (ctrl *AuthController) clearAuthCookies(c *gin.Context) {
	c.SetCookie("token", "", -1, "/", "", false, true)
	c.SetCookie("role", "", -1, "/", "", false, false)
}

func (ctrl *AuthController) redirectWithError(c *gin.Context, errorCode string) {
	redirectURL := fmt.Sprintf("%s?error=%s", ctrl.config.FrontendURL, errorCode)
	c.Redirect(http.StatusTemporaryRedirect, redirectURL)
}

func (ctrl *AuthController) buildGoogleRedirectURL(account domain.AuthAccountResponse) string {
	params := url.Values{}
	params.Set("provider", "google")
	params.Set("id", fmt.Sprintf("%d", account.ID))
	params.Set("email", account.Email)
	params.Set("role", account.Role)
	if account.Name != "" {
		params.Set("name", account.Name)
	}
	if account.AvatarURL != nil {
		params.Set("avatar", *account.AvatarURL)
	}

	return fmt.Sprintf("%s?%s", ctrl.config.FrontendURL, params.Encode())
}

func (ctrl *AuthController) getGoogleUserInfo(accessToken string) (*GoogleUserInfo, error) {
	resp, err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token=" + accessToken)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var userInfo GoogleUserInfo
	if err := json.NewDecoder(resp.Body).Decode(&userInfo); err != nil {
		return nil, err
	}

	return &userInfo, nil
}
