import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchVideoDetails, fetchRelatedVideos } from "../utils/api";
import { FaThumbsUp, FaThumbsDown, FaShare } from "react-icons/fa";

export default function VideoPlayer() {
  const { id } = useParams();

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);
  const [relatedLoaded, setRelatedLoaded] = useState(false);

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");

  // Fallback static videos
  const staticVideos = [
    {
      id: "Ke90Tje7VS0",
      title: "React JS - React Tutorial for Beginners",
      channel: "Programming with Mosh",
      thumbnail: "https://i.ytimg.com/vi/Ke90Tje7VS0/hqdefault.jpg",
      views: "5.2M",
      uploadedAt: "Jul 10, 2019",
    },
    {
      id: "SqcY0GlETPk",
      title: "React Course - Beginner's Tutorial for React JavaScript Library [2024]",
      channel: "freeCodeCamp.org",
      thumbnail: "https://i.ytimg.com/vi/SqcY0GlETPk/hqdefault.jpg",
      views: "2.8M",
      uploadedAt: "Mar 15, 2024",
    },
    {
      id: "bMknfKXIFA8",
      title: "React JS Full Course 2024 | Build and Deploy a Full Stack App",
      channel: "JavaScript Mastery",
      thumbnail: "https://i.ytimg.com/vi/bMknfKXIFA8/hqdefault.jpg",
      views: "1.9M",
      uploadedAt: "Jan 20, 2024",
    },
    {
      id: "w7ejDZ8SWv8",
      title: "React Hooks Tutorial - useState, useEffect, useReducer",
      channel: "The Net Ninja",
      thumbnail: "https://i.ytimg.com/vi/w7ejDZ8SWv8/hqdefault.jpg",
      views: "980K",
      uploadedAt: "Jun 5, 2021",
    },
    {
      id: "RgKHfoW9z3g",
      title: "Justin Bieber - Baby ft. Ludacris",
      channel: "JustinBieberVEVO",
      thumbnail: "https://i.ytimg.com/vi/kffacxfA7G4/hqdefault.jpg",
      views: "1.1M",
      uploadedAt: "Aug 12, 2022",
    },
    {
      id: "j942wKiXFu8",
      title: "React Context API Tutorial (Goodbye Props Drilling!)",
      channel: "Fireship",
      thumbnail: "https://i.ytimg.com/vi/j942wKiXFu8/hqdefault.jpg",
      views: "890K",
      uploadedAt: "Nov 8, 2023",
    },
    {
      id: "DLX62G4lc44",
      title: "Learn Redux Toolkit in 1 Hour (with React)",
      channel: "PedroTech",
      thumbnail: "https://i.ytimg.com/vi/DLX62G4lc44/hqdefault.jpg",
      views: "620K",
      uploadedAt: "Sep 18, 2023",
    },
    {
      id: "4UZrsTqkcW4",
      title: "Build and Deploy a Modern YouTube Clone with React + Tailwind",
      channel: "Sonny Sangha",
      thumbnail: "https://i.ytimg.com/vi/4UZrsTqkcW4/hqdefault.jpg",
      views: "1.4M",
      uploadedAt: "Oct 30, 2023",
    },
    {
      id: "nTeuhbP7wd0",
      title: "Ed Sheeran - Shape of You [Official Video]",
      channel: "Ed Sheeran",
      thumbnail: "https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg",
      views: "450K",
      uploadedAt: "May 22, 2024",
    },
    {
      id: "Qe3gffjF6I0",
      title: "PSY - GANGNAM STYLE (강남스타일) M/V",
      channel: "officialpsy",
      thumbnail: "https://i.ytimg.com/vi/9bZkp7q19f0/hqdefault.jpg",
      views: "380K",
      uploadedAt: "Apr 10, 2024",
    },
  ];

  useEffect(() => {
    const loadVideo = async () => {
      try {
        setLoading(true);
        setRelatedLoaded(false);

        // RESET STATES HERE (SAFE)
        setComments([]);
        setIsSubscribed(false);
        setIsLiked(false);
        setIsDisliked(false);

        const videoData = await fetchVideoDetails(id);
        setVideo(videoData);

        window.scrollTo(0, 0);
        setLoading(false);

        const relatedData = await fetchRelatedVideos(id);

        setRelated(
          relatedData.length > 0
            ? relatedData.slice(0, 12)
            : staticVideos
        );

        setRelatedLoaded(true);
      } catch (error) {
        console.error("Error loading video:", error);
        setRelated(staticVideos);
        setLoading(false);
        setRelatedLoaded(true);
      }
    };

    loadVideo();
  }, [id]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
  };

  const addComment = () => {
    if (!commentText.trim()) return;
    setComments([{ text: commentText, date: new Date() }, ...comments]);
    setCommentText("");
  };

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        
        {/* MAIN VIDEO AREA */}
        <div className="w-full lg:w-[70%] xl:w-[70%]">

          {/* VIDEO PLAYER */}
          <div className="relative pt-[56.25%] bg-black rounded-xl overflow-hidden shadow-lg">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          </div>

          {/* TITLE & ACTIONS */}
          {loading || !video ? (
            <div className="mt-6 space-y-4 animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-full"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>
          ) : (
            <>
              <h1 className="text-xl sm:text-2xl font-bold mt-6 leading-tight">
                {video.snippet.title}
              </h1>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 gap-4">

                {/* CHANNEL INFO */}
                <div className="flex items-center gap-3 flex-wrap">
                  <img
                    src={video.snippet.channelThumbnail || "https://via.placeholder.com/48"}
                    alt="channel"
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h2 className="font-semibold text-lg">{video.snippet.channelTitle}</h2>
                  </div>
                  <button
                    onClick={() => setIsSubscribed(!isSubscribed)}
                    className={`lg:ml-4 px-6 py-2.5 rounded-full font-medium transition-all text-sm sm:text-base ${
                      isSubscribed
                        ? "bg-gray-300 text-black"
                        : "bg-black text-white hover:bg-gray-800"
                    }`}
                  >
                    {isSubscribed ? "Subscribed" : "Subscribe"}
                  </button>
                </div>

                {/* LIKE / SHARE */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex border border-gray-300 rounded-full overflow-hidden">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 px-5 py-2.5 transition-all ${
                        isLiked ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      <FaThumbsUp className="text-lg" />
                      <span className="hidden sm:inline">Like</span>
                    </button>
                    <button
                      onClick={handleDislike}
                      className={`px-4 py-2.5 transition-all border-l border-gray-300 ${
                        isDisliked ? "bg-red-600 text-white" : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      <FaThumbsDown className="text-lg" />
                    </button>
                  </div>

                  <button className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-5 py-2.5 rounded-full transition">
                    <FaShare className="text-lg" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="mt-6 bg-gray-100 rounded-xl p-4 sm:p-5">
                <p className="font-medium text-lg">
                  {video.statistics?.viewCount
                    ? Number(video.statistics.viewCount).toLocaleString()
                    : "0"}{" "}
                  views • {new Date(video.snippet.publishedAt).toLocaleDateString()}
                </p>
                <p className="mt-4 text-base leading-relaxed whitespace-pre-line">
                  {video.snippet.description || "No description available."}
                </p>
              </div>

              {/* COMMENTS */}
              <div className="mt-10">
                <h2 className="font-bold text-xl mb-6">{comments.length} Comments</h2>

                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addComment()}
                    className="flex-1 border-b-2 border-gray-300 focus:border-black outline-none py-3 text-lg"
                  />

                  <button
                    onClick={addComment}
                    className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition mt-4 sm:mt-0"
                  >
                    Comment
                  </button>
                </div>

                <div className="space-y-6">
                  {comments.length === 0 ? (
                    <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                  ) : (
                    comments.map((c, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-10 h-10 bg-gray-400 rounded-full flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="font-medium">@user{i + 1}</p>
                          <p className="mt-1">{c.text}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {c.date.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* RELATED VIDEOS */}
        <div className="w-full lg:w-[30%] xl:w-[30%]">
          <h2 className="font-bold text-xl mb-4 hidden lg:block">Related Videos</h2>

          {!relatedLoaded &&
            [...Array(8)].map((_, i) => (
              <div key={i} className="flex gap-3 mb-5 animate-pulse">
                <div className="w-40 h-24 bg-gray-300 rounded-lg flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-300 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                </div>
              </div>
            ))}

          {relatedLoaded &&
            related.map((v) => (
              <div
                key={v.id?.videoId || v.id}
                className="flex gap-3 mb-5 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-all"
                onClick={() =>
                  (window.location.href = `/video/${v.id?.videoId || v.id}`)
                }
              >
                <img
                  src={
                    v.snippet?.thumbnails?.medium?.url ||
                    v.thumbnail ||
                    "https://i.ytimg.com/vi/Ke90Tje7VS0/hqdefault.jpg"
                  }
                  alt="thumb"
                  className="w-40 h-24 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 text-sm">
                  <h3 className="font-medium line-clamp-2 leading-tight">
                    {v.snippet?.title || v.title}
                  </h3>
                  <p className="text-gray-600 mt-1 text-xs">
                    {v.snippet?.channelTitle || v.channel}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {(v.views ||
                      (v.statistics?.viewCount
                        ? Number(v.statistics.viewCount).toLocaleString()
                        : null)) && (
                      <span>
                        {v.views ||
                          Number(v.statistics.viewCount).toLocaleString()}{" "}
                        views •{" "}
                      </span>
                    )}
                    {v.uploadedAt ||
                      (v.snippet?.publishedAt
                        ? new Date(v.snippet.publishedAt).toLocaleDateString()
                        : "")}
                  </p>
                </div>
              </div>
            ))}
        </div>

      </div>
    </div>
  );
}
