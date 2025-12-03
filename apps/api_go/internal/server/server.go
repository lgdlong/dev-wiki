package server

import (
	"fmt"
	"net/http"
	"time"

	"api_go/internal/config"
	account_controller "api_go/internal/modules/account/controller"
	comment_controller "api_go/internal/modules/comment/controller"
	tag_controller "api_go/internal/modules/tag/controller"
	tutorial_controller "api_go/internal/modules/tutorial/controller"
	video_controller "api_go/internal/modules/video/controller"
	video_tag_controller "api_go/internal/modules/video_tag/controller"
	vote_controller "api_go/internal/modules/vote/controller"
)

type Server struct {
	config             *config.Config
	accountController  *account_controller.AccountController
	tagController      *tag_controller.TagController
	tutorialController *tutorial_controller.TutorialController
	videoController    *video_controller.VideoController
	videoTagController *video_tag_controller.VideoTagController
	commentController  *comment_controller.CommentController
	voteController     *vote_controller.VoteController
}

func NewServer(
	cfg *config.Config,
	accountCtrl *account_controller.AccountController,
	tagCtrl *tag_controller.TagController,
	tutorialCtrl *tutorial_controller.TutorialController,
	videoCtrl *video_controller.VideoController,
	videoTagCtrl *video_tag_controller.VideoTagController,
	commentCtrl *comment_controller.CommentController,
	voteCtrl *vote_controller.VoteController,
) *http.Server {
	s := &Server{
		config:             cfg,
		accountController:  accountCtrl,
		tagController:      tagCtrl,
		tutorialController: tutorialCtrl,
		videoController:    videoCtrl,
		videoTagController: videoTagCtrl,
		commentController:  commentCtrl,
		voteController:     voteCtrl,
	}

	// Declare Server config
	server := &http.Server{
		Addr:         fmt.Sprintf(":%d", cfg.Port),
		Handler:      s.RegisterRoutes(),
		IdleTimeout:  time.Minute,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}

	return server
}
