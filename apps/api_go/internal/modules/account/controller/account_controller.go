package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"api_go/internal/domain"
)

type AccountController struct {
	service domain.AccountService
}

// NewAccountController creates a new AccountController instance
func NewAccountController(service domain.AccountService) *AccountController {
	return &AccountController{service: service}
}

// RegisterRoutes registers all account routes
func (ctrl *AccountController) RegisterRoutes(r *gin.RouterGroup) {
	accounts := r.Group("/accounts")
	{
		accounts.POST("", ctrl.Create)
		accounts.GET("", ctrl.FindAll)
		accounts.GET("/:id", ctrl.FindOne)
		accounts.PATCH("/:id", ctrl.Update)
		accounts.DELETE("/:id", ctrl.Remove)
	}
}

// Create handles POST /accounts
// @Summary Create a new account
// @Tags accounts
// @Accept json
// @Produce json
// @Param dto body domain.CreateAccountDTO true "Create Account DTO"
// @Success 201 {object} domain.AccountResponseDTO
// @Failure 400 {object} map[string]string
// @Failure 409 {object} map[string]string
// @Router /accounts [post]
func (ctrl *AccountController) Create(c *gin.Context) {
	var dto domain.CreateAccountDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	account, err := ctrl.service.Create(dto)
	if err != nil {
		if err.Error() == "email already registered" {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, account)
}

// FindAll handles GET /accounts
// @Summary Get all accounts
// @Tags accounts
// @Produce json
// @Success 200 {array} domain.AccountResponseDTO
// @Failure 500 {object} map[string]string
// @Router /accounts [get]
func (ctrl *AccountController) FindAll(c *gin.Context) {
	accounts, err := ctrl.service.FindAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, accounts)
}

// FindOne handles GET /accounts/:id
// @Summary Get an account by ID
// @Tags accounts
// @Produce json
// @Param id path int true "Account ID"
// @Success 200 {object} domain.AccountResponseDTO
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /accounts/{id} [get]
func (ctrl *AccountController) FindOne(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	account, err := ctrl.service.FindOne(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if account == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "account not found"})
		return
	}

	c.JSON(http.StatusOK, account)
}

// Update handles PATCH /accounts/:id
// @Summary Update an account
// @Tags accounts
// @Accept json
// @Produce json
// @Param id path int true "Account ID"
// @Param dto body domain.UpdateAccountDTO true "Update Account DTO"
// @Success 200 {object} domain.AccountResponseDTO
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /accounts/{id} [patch]
func (ctrl *AccountController) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var dto domain.UpdateAccountDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	account, err := ctrl.service.Update(uint(id), dto)
	if err != nil {
		if err.Error() == "record not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "account not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, account)
}

// Remove handles DELETE /accounts/:id
// @Summary Delete an account
// @Tags accounts
// @Param id path int true "Account ID"
// @Success 200 {object} map[string]bool
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /accounts/{id} [delete]
func (ctrl *AccountController) Remove(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	deleted, err := ctrl.service.Remove(uint(id))
	if err != nil {
		if err.Error() == "record not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "account not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"deleted": deleted})
}
