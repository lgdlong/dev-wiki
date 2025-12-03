package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"api_go/internal/domain"
)

type TutorialController struct {
	service domain.TutorialService
}

// NewTutorialController creates a new TutorialController instance
func NewTutorialController(service domain.TutorialService) *TutorialController {
	return &TutorialController{service: service}
}

// RegisterRoutes registers all tutorial routes
func (ctrl *TutorialController) RegisterRoutes(r *gin.RouterGroup) {
	tutorials := r.Group("/tutorials")
	{
		tutorials.POST("", ctrl.Create)
		tutorials.GET("", ctrl.FindAll)
		tutorials.GET("/slug/:slug", ctrl.FindBySlug)
		tutorials.GET("/:id", ctrl.FindOne)
		tutorials.PATCH("/:id", ctrl.Update)
		tutorials.DELETE("/:id", ctrl.Remove)
	}
}

// Create handles POST /tutorials
// @Summary Create a new tutorial
// @Description Create a new tutorial article
// @Tags tutorials
// @Accept json
// @Produce json
// @Param X-User-ID header int true "User ID"
// @Param dto body domain.CreateTutorialDTO true "Create Tutorial DTO"
// @Success 201 {object} domain.TutorialDetailDTO
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Router /tutorials [post]
func (ctrl *TutorialController) Create(c *gin.Context) {
	var dto domain.CreateTutorialDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// TODO: Get authorID from JWT context
	// For now, get from header or use default
	authorIDStr := c.GetHeader("X-User-ID")
	authorID, err := strconv.ParseUint(authorIDStr, 10, 32)
	if err != nil || authorID == 0 {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid user"})
		return
	}

	tutorial, err := ctrl.service.Create(dto, uint(authorID))
	if err != nil {
		if err.Error() == "a tutorial with a similar title already exists" {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, tutorial)
}

// FindAll handles GET /tutorials
// @Summary Get all tutorials
// @Description Retrieve all tutorials list
// @Tags tutorials
// @Produce json
// @Success 200 {array} domain.TutorialListItemDTO
// @Failure 500 {object} map[string]string
// @Router /tutorials [get]
func (ctrl *TutorialController) FindAll(c *gin.Context) {
	tutorials, err := ctrl.service.FindAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, tutorials)
}

// FindOne handles GET /tutorials/:id
// @Summary Get a tutorial by ID
// @Description Retrieve a single tutorial by its ID
// @Tags tutorials
// @Produce json
// @Param id path int true "Tutorial ID"
// @Success 200 {object} domain.TutorialDetailDTO
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /tutorials/{id} [get]
func (ctrl *TutorialController) FindOne(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	tutorial, err := ctrl.service.FindOne(uint(id))
	if err != nil {
		if err.Error() == "tutorial not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, tutorial)
}

// FindBySlug handles GET /tutorials/slug/:slug
// @Summary Get a tutorial by slug
// @Description Retrieve a tutorial by its URL slug
// @Tags tutorials
// @Produce json
// @Param slug path string true "Tutorial Slug"
// @Success 200 {object} domain.TutorialDetailDTO
// @Failure 404 {object} map[string]string
// @Router /tutorials/slug/{slug} [get]
func (ctrl *TutorialController) FindBySlug(c *gin.Context) {
	slug := c.Param("slug")

	tutorial, err := ctrl.service.FindBySlug(slug)
	if err != nil {
		if err.Error() == "tutorial not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, tutorial)
}

// Update handles PATCH /tutorials/:id
// @Summary Update a tutorial
// @Description Update an existing tutorial
// @Tags tutorials
// @Accept json
// @Produce json
// @Param id path int true "Tutorial ID"
// @Param X-User-ID header int false "User ID"
// @Param dto body domain.UpdateTutorialDTO true "Update Tutorial DTO"
// @Success 200 {object} domain.TutorialDetailDTO
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /tutorials/{id} [patch]
func (ctrl *TutorialController) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var dto domain.UpdateTutorialDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// TODO: Get userID from JWT context
	userIDStr := c.GetHeader("X-User-ID")
	userID, _ := strconv.ParseUint(userIDStr, 10, 32)

	tutorial, err := ctrl.service.Update(uint(id), dto, uint(userID))
	if err != nil {
		if err.Error() == "tutorial not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, tutorial)
}

// Remove handles DELETE /tutorials/:id
// @Summary Delete a tutorial
// @Description Delete a tutorial by ID
// @Tags tutorials
// @Param id path int true "Tutorial ID"
// @Param X-User-ID header int false "User ID"
// @Success 200 {object} map[string]int
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /tutorials/{id} [delete]
func (ctrl *TutorialController) Remove(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	// TODO: Get userID from JWT context
	userIDStr := c.GetHeader("X-User-ID")
	userID, _ := strconv.ParseUint(userIDStr, 10, 32)

	err = ctrl.service.Remove(uint(id), uint(userID))
	if err != nil {
		if err.Error() == "tutorial not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"id": id})
}
