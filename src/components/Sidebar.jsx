import { FaHome, FaCompass, FaVideo, FaUser, FaDownload } from "react-icons/fa";

export default function Sidebar({ isOpen }) {
  return (
    <div
      className={`hidden lg:flex fixed top-14 left-0 h-[calc(100vh-56px)] bg-white text-black w-20 
      flex-col items-center py-4 transition-all duration-300
      ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      <div className="flex flex-col gap-6 text-center">
        
        <div className="flex flex-col items-center cursor-pointer hover:bg-gray-200 p-3 rounded-xl">
          <FaHome className="text-xl" />
          <span className="text-xs">Home</span>
        </div>

        <div className="flex flex-col items-center cursor-pointer hover:bg-gray-200 p-3 rounded-xl">
          <FaCompass className="text-xl" />
          <span className="text-xs">Shorts</span>
        </div>

        <div className="flex flex-col items-center cursor-pointer hover:bg-gray-200 p-3 rounded-xl">
          <FaVideo className="text-xl" />
          <span className="text-xs">Subs</span>
        </div>

        <div className="flex flex-col items-center cursor-pointer hover:bg-gray-200 p-3 rounded-xl">
          <FaUser className="text-xl" />
          <span className="text-xs">You</span>
        </div>

        <div className="flex flex-col items-center cursor-pointer hover:bg-gray-200 p-3 rounded-xl">
          <FaDownload className="text-xl" />
          <span className="text-xs">Downloads</span>
        </div>

      </div>
    </div>
  );
}
