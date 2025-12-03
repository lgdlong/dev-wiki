package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"api_go/internal/domain"
)

type VideoTagController struct {
	service domain.VideoTagService
}

// NewVideoTagController creates a new VideoTagController instance
func NewVideoTagController(service domain.VideoTagService) *VideoTagController {
	return &VideoTagController{service: service}
}

// RegisterRoutes registers all video-tag routes
func (ctrl *VideoTagController) RegisterRoutes(r *gin.RouterGroup) {
	// video-tags endpoints
	videoTags := r.Group("/video-tags")
	{
		videoTags.POST("", ctrl.AttachOne)
		videoTags.DELETE("/:videoId/:tagId", ctrl.DetachOne)
	}

	// Nested endpoints under /videos
	r.PATCH("/videos/:id/tags", ctrl.UpsertForVideo)
	r.GET("/videos/:id/tags", ctrl.FindTagsByVideo)

	// Nested endpoint under /tags
	r.GET("/tags/:id/videos", ctrl.FindVideosByTag)
}

// AttachOne handles POST /video-tags
// @Summary Attach a tag to a video
// @Description Create a new video-tag mapping
// @Tags video-tags
// @Accept json
// @Produce json
// @Param X-User-ID header int false "User ID"
// @Param dto body domain.CreateVideoTagDTO true "Create VideoTag DTO"
// @Success 201 {object} domain.VideoTagResponseDTO
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Failure 409 {object} map[string]string
// @Router /video-tags [post]
func (ctrl *VideoTagController) AttachOne(c *gin.Context) {
	var dto domain.CreateVideoTagDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get createdBy from header (TODO: from JWT)
	var createdBy *uint
	if userIDStr := c.GetHeader("X-User-ID"); userIDStr != "" {
		if id, err := strconv.ParseUint(userIDStr, 10, 32); err == nil {
			uid := uint(id)
			createdBy = &uid
		}
	}

	result, err := ctrl.service.AttachOne(dto, createdBy)
	if err != nil {
		switch err.Error() {
		case "video not found", "tag not found":
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		case "mapping already exists":
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	c.JSON(http.StatusCreated, result)
}

// DetachOne handles DELETE /video-tags/:videoId/:tagId
// @Summary Detach a tag from a video
// @Description Remove a video-tag mapping
// @Tags video-tags
// @Param videoId path int true "Video ID"
// @Param tagId path int true "Tag ID"
// @Success 200 {object} map[string]bool
// @Failure 400 {object} map[string]string
// @Router /video-tags/{videoId}/{tagId} [delete]
func (ctrl *VideoTagController) DetachOne(c *gin.Context) {
	videoID, err := strconv.ParseUint(c.Param("videoId"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid video id"})
		return
	}

	tagID, err := strconv.ParseUint(c.Param("tagId"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid tag id"})
		return
	}

	if err := ctrl.service.DetachOne(uint(videoID), uint(tagID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"deleted": true})
}

// UpsertForVideo handles PATCH /videos/:id/tags
// @Summary Update all tags for a video
// @Description Replace all tags for a video with new set
// @Tags video-tags
// @Accept json
// @Produce json
// @Param id path int true "Video ID"
// @Param X-User-ID header int false "User ID"
// @Param body body object true "Tag IDs" example({"tagIds": [1, 2, 3]})
// @Success 200 {array} domain.TagResponseDTO
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /videos/{id}/tags [patch]
func (ctrl *VideoTagController) UpsertForVideo(c *gin.Context) {
	videoID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid video id"})
		return
	}

	var body struct {
		TagIDs []uint `json:"tagIds" binding:"required"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get createdBy from header (TODO: from JWT)
	var createdBy *uint
	if userIDStr := c.GetHeader("X-User-ID"); userIDStr != "" {
		if id, err := strconv.ParseUint(userIDStr, 10, 32); err == nil {
			uid := uint(id)
			createdBy = &uid
		}
	}

	dto := domain.UpsertVideoTagsDTO{
		VideoID: uint(videoID),
		TagIDs:  body.TagIDs,
	}

	tags, err := ctrl.service.UpsertForVideo(dto, createdBy)
	if err != nil {
		switch err.Error() {
		case "video not found", "one or more tags not found":
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		default:
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, tags)
}

// FindTagsByVideo handles GET /videos/:id/tags
// @Summary Get all tags for a video
// @Description Retrieve all tags associated with a specific video
// @Tags video-tags
// @Produce json
// @Param id path int true "Video ID"
// @Success 200 {array} domain.TagResponseDTO
// @Failure 400 {object} map[string]string
// @Router /videos/{id}/tags [get]
func (ctrl *VideoTagController) FindTagsByVideo(c *gin.Context) {
	videoID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid video id"})
		return
	}

	tags, err := ctrl.service.FindTagsByVideo(uint(videoID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, tags)
}

// FindVideosByTag handles GET /tags/:id/videos
// @Summary Get all videos for a tag
// @Description Retrieve all videos associated with a specific tag
// @Tags video-tags
// @Produce json
// @Param id path int true "Tag ID"
// @Success 200 {array} domain.VideoResponseDTO
// @Failure 400 {object} map[string]string
// @Router /tags/{id}/videos [get]
func (ctrl *VideoTagController) FindVideosByTag(c *gin.Context) {
	tagID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid tag id"})
		return
	}

	videos, err := ctrl.service.FindVideosByTag(uint(tagID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, videos)
}
