package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"api_go/internal/domain"
)

type CommentController struct {
	service domain.CommentService
}

// NewCommentController creates a new CommentController instance
func NewCommentController(service domain.CommentService) *CommentController {
	return &CommentController{service: service}
}

// RegisterRoutes registers all comment routes
func (ctrl *CommentController) RegisterRoutes(r *gin.RouterGroup) {
	comments := r.Group("/comments")
	{
		comments.POST("", ctrl.Create)
		comments.GET("", ctrl.FindAll)
		comments.GET("/entity/:entityType/:entityId", ctrl.FindByEntity)
		comments.GET("/author/:authorId", ctrl.FindByAuthor)
		comments.GET("/replies/:parentId", ctrl.FindReplies)
		comments.GET("/:id", ctrl.FindOne)
		comments.PATCH("/:id", ctrl.Update)
		comments.PATCH("/:id/upvote", ctrl.IncrementUpvotes)
		comments.PATCH("/:id/downvote", ctrl.DecrementUpvotes)
		comments.DELETE("/:id", ctrl.Remove)
	}
}

// Create handles POST /comments
// @Summary Create a new comment
// @Description Create a new comment on an entity
// @Tags comments
// @Accept json
// @Produce json
// @Param dto body domain.CreateCommentDTO true "Create Comment DTO"
// @Success 201 {object} domain.CommentResponseDTO
// @Failure 400 {object} map[string]string
// @Router /comments [post]
func (ctrl *CommentController) Create(c *gin.Context) {
	var dto domain.CreateCommentDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	comment, err := ctrl.service.Create(dto)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, comment)
}

// FindAll handles GET /comments
// @Summary Get all comments
// @Description Retrieve all comments
// @Tags comments
// @Produce json
// @Success 200 {array} domain.CommentResponseDTO
// @Failure 500 {object} map[string]string
// @Router /comments [get]
func (ctrl *CommentController) FindAll(c *gin.Context) {
	comments, err := ctrl.service.FindAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, comments)
}

// FindOne handles GET /comments/:id
// @Summary Get a comment by ID
// @Description Retrieve a single comment by its ID
// @Tags comments
// @Produce json
// @Param id path int true "Comment ID"
// @Success 200 {object} domain.CommentResponseDTO
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /comments/{id} [get]
func (ctrl *CommentController) FindOne(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	comment, err := ctrl.service.FindOne(uint(id))
	if err != nil {
		if err.Error() == "comment not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, comment)
}

// FindByEntity handles GET /comments/entity/:entityType/:entityId
// @Summary Get comments by entity
// @Description Retrieve all comments for a specific entity (video, tutorial, etc.)
// @Tags comments
// @Produce json
// @Param entityType path string true "Entity Type (video, tutorial)"
// @Param entityId path int true "Entity ID"
// @Success 200 {array} domain.CommentResponseDTO
// @Failure 400 {object} map[string]string
// @Router /comments/entity/{entityType}/{entityId} [get]
func (ctrl *CommentController) FindByEntity(c *gin.Context) {
	entityType := domain.EntityType(c.Param("entityType"))
	entityID, err := strconv.ParseInt(c.Param("entityId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid entity id"})
		return
	}

	comments, err := ctrl.service.FindByEntity(entityType, entityID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, comments)
}

// FindByAuthor handles GET /comments/author/:authorId
// @Summary Get comments by author
// @Description Retrieve all comments by a specific author
// @Tags comments
// @Produce json
// @Param authorId path int true "Author User ID"
// @Success 200 {array} domain.CommentResponseDTO
// @Failure 400 {object} map[string]string
// @Router /comments/author/{authorId} [get]
func (ctrl *CommentController) FindByAuthor(c *gin.Context) {
	authorID, err := strconv.ParseUint(c.Param("authorId"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid author id"})
		return
	}

	comments, err := ctrl.service.FindByAuthor(uint(authorID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, comments)
}

// FindReplies handles GET /comments/replies/:parentId
// @Summary Get comment replies
// @Description Retrieve all replies to a specific comment
// @Tags comments
// @Produce json
// @Param parentId path int true "Parent Comment ID"
// @Success 200 {array} domain.CommentResponseDTO
// @Failure 400 {object} map[string]string
// @Router /comments/replies/{parentId} [get]
func (ctrl *CommentController) FindReplies(c *gin.Context) {
	parentID, err := strconv.ParseUint(c.Param("parentId"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid parent id"})
		return
	}

	comments, err := ctrl.service.FindReplies(uint(parentID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, comments)
}

// Update handles PATCH /comments/:id
// @Summary Update a comment
// @Description Update an existing comment
// @Tags comments
// @Accept json
// @Produce json
// @Param id path int true "Comment ID"
// @Param dto body domain.UpdateCommentDTO true "Update Comment DTO"
// @Success 200 {object} domain.CommentResponseDTO
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /comments/{id} [patch]
func (ctrl *CommentController) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var dto domain.UpdateCommentDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	comment, err := ctrl.service.Update(uint(id), dto)
	if err != nil {
		if err.Error() == "comment not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, comment)
}

// IncrementUpvotes handles PATCH /comments/:id/upvote
// @Summary Upvote a comment
// @Description Increment the upvote count of a comment
// @Tags comments
// @Produce json
// @Param id path int true "Comment ID"
// @Success 200 {object} domain.CommentResponseDTO
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /comments/{id}/upvote [patch]
func (ctrl *CommentController) IncrementUpvotes(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	comment, err := ctrl.service.IncrementUpvotes(uint(id))
	if err != nil {
		if err.Error() == "comment not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, comment)
}

// DecrementUpvotes handles PATCH /comments/:id/downvote
// @Summary Downvote a comment
// @Description Decrement the upvote count of a comment
// @Tags comments
// @Produce json
// @Param id path int true "Comment ID"
// @Success 200 {object} domain.CommentResponseDTO
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /comments/{id}/downvote [patch]
func (ctrl *CommentController) DecrementUpvotes(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	comment, err := ctrl.service.DecrementUpvotes(uint(id))
	if err != nil {
		if err.Error() == "comment not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, comment)
}

// Remove handles DELETE /comments/:id
// @Summary Delete a comment
// @Description Delete a comment by ID
// @Tags comments
// @Param id path int true "Comment ID"
// @Success 200 {object} map[string]bool
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /comments/{id} [delete]
func (ctrl *CommentController) Remove(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	err = ctrl.service.Remove(uint(id))
	if err != nil {
		if err.Error() == "comment not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"deleted": true})
}
