// @title           Dev Wiki API
// @version         1.0
// @description     API documentation for Dev Wiki - Developer Knowledge Sharing Platform
// @termsOfService  http://swagger.io/terms/

// @contact.name   Dev Wiki Support
// @contact.url    https://github.com/lgdlong/dev-wiki
// @contact.email  support@devwiki.io

// @license.name  MIT
// @license.url   https://opensource.org/licenses/MIT

// @host      localhost:8080
// @BasePath  /

// @securityDefinitions.apikey BearerAuth
// @in header
// @name Authorization
// @description Type "Bearer" followed by a space and JWT token.

package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os/signal"
	"syscall"
	"time"

	"gorm.io/gorm"

	"api_go/internal/config"
	"api_go/internal/database"
	account_controller "api_go/internal/modules/account/controller"
	account_repo "api_go/internal/modules/account/repo"
	account_service "api_go/internal/modules/account/service"
	auth_controller "api_go/internal/modules/auth/controller"
	auth_service "api_go/internal/modules/auth/service"
	comment_controller "api_go/internal/modules/comment/controller"
	comment_repo "api_go/internal/modules/comment/repo"
	comment_service "api_go/internal/modules/comment/service"
	tag_controller "api_go/internal/modules/tag/controller"
	tag_repo "api_go/internal/modules/tag/repo"
	tag_service "api_go/internal/modules/tag/service"
	tutorial_controller "api_go/internal/modules/tutorial/controller"
	tutorial_repo "api_go/internal/modules/tutorial/repo"
	tutorial_service "api_go/internal/modules/tutorial/service"
	video_controller "api_go/internal/modules/video/controller"
	video_repo "api_go/internal/modules/video/repo"
	video_service "api_go/internal/modules/video/service"
	video_tag_controller "api_go/internal/modules/video_tag/controller"
	video_tag_repo "api_go/internal/modules/video_tag/repo"
	video_tag_service "api_go/internal/modules/video_tag/service"
	vote_controller "api_go/internal/modules/vote/controller"
	vote_repo "api_go/internal/modules/vote/repo"
	vote_service "api_go/internal/modules/vote/service"
	"api_go/internal/modules/youtube"
	"api_go/internal/server"

	_ "github.com/joho/godotenv/autoload"
)

func gracefulShutdown(apiServer *http.Server, done chan bool) {
	// Create context that listens for the interrupt signal from the OS.
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	// Listen for the interrupt signal.
	<-ctx.Done()

	log.Println("shutting down gracefully, press Ctrl+C again to force")
	stop() // Allow Ctrl+C to force shutdown

	// The context is used to inform the server it has 5 seconds to finish
	// the request it is currently handling
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := apiServer.Shutdown(ctx); err != nil {
		log.Printf("Server forced to shutdown with error: %v", err)
	}

	log.Println("Server exiting")

	// Notify the main goroutine that the shutdown is complete
	done <- true
}

// AppModules holds all controllers/services for DI
type AppModules struct {
	AccountController  *account_controller.AccountController
	AuthController     *auth_controller.AuthController
	TagController      *tag_controller.TagController
	TutorialController *tutorial_controller.TutorialController
	VideoController    *video_controller.VideoController
	VideoTagController *video_tag_controller.VideoTagController
	CommentController  *comment_controller.CommentController
	VoteController     *vote_controller.VoteController
}

// initModules initializes all dependencies (repo, service, controller)
func initModules(db *gorm.DB, cfg *config.Config) *AppModules {
	// Account module
	accountRepo := account_repo.NewAccountRepository(db)
	accountService := account_service.NewAccountService(accountRepo)
	accountController := account_controller.NewAccountController(accountService)

	// Auth module (depends on account)
	authService := auth_service.NewAuthService(cfg, accountService, accountRepo)
	authController := auth_controller.NewAuthController(cfg, authService)

	// Tag module
	tagRepo := tag_repo.NewTagRepository(db)
	tagService := tag_service.NewTagService(tagRepo)
	tagController := tag_controller.NewTagController(tagService)

	// Tutorial module
	tutorialRepo := tutorial_repo.NewTutorialRepository(db)
	tutorialService := tutorial_service.NewTutorialService(tutorialRepo)
	tutorialController := tutorial_controller.NewTutorialController(tutorialService)

	// VideoTag module (create repo first, service needs video and tag repos)
	videoTagRepo := video_tag_repo.NewVideoTagRepository(db)
	videoRepo := video_repo.NewVideoRepository(db)
	videoTagService := video_tag_service.NewVideoTagService(videoTagRepo, videoRepo, tagRepo)
	videoTagController := video_tag_controller.NewVideoTagController(videoTagService)

	// YouTube service (for fetching video metadata)
	youtubeSvc := youtube.NewYouTubeService(cfg)

	// Video module (needs videoTagService and youtubeService)
	videoService := video_service.NewVideoService(videoRepo, videoTagService, youtubeSvc)
	videoController := video_controller.NewVideoController(videoService)

	// Comment module
	commentRepo := comment_repo.NewCommentRepository(db)
	commentService := comment_service.NewCommentService(commentRepo)
	commentController := comment_controller.NewCommentController(commentService)

	// Vote module
	voteRepo := vote_repo.NewVoteRepository(db)
	voteService := vote_service.NewVoteService(voteRepo)
	voteController := vote_controller.NewVoteController(voteService)

	return &AppModules{
		AccountController:  accountController,
		AuthController:     authController,
		TagController:      tagController,
		TutorialController: tutorialController,
		VideoController:    videoController,
		VideoTagController: videoTagController,
		CommentController:  commentController,
		VoteController:     voteController,
	}
}

func main() {
	// Load config based on NODE_ENV
	cfg := config.Load()
	log.Printf("Starting server in %s mode...", cfg.Env)

	// Khởi tạo database using shared connection
	db := database.NewGormDB(cfg)

	// Khởi tạo dependencies cho các module
	modules := initModules(db, cfg)

	// Truyền controller vào server.NewServer
	srv := server.NewServer(
		cfg,
		modules.AccountController,
		modules.AuthController,
		modules.TagController,
		modules.TutorialController,
		modules.VideoController,
		modules.VideoTagController,
		modules.CommentController,
		modules.VoteController,
	)

	// Create a done channel to signal when the shutdown is complete
	done := make(chan bool, 1)

	// Run graceful shutdown in a separate goroutine
	go gracefulShutdown(srv, done)

	err := srv.ListenAndServe()
	if err != nil && err != http.ErrServerClosed {
		panic(fmt.Sprintf("http server error: %s", err))
	}

	// Wait for the graceful shutdown to complete
	<-done
	log.Println("Graceful shutdown complete.")
}
