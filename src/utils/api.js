import axios from "axios";

const API_KEY = "AIzaSyCQcD-KtkdjwtXycaXzjnE5ra8nKXAFCLM";
const BASE_URL = "https://www.googleapis.com/youtube/v3";

// ===================================================
// 🔹 Helper: Fetch Full Video Details
// ===================================================
const getVideoDetails = async (ids) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/videos`, {
      params: {
        part: "snippet,statistics,contentDetails",
        id: ids,
        key: API_KEY,
      },
    });

    return data.items || [];
  } catch (error) {
    console.error("getVideoDetails Error:", error.response?.data || error);
    return [];
  }
};

// ===================================================
// 🔹 Helper: Fetch Channel Thumbnails
// ===================================================
const getChannelThumbnails = async (channelIds) => {
  try {
    if (!channelIds) return {};

    const { data } = await axios.get(`${BASE_URL}/channels`, {
      params: {
        part: "snippet",
        id: channelIds,
        key: API_KEY,
      },
    });

    let map = {};
    data.items.forEach((c) => {
      map[c.id] = c.snippet.thumbnails.default.url;
    });

    return map;
  } catch (error) {
    console.error("getChannelThumbnails Error:", error.response?.data || error);
    return {};
  }
};

// ===================================================
// FETCH VIDEOS (HOME PAGE / SEARCH RESULTS)
// ===================================================
export const fetchVideos = async (query = "youtube") => {
  try {
    const { data } = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: "snippet",
        q: query,
        maxResults: 50,
        type: "video",
        key: API_KEY,
      },
    });

    const items = data.items || [];
    if (!items.length) return [];

    const videoIds = items.map((i) => i.id.videoId).join(",");
    const videos = await getVideoDetails(videoIds);
    if (!videos.length) return [];

    const channelIds = [...new Set(videos.map((v) => v.snippet.channelId))].join(",");
    const channelMap = await getChannelThumbnails(channelIds);

    return videos.map((v) => ({
      ...v,
      snippet: {
        ...v.snippet,
        channelThumbnail: channelMap[v.snippet.channelId] || "",
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

    const videos = await getVideoDetails(id);
    const video = videos[0];
    if (!video) return null;

    const channelMap = await getChannelThumbnails(video.snippet.channelId);

    return {
      ...video,
      snippet: {
        ...video.snippet,
        channelThumbnail: channelMap[video.snippet.channelId] || "",
      },
    };
  } catch (error) {
    console.error("Video Detail Error:", error.response?.data || error);
    return null;
  }
};

// ===================================================
// FETCH RELATED VIDEOS
// ===================================================
export const fetchRelatedVideos = async (id) => {
  try {
    if (!id) return [];

    const { data } = await axios.get(`${BASE_URL}/search`, {
      params: {
        part: "snippet",
        relatedToVideoId: id,
        type: "video",
        maxResults: 50,
        regionCode: "US",
        key: API_KEY,
      },
    });

    const items = data.items || [];
    if (!items.length) return [];

    const videoIds = [...new Set(items.map((i) => i.id.videoId))].join(",");
    let videos = await getVideoDetails(videoIds);

    videos = videos.sort(
      (a, b) => Number(b.statistics.viewCount) - Number(a.statistics.viewCount)
    );

    const channelIds = [...new Set(videos.map((v) => v.snippet.channelId))].join(",");
    const channelMap = await getChannelThumbnails(channelIds);

    return videos.slice(0, 10).map((v) => ({
      ...v,
      snippet: {
        ...v.snippet,
        channelThumbnail: channelMap[v.snippet.channelId] || "",
      },
    }));
  } catch (error) {
    console.error("Related Videos Error:", error.response?.data || error);
    return [];
  }
};
