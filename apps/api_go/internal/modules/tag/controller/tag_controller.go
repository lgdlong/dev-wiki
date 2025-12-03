package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"api_go/internal/domain"
)

type TagController struct {
	service domain.TagService
}

// NewTagController creates a new TagController instance
func NewTagController(service domain.TagService) *TagController {
	return &TagController{service: service}
}

// RegisterRoutes registers all tag routes
func (ctrl *TagController) RegisterRoutes(r *gin.RouterGroup) {
	tags := r.Group("/tags")
	{
		tags.POST("", ctrl.Create)
		tags.GET("", ctrl.FindAll)
		tags.GET("/search", ctrl.Search)
		tags.GET("/name/:name", ctrl.FindByName)
		tags.GET("/:id", ctrl.FindOne)
		tags.PATCH("/:id", ctrl.Update)
		tags.DELETE("/:id", ctrl.Remove)
	}
}

// Create handles POST /tags
// @Summary Create a new tag
// @Tags tags
// @Accept json
// @Produce json
// @Param dto body domain.CreateTagDTO true "Create Tag DTO"
// @Success 201 {object} domain.TagResponseDTO
// @Failure 400 {object} map[string]string
// @Failure 409 {object} map[string]string
// @Router /tags [post]
func (ctrl *TagController) Create(c *gin.Context) {
	var dto domain.CreateTagDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tag, err := ctrl.service.Create(dto)
	if err != nil {
		if err.Error() == "tag with this name already exists" {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, tag)
}

// FindAll handles GET /tags
// @Summary Get all tags
// @Tags tags
// @Produce json
// @Success 200 {array} domain.TagResponseDTO
// @Failure 500 {object} map[string]string
// @Router /tags [get]
func (ctrl *TagController) FindAll(c *gin.Context) {
	tags, err := ctrl.service.FindAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, tags)
}

// Search handles GET /tags/search
// @Summary Search tags by prefix
// @Tags tags
// @Produce json
// @Param q query string false "Search query"
// @Param limit query int false "Limit results (default 10, max 50)"
// @Param cursor query string false "Cursor for pagination"
// @Param minChars query int false "Minimum characters to start search (default 2)"
// @Success 200 {object} domain.TagSearchResultDTO
// @Failure 500 {object} map[string]string
// @Router /tags/search [get]
func (ctrl *TagController) Search(c *gin.Context) {
	var params domain.TagSearchParams
	if err := c.ShouldBindQuery(&params); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	result, err := ctrl.service.Search(params)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, result)
}

// FindByName handles GET /tags/name/:name
// @Summary Get a tag by name
// @Tags tags
// @Produce json
// @Param name path string true "Tag name"
// @Success 200 {object} domain.TagResponseDTO
// @Failure 404 {object} map[string]string
// @Router /tags/name/{name} [get]
func (ctrl *TagController) FindByName(c *gin.Context) {
	name := c.Param("name")

	tag, err := ctrl.service.FindByName(name)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if tag == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "tag not found"})
		return
	}

	c.JSON(http.StatusOK, tag)
}

// FindOne handles GET /tags/:id
// @Summary Get a tag by ID
// @Tags tags
// @Produce json
// @Param id path int true "Tag ID"
// @Success 200 {object} domain.TagResponseDTO
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /tags/{id} [get]
func (ctrl *TagController) FindOne(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	tag, err := ctrl.service.FindOne(uint(id))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if tag == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "tag not found"})
		return
	}

	c.JSON(http.StatusOK, tag)
}

// Update handles PATCH /tags/:id
// @Summary Update a tag
// @Tags tags
// @Accept json
// @Produce json
// @Param id path int true "Tag ID"
// @Param dto body domain.UpdateTagDTO true "Update Tag DTO"
// @Success 200 {object} domain.TagResponseDTO
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 409 {object} map[string]string
// @Router /tags/{id} [patch]
func (ctrl *TagController) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var dto domain.UpdateTagDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	tag, err := ctrl.service.Update(uint(id), dto)
	if err != nil {
		switch err.Error() {
		case "tag not found":
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		case "tag with this name already exists":
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, tag)
}

// Remove handles DELETE /tags/:id
// @Summary Delete a tag
// @Tags tags
// @Param id path int true "Tag ID"
// @Success 200 {object} map[string]bool
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /tags/{id} [delete]
func (ctrl *TagController) Remove(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	err = ctrl.service.Remove(uint(id))
	if err != nil {
		if err.Error() == "tag not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"deleted": true})
}
