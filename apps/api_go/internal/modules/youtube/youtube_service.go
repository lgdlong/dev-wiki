package youtube

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"api_go/internal/config"
	"api_go/internal/domain"
)

type youtubeService struct {
	apiKey string
}

// NewYouTubeService creates a new YouTubeService instance
func NewYouTubeService(cfg *config.Config) domain.YouTubeService {
	return &youtubeService{
		apiKey: cfg.YoutubeAPIKey,
	}
}

// YouTubeAPIResponse represents the YouTube Data API v3 response
type YouTubeAPIResponse struct {
	Items []YouTubeVideoItem `json:"items"`
}

type YouTubeVideoItem struct {
	ID      string `json:"id"`
	Snippet struct {
		Title        string `json:"title"`
		Description  string `json:"description"`
		ChannelID    string `json:"channelId"`
		ChannelTitle string `json:"channelTitle"`
		PublishedAt  string `json:"publishedAt"`
		Thumbnails   struct {
			Default struct {
				URL string `json:"url"`
			} `json:"default"`
			Medium struct {
				URL string `json:"url"`
			} `json:"medium"`
			High struct {
				URL string `json:"url"`
			} `json:"high"`
			Standard struct {
				URL string `json:"url"`
			} `json:"standard"`
			Maxres struct {
				URL string `json:"url"`
			} `json:"maxres"`
		} `json:"thumbnails"`
	} `json:"snippet"`
	ContentDetails struct {
		Duration string `json:"duration"`
	} `json:"contentDetails"`
	Statistics struct {
		ViewCount    string `json:"viewCount"`
		LikeCount    string `json:"likeCount"`
		CommentCount string `json:"commentCount"`
	} `json:"statistics"`
}

// GetVideoMetadata fetches metadata from YouTube API
func (s *youtubeService) GetVideoMetadata(youtubeID string) (*domain.YouTubeMetadata, error) {
	if s.apiKey == "" {
		return nil, errors.New("YouTube API key not configured")
	}

	// Build YouTube API URL
	url := fmt.Sprintf(
		"https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=%s&key=%s",
		youtubeID,
		s.apiKey,
	)

	// Make HTTP request
	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch YouTube data: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("YouTube API returned status %d", resp.StatusCode)
	}

	// Parse response
	var apiResponse YouTubeAPIResponse
	if err := json.NewDecoder(resp.Body).Decode(&apiResponse); err != nil {
		return nil, fmt.Errorf("failed to parse YouTube response: %w", err)
	}

	if len(apiResponse.Items) == 0 {
		return nil, errors.New("video not found on YouTube")
	}

	item := apiResponse.Items[0]

	// Select best thumbnail
	thumbnailURL := item.Snippet.Thumbnails.High.URL
	if thumbnailURL == "" {
		thumbnailURL = item.Snippet.Thumbnails.Medium.URL
	}
	if thumbnailURL == "" {
		thumbnailURL = item.Snippet.Thumbnails.Default.URL
	}

	// Build metadata map for additional info
	metadata := map[string]interface{}{
		"channel_id":    item.Snippet.ChannelID,
		"published_at":  item.Snippet.PublishedAt,
		"view_count":    item.Statistics.ViewCount,
		"like_count":    item.Statistics.LikeCount,
		"comment_count": item.Statistics.CommentCount,
	}

	return &domain.YouTubeMetadata{
		YoutubeID:    youtubeID,
		Title:        item.Snippet.Title,
		Description:  item.Snippet.Description,
		ThumbnailURL: thumbnailURL,
		Duration:     item.ContentDetails.Duration,
		ChannelTitle: item.Snippet.ChannelTitle,
		ChannelID:    item.Snippet.ChannelID,
		PublishedAt:  item.Snippet.PublishedAt,
		ViewCount:    item.Statistics.ViewCount,
		LikeCount:    item.Statistics.LikeCount,
		Metadata:     metadata,
	}, nil
}
