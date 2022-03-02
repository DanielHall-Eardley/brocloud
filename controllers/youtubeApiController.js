const catchError = require("../util/catchError");
const fetch = require("node-fetch");

let youtubeApiKey = process.env.YOUTUBE_API_KEY;
if (!youtubeApiKey) {
  youtubeApiKey = require("../config/keys").youtubeApiKey;
}

exports.search = catchError(async (req, res, next) => {
  const url = `https://www.googleapis.com/youtube/v3/search?type=video&part=snippet&maxResults=8&q=${req.body.searchQuery}&key=${youtubeApiKey}&fields=items(id,snippet/title,snippet/thumbnails/default)&videoCategoryId=10`;
  const response = await fetch(url);
  const results = await response.json();
  res.status(200).json({ results });
});
