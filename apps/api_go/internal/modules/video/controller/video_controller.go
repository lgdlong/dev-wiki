package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"api_go/internal/domain"
)

type VideoController struct {
	service domain.VideoService
}

// NewVideoController creates a new VideoController instance
func NewVideoController(service domain.VideoService) *VideoController {
	return &VideoController{service: service}
}

// RegisterRoutes registers all video routes
func (ctrl *VideoController) RegisterRoutes(r *gin.RouterGroup) {
	videos := r.Group("/videos")
	{
		videos.POST("", ctrl.Create)
		videos.GET("", ctrl.FindAll)
		videos.GET("/youtube/:youtubeId", ctrl.FindByYoutubeID)
		videos.GET("/uploader/:uploaderId", ctrl.FindByUploaderID)
		videos.GET("/tag/:tagId", ctrl.FindByTag)
		videos.GET("/:id", ctrl.FindOne)
		videos.PATCH("/:id", ctrl.Update)
		videos.DELETE("/:id", ctrl.Remove)
	}
}

// Create handles POST /videos
// @Summary Create a new video
// @Description Create a new video entry with YouTube ID
// @Tags videos
// @Accept json
// @Produce json
// @Param dto body domain.CreateVideoDTO true "Create Video DTO"
// @Success 201 {object} domain.VideoResponseDTO
// @Failure 400 {object} map[string]string
// @Failure 409 {object} map[string]string
// @Router /videos [post]
func (ctrl *VideoController) Create(c *gin.Context) {
	var dto domain.CreateVideoDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	video, err := ctrl.service.Create(dto)
	if err != nil {
		if err.Error() == "video with this YouTube ID already exists" {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, video)
}

// FindAll handles GET /videos
// @Summary Get all videos
// @Description Retrieve all videos
// @Tags videos
// @Produce json
// @Success 200 {array} domain.VideoResponseDTO
// @Failure 500 {object} map[string]string
// @Router /videos [get]
func (ctrl *VideoController) FindAll(c *gin.Context) {
	videos, err := ctrl.service.FindAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, videos)
}

// FindOne handles GET /videos/:id
// @Summary Get a video by ID
// @Description Retrieve a single video by its ID
// @Tags videos
// @Produce json
// @Param id path int true "Video ID"
// @Success 200 {object} domain.VideoResponseDTO
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /videos/{id} [get]
func (ctrl *VideoController) FindOne(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	video, err := ctrl.service.FindOne(uint(id))
	if err != nil {
		if err.Error() == "video not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, video)
}

// FindByYoutubeID handles GET /videos/youtube/:youtubeId
// @Summary Get a video by YouTube ID
// @Description Retrieve a video by its YouTube video ID
// @Tags videos
// @Produce json
// @Param youtubeId path string true "YouTube Video ID"
// @Success 200 {object} domain.VideoResponseDTO
// @Failure 404 {object} map[string]string
// @Router /videos/youtube/{youtubeId} [get]
func (ctrl *VideoController) FindByYoutubeID(c *gin.Context) {
	youtubeID := c.Param("youtubeId")

	video, err := ctrl.service.FindByYoutubeID(youtubeID)
	if err != nil {
		if err.Error() == "video not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, video)
}

// FindByUploaderID handles GET /videos/uploader/:uploaderId
// @Summary Get videos by uploader
// @Description Retrieve all videos uploaded by a specific user
// @Tags videos
// @Produce json
// @Param uploaderId path int true "Uploader User ID"
// @Success 200 {array} domain.VideoResponseDTO
// @Failure 400 {object} map[string]string
// @Router /videos/uploader/{uploaderId} [get]
func (ctrl *VideoController) FindByUploaderID(c *gin.Context) {
	uploaderID, err := strconv.ParseUint(c.Param("uploaderId"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid uploader id"})
		return
	}

	videos, err := ctrl.service.FindByUploaderID(uint(uploaderID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, videos)
}

// FindByTag handles GET /videos/tag/:tagId
// @Summary Get videos by tag
// @Description Retrieve all videos with a specific tag
// @Tags videos
// @Produce json
// @Param tagId path int true "Tag ID"
// @Success 200 {array} domain.VideoResponseDTO
// @Failure 400 {object} map[string]string
// @Router /videos/tag/{tagId} [get]
func (ctrl *VideoController) FindByTag(c *gin.Context) {
	tagID, err := strconv.ParseUint(c.Param("tagId"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid tag id"})
		return
	}

	videos, err := ctrl.service.FindByTagID(uint(tagID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, videos)
}

// Update handles PATCH /videos/:id
// @Summary Update a video
// @Description Update an existing video
// @Tags videos
// @Accept json
// @Produce json
// @Param id path int true "Video ID"
// @Param dto body domain.UpdateVideoDTO true "Update Video DTO"
// @Success 200 {object} domain.VideoResponseDTO
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /videos/{id} [patch]
func (ctrl *VideoController) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var dto domain.UpdateVideoDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	video, err := ctrl.service.Update(uint(id), dto)
	if err != nil {
		if err.Error() == "video not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, video)
}

// Remove handles DELETE /videos/:id
// @Summary Delete a video
// @Description Delete a video by ID
// @Tags videos
// @Param id path int true "Video ID"
// @Success 200 {object} map[string]bool
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /videos/{id} [delete]
func (ctrl *VideoController) Remove(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	err = ctrl.service.Remove(uint(id))
	if err != nil {
		if err.Error() == "video not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"deleted": true})
}
