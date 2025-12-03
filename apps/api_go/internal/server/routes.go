package server

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	_ "api_go/docs"
)

func (s *Server) RegisterRoutes() http.Handler {
	// Set Gin mode based on environment
	if s.config.IsProduction() {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.Default()

	// Configure CORS based on environment
	var allowOrigins []string
	if s.config.IsDevelopment() {
		allowOrigins = []string{
			"http://localhost:3000",
			"http://localhost:5173",
			"http://127.0.0.1:3000",
			"http://127.0.0.1:5173",
		}
	} else {
		allowOrigins = []string{s.config.FrontendURL}
	}

	r.Use(cors.New(cors.Config{
		AllowOrigins:     allowOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowHeaders:     []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

	r.GET("/", s.HelloWorldHandler)
	r.GET("/health", s.healthHandler)

	// Swagger documentation
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	api := r.Group("")

	// Register module routes at root level
	s.accountController.RegisterRoutes(api)
	s.tagController.RegisterRoutes(api)
	s.tutorialController.RegisterRoutes(api)
	s.videoController.RegisterRoutes(api)
	s.videoTagController.RegisterRoutes(api)
	s.commentController.RegisterRoutes(api)
	s.voteController.RegisterRoutes(api)

	return r
}

func (s *Server) HelloWorldHandler(c *gin.Context) {
	resp := make(map[string]string)
	resp["message"] = "Hello World"

	c.JSON(http.StatusOK, resp)
}

func (s *Server) healthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}
