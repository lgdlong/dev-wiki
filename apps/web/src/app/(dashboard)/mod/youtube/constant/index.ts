// Regex cho nhiều dạng URL Youtube
// Supports: https://www.youtube.com/watch?v=-GFigzht4G0, https://youtu.be/-GFigzht4G0, etc.
const YOUTUBE_URL_REGEX =
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|shorts\/)?[a-zA-Z0-9_-]{11}([&?].*)?$/;
const YOUTUBE_ID_REGEX =
  /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

export { YOUTUBE_URL_REGEX, YOUTUBE_ID_REGEX };
