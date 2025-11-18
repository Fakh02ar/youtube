import { useEffect, useState } from "react";
import { fetchVideos } from "../utils/api";
import VideoCard from "../components/VideoCard";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const data = await fetchVideos("react tutorials");
        setVideos(data);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  return (
    <div className="px-6 py-7 bg-white min-h-screen text-black mt-5">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-40 bg-gray-700 rounded-lg"></div>
              <div className="mt-3 h-3 bg-gray-700 rounded"></div>
              <div className="mt-2 h-3 bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 gap-y-15">
          {videos?.map((video, index) => (
            <VideoCard key={video.id?.videoId || index} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
