package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"api_go/internal/domain"
)

type VoteController struct {
	service domain.VoteService
}

// NewVoteController creates a new VoteController instance
func NewVoteController(service domain.VoteService) *VoteController {
	return &VoteController{service: service}
}

// RegisterRoutes registers all vote routes
func (ctrl *VoteController) RegisterRoutes(r *gin.RouterGroup) {
	votes := r.Group("/votes")
	{
		votes.POST("", ctrl.Create)
		votes.POST("/change", ctrl.ChangeVote)
		votes.GET("", ctrl.FindAll)
		votes.GET("/entity/:entityType/:entityId", ctrl.FindByEntity)
		votes.GET("/entity/:entityType/:entityId/count", ctrl.GetVoteCounts)
		votes.GET("/user/:userId", ctrl.FindByUser)
		votes.GET("/user/:userId/entity/:entityType/:entityId", ctrl.FindUserVoteOnEntity)
		votes.GET("/:id", ctrl.FindOne)
		votes.PATCH("/:id", ctrl.Update)
		votes.DELETE("/:id", ctrl.Remove)
		votes.DELETE("/user/:userId/entity/:entityType/:entityId", ctrl.RemoveUserVote)
	}
}

// Create handles POST /votes
// @Summary Create a new vote
// @Description Create a new vote on an entity
// @Tags votes
// @Accept json
// @Produce json
// @Param dto body domain.CreateVoteDTO true "Create Vote DTO"
// @Success 201 {object} domain.VoteResponseDTO
// @Failure 400 {object} map[string]string
// @Failure 409 {object} map[string]string
// @Router /votes [post]
func (ctrl *VoteController) Create(c *gin.Context) {
	var dto domain.CreateVoteDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	vote, err := ctrl.service.Create(dto)
	if err != nil {
		if err.Error() == "user already voted on this entity" {
			c.JSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, vote)
}

// ChangeVote handles POST /votes/change (toggle vote)
// @Summary Change or toggle vote
// @Description Change vote type or remove if same type
// @Tags votes
// @Accept json
// @Produce json
// @Param dto body domain.CreateVoteDTO true "Vote DTO"
// @Success 200 {object} domain.VoteResponseDTO
// @Router /votes/change [post]
func (ctrl *VoteController) ChangeVote(c *gin.Context) {
	var dto domain.CreateVoteDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	vote, err := ctrl.service.ChangeVote(dto.UserID, dto.EntityType, dto.EntityID, dto.VoteType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// nil means vote was removed
	if vote == nil {
		c.JSON(http.StatusOK, gin.H{"removed": true})
		return
	}

	c.JSON(http.StatusOK, vote)
}

// FindAll handles GET /votes
// @Summary Get all votes
// @Description Retrieve all votes
// @Tags votes
// @Produce json
// @Success 200 {array} domain.VoteResponseDTO
// @Failure 500 {object} map[string]string
// @Router /votes [get]
func (ctrl *VoteController) FindAll(c *gin.Context) {
	votes, err := ctrl.service.FindAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, votes)
}

// FindOne handles GET /votes/:id
// @Summary Get a vote by ID
// @Description Retrieve a single vote by its ID
// @Tags votes
// @Produce json
// @Param id path int true "Vote ID"
// @Success 200 {object} domain.VoteResponseDTO
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /votes/{id} [get]
func (ctrl *VoteController) FindOne(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	vote, err := ctrl.service.FindOne(uint(id))
	if err != nil {
		if err.Error() == "vote not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, vote)
}

// FindByEntity handles GET /votes/entity/:entityType/:entityId
// @Summary Get votes by entity
// @Description Retrieve all votes for a specific entity
// @Tags votes
// @Produce json
// @Param entityType path string true "Entity Type (video, tutorial, comment)"
// @Param entityId path int true "Entity ID"
// @Success 200 {array} domain.VoteResponseDTO
// @Failure 400 {object} map[string]string
// @Router /votes/entity/{entityType}/{entityId} [get]
func (ctrl *VoteController) FindByEntity(c *gin.Context) {
	entityType := domain.EntityType(c.Param("entityType"))
	entityID, err := strconv.ParseInt(c.Param("entityId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid entity id"})
		return
	}

	votes, err := ctrl.service.FindByEntity(entityType, entityID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, votes)
}

// GetVoteCounts handles GET /votes/entity/:entityType/:entityId/count
// @Summary Get vote counts for entity
// @Description Get upvote and downvote counts for a specific entity
// @Tags votes
// @Produce json
// @Param entityType path string true "Entity Type (video, tutorial, comment)"
// @Param entityId path int true "Entity ID"
// @Success 200 {object} map[string]int64
// @Failure 400 {object} map[string]string
// @Router /votes/entity/{entityType}/{entityId}/count [get]
func (ctrl *VoteController) GetVoteCounts(c *gin.Context) {
	entityType := domain.EntityType(c.Param("entityType"))
	entityID, err := strconv.ParseInt(c.Param("entityId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid entity id"})
		return
	}

	upvotes, downvotes, err := ctrl.service.GetVoteCounts(entityType, entityID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"upvotes":   upvotes,
		"downvotes": downvotes,
		"total":     upvotes - downvotes,
	})
}

