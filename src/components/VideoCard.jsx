import { Link } from "react-router-dom";
import { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";

export default function VideoCard({ video }) {
  const videoId = video.id.videoId || video.id;
  const snippet = video.snippet || {};

  // Dropdown menu state
  const [showMenu, setShowMenu] = useState(false);

  // Safe thumbnail
  const thumbnail =
    snippet.thumbnails?.high?.url ||
    snippet.thumbnails?.medium?.url ||
    snippet.thumbnails?.default?.url ||
    "https://via.placeholder.com/160x90?text=No+Image";

  const channelThumbnail =
    snippet.channelThumbnail ||
    "https://via.placeholder.com/40?text=No+Image";

  const formatViews = (num) => {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M views";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K views";
    return num + " views";
  };

  return (
    <div className="w-full relative">

      {/* WHOLE CARD CLICKABLE */}
      <Link
        to={`/video/${videoId}`}
        className="block group rounded-xl transition bg-white hover:bg-gray-100 p-2"
      >
        {/* Thumbnail */}
        <div className="relative pb-[56.25%] overflow-hidden rounded-lg shadow-md">
          <img
            src={thumbnail}
            alt={snippet.title || "Video"}
            className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>

        {/* Card content */}
        <div className="flex mt-5 relative">

          <img
            src={channelThumbnail}
            alt={snippet.channelTitle || "Channel"}
            className="w-10 h-10 rounded-full mr-3 flex-shrink-0"
          />

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold line-clamp-2 pr-8">
              {snippet.title || "No Title"}
            </h3>

            <p className="text-xs text-gray-600">
              {snippet.channelTitle || "Unknown"}
            </p>

            <p className="text-xs text-gray-500">
              {formatViews(video.statistics?.viewCount)} •{" "}
              {snippet.publishedAt
                ? new Date(snippet.publishedAt).toLocaleDateString()
                : ""}
            </p>
          </div>

          {/* Menu Button – IMPORTANT: stop the link click */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="absolute right-0 top-0 p-2 rounded-full hover:bg-gray-200 transition z-10"
          >
            <HiDotsVertical className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </Link>

      {/* Dropdown Menu */}
      {showMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />

          <div className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden">
            <button
              onClick={() => {
                alert("Saved to Library!");
                setShowMenu(false);
              }}
              className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100 flex items-center gap-4 transition"
            >
              <img src="/book.png" alt="bookmark" className="w-8" />
              <span>Save to Library</span>
            </button>

            <button
              onClick={() => {
                alert("Video hidden!");
                setShowMenu(false);
              }}
              className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100 flex items-center gap-4 transition border-t border-gray-200"
            >
              <img src="/block.png" alt="block" className="w-8" />
              <span>Not interested</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
