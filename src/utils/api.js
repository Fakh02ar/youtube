import axios from "axios";

const API_KEY = "AIzaSyCQcD-KtkdjwtXycaXzjnE5ra8nKXAFCLM";
const BASE_URL = "https://www.googleapis.com/youtube/v3";

// ===================================================
// FETCH VIDEOS (HOME PAGE / SEARCH RESULTS)
// ===================================================
export const fetchVideos = async (query = "youtube") => {
  try {
    const { data } = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: "snippet",
        q: query,
        maxResults: 20,
        type: "video",
        key: API_KEY,
      },
    });

    const videoItems = data.items || [];
    if (!videoItems.length) return [];

    const videoIds = videoItems.map((item) => item.id.videoId).join(",");
    if (!videoIds) return [];

    const { data: videoDetails } = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: "snippet,statistics,contentDetails",
        id: videoIds,
        key: API_KEY,
      },
    });

    const items = videoDetails.items || [];
    if (!items.length) return [];

    const channelIds = [...new Set(items.map((v) => v.snippet.channelId))].join(
      ","
    );

    let channelMap = {};
    if (channelIds) {
      const { data: channelData } = await axios.get(`${BASE_URL}/channels`, {
        params: {
          part: "snippet",
          id: channelIds,
          key: API_KEY,
        },
      });

      channelData.items.forEach((ch) => {
        channelMap[ch.id] = ch.snippet.thumbnails.default.url;
      });
    }

    return items.map((video) => ({
      ...video,
      snippet: {
        ...video.snippet,
        channelThumbnail: channelMap[video.snippet.channelId] || "",
      },
    }));
  } catch (error) {
    console.error("Fetch Videos Error:", error.response?.data || error);
    return [];
  }
};

// ===================================================
// FETCH VIDEO DETAILS (VIDEO PLAYER PAGE)
// ===================================================
export const fetchVideoDetails = async (id) => {
  try {
    if (!id) return null;

    const { data } = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: "snippet,statistics,contentDetails",
        id,
        key: API_KEY,
      },
    });

    const video = data.items?.[0] || null;
    if (!video) return null;

    const channelId = video.snippet.channelId;

    const { data: channelData } = await axios.get(`${BASE_URL}/channels`, {
      params: {
        part: "snippet",
        id: channelId,
        key: API_KEY,
      },
    });

    const channelThumbnail =
      channelData.items?.[0]?.snippet?.thumbnails?.default?.url || "";

    return {
      ...video,
      snippet: {
        ...video.snippet,
        channelThumbnail,
      },
    };
  } catch (error) {
    console.error("Video Detail Error:", error.response?.data || error);
    return null;
  }
};

// ===================================================
// FETCH RELATED VIDEOS (NO MORE 404 ERRORS)
// ===================================================
export const fetchRelatedVideos = async (id) => {
  try {
    // ID VALIDATION
    if (!id || id === "undefined" || id === undefined) {
      console.error("Invalid Video ID for related videos:", id);
      return [];
    }

    // SEARCH RELATED VIDEOS
    const { data } = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: "snippet",
        relatedToVideoId: id,
        type: "video",
        maxResults: 50,
        regionCode: "US", // prevents many 404 errors
        key: API_KEY,
      },
    });

    const items = data.items || [];
    if (!items.length) return [];

    const videoIds = [...new Set(items.map((i) => i.id.videoId))].join(",");
    if (!videoIds) return [];

    // GET FULL DETAILS
    const { data: videoDetails } = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: "snippet,statistics,contentDetails",
        id: videoIds,
        key: API_KEY,
      },
    });

    let videos = videoDetails.items || [];
    if (!videos.length) return [];

    // SORT BY MOST VIEWED
    videos = videos.sort(
      (a, b) => Number(b.statistics.viewCount) - Number(a.statistics.viewCount)
    );

    // FETCH ALL CHANNEL ICONS
    const channelIds = [...new Set(videos.map((v) => v.snippet.channelId))].join(
      ","
    );

    let channelMap = {};
    if (channelIds) {
      const { data: channelData } = await axios.get(`${BASE_URL}/channels`, {
        params: {
          part: "snippet",
          id: channelIds,
          key: API_KEY,
        },
      });

      channelData.items.forEach((ch) => {
        channelMap[ch.id] = ch.snippet.thumbnails.default.url;
      });
    }

    // RETURN MAX 10 RELATED VIDEOS
    return videos.slice(0, 10).map((video) => ({
      ...video,
      snippet: {
        ...video.snippet,
        channelThumbnail: channelMap[video.snippet.channelId] || "",
      },
    }));
  } catch (error) {
    console.error("Related Videos Error:", error.response?.data || error);
    return [];
  }
};