// FindByUser handles GET /votes/user/:userId
// @Summary Get votes by user
// @Description Retrieve all votes made by a specific user
// @Tags votes
// @Produce json
// @Param userId path int true "User ID"
// @Success 200 {array} domain.VoteResponseDTO
// @Failure 400 {object} map[string]string
// @Router /votes/user/{userId} [get]
func (ctrl *VoteController) FindByUser(c *gin.Context) {
	userID, err := strconv.ParseUint(c.Param("userId"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	votes, err := ctrl.service.FindByUser(uint(userID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, votes)
}

// FindUserVoteOnEntity handles GET /votes/user/:userId/entity/:entityType/:entityId
// @Summary Get user's vote on entity
// @Description Retrieve a user's vote on a specific entity
// @Tags votes
// @Produce json
// @Param userId path int true "User ID"
// @Param entityType path string true "Entity Type (video, tutorial, comment)"
// @Param entityId path int true "Entity ID"
// @Success 200 {object} domain.VoteResponseDTO
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /votes/user/{userId}/entity/{entityType}/{entityId} [get]
func (ctrl *VoteController) FindUserVoteOnEntity(c *gin.Context) {
	userID, err := strconv.ParseUint(c.Param("userId"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	entityType := domain.EntityType(c.Param("entityType"))
	entityID, err := strconv.ParseInt(c.Param("entityId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid entity id"})
		return
	}

	vote, err := ctrl.service.FindUserVoteOnEntity(uint(userID), entityType, entityID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if vote == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "vote not found"})
		return
	}

	c.JSON(http.StatusOK, vote)
}

// Update handles PATCH /votes/:id
// @Summary Update a vote
// @Description Update an existing vote
// @Tags votes
// @Accept json
// @Produce json
// @Param id path int true "Vote ID"
// @Param dto body domain.UpdateVoteDTO true "Update Vote DTO"
// @Success 200 {object} domain.VoteResponseDTO
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /votes/{id} [patch]
func (ctrl *VoteController) Update(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	var dto domain.UpdateVoteDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	vote, err := ctrl.service.Update(uint(id), dto)
	if err != nil {
		if err.Error() == "vote not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, vote)
}

// Remove handles DELETE /votes/:id
// @Summary Delete a vote
// @Description Delete a vote by ID
// @Tags votes
// @Param id path int true "Vote ID"
// @Success 200 {object} map[string]bool
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /votes/{id} [delete]
func (ctrl *VoteController) Remove(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid id"})
		return
	}

	err = ctrl.service.Remove(uint(id))
	if err != nil {
		if err.Error() == "vote not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"deleted": true})
}

// RemoveUserVote handles DELETE /votes/user/:userId/entity/:entityType/:entityId
// @Summary Remove user's vote on entity
// @Description Remove a user's vote on a specific entity
// @Tags votes
// @Param userId path int true "User ID"
// @Param entityType path string true "Entity Type (video, tutorial, comment)"
// @Param entityId path int true "Entity ID"
// @Success 200 {object} map[string]bool
// @Failure 400 {object} map[string]string
// @Failure 404 {object} map[string]string
// @Router /votes/user/{userId}/entity/{entityType}/{entityId} [delete]
func (ctrl *VoteController) RemoveUserVote(c *gin.Context) {
	userID, err := strconv.ParseUint(c.Param("userId"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	entityType := domain.EntityType(c.Param("entityType"))
	entityID, err := strconv.ParseInt(c.Param("entityId"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid entity id"})
		return
	}

	err = ctrl.service.RemoveUserVote(uint(userID), entityType, entityID)
	if err != nil {
		if err.Error() == "vote not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"deleted": true})
}
