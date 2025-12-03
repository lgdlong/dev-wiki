package domain

// YouTubeMetadata represents metadata fetched from YouTube API
type YouTubeMetadata struct {
	YoutubeID    string                 `json:"youtube_id"`
	Title        string                 `json:"title"`
	Description  string                 `json:"description"`
	ThumbnailURL string                 `json:"thumbnail_url"`
	Duration     string                 `json:"duration"`
	ChannelTitle string                 `json:"channel_title"`
	ChannelID    string                 `json:"channel_id"`
	PublishedAt  string                 `json:"published_at"`
	ViewCount    string                 `json:"view_count"`
	LikeCount    string                 `json:"like_count"`
	Metadata     map[string]interface{} `json:"metadata,omitempty"`
}

// YouTubeService interface for fetching YouTube metadata
type YouTubeService interface {
	GetVideoMetadata(youtubeID string) (*YouTubeMetadata, error)
}
