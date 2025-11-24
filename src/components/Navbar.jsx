import { useState, useRef } from "react";
import {
  FaBars,
  FaSearch,
  FaBell,
  FaMicrophone,
  FaUserCircle,
  FaArrowLeft,
} from "react-icons/fa";

export default function Navbar({ toggleSidebar, onSearch }) {
  const [voiceActive, setVoiceActive] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [mobileSearch, setMobileSearch] = useState(false);
  const [inputActive, setInputActive] = useState(false);
  const recognitionRef = useRef(null);

  const startVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser not supported");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;

    recognition.onstart = () => setListening(true);
    recognition.onresult = (event) =>
      setVoiceText(event.results[0][0].transcript);

    recognition.onend = () => {
      setListening(false);
      setVoiceActive(false);
      if (voiceText.trim()) onSearch(voiceText.trim());
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white text-black flex items-center justify-between px-6 h-14">

        {mobileSearch ? (
          <div className="flex w-full items-center gap-3 sm:hidden">
            <FaArrowLeft
              className="text-xl cursor-pointer"
              onClick={() => setMobileSearch(false)}
            />
            <div className="flex items-center flex-1 bg-[#f1f1f1] rounded-full border border-gray-300 px-3 py-2">
              <FaSearch className="text-gray-600 text-lg mr-2" />
              <input
                type="text"
                placeholder="Search"
                value={voiceText}
                onChange={(e) => setVoiceText(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[14px] font-normal text-black placeholder:text-gray-600"
              />
            </div>
            <button
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
              onClick={() => setVoiceActive(true)}
            >
              <FaMicrophone className="text-lg" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-4">
              <FaBars
                className="text-xl font-[500] cursor-pointer"
                onClick={toggleSidebar}
              />
              <a href="/" className="flex items-center gap-2">
                <img src="/logo.svg" alt="YouTube" className="w-20 md:w-24" />
                <span className="text-[11px] -ml-2 -mt-3 font-semibold text-gray-700">
                  PK
                </span>
              </a>
            </div>

            {/* CENTER SEARCH */}
            <div className="flex-1 justify-center hidden sm:flex">
              <div className="relative flex items-center flex-1 max-w-xl lg:max-w-lg xl:max-w-2xl mx-4 xl:ml-20">

                {/* search icon only when input active */}
                {inputActive && (
                  <FaSearch className="absolute left-4 text-black font-[500] text-lg" />
                )}

                <input
                  type="text"
                  placeholder="Search"
                  value={voiceText}
                  onFocus={() => setInputActive(true)}
                  onBlur={() => setInputActive(false)}
                  onChange={(e) => setVoiceText(e.target.value)}
                  className={`flex-1 bg-white text-black font-normal placeholder:text-gray-600 ${
                    inputActive ? "pl-12" : "pl-4"
                  } pr-3 py-[6.5px] text-[16px] rounded-l-full outline-none border border-[#d1d1d1]
                  focus:border-blue-600 focus:border focus:border`}
                />

                <button
                  className="bg-[#f8f8f8] border border-[#d1d1d1] px-5 pt-[8px] py-[7px] rounded-r-full"
                  onClick={() => {
                    if (voiceText.trim()) onSearch(voiceText.trim());
                  }}
                >
                  <img src="/search.png" alt="" className="w-5.5" />
                </button>

                <button
                  className="w-10 h-10 bg-[#f2f2f2] hover:bg-gray-200 rounded-full flex items-center justify-center ml-3"
                  onClick={() => setVoiceActive(true)}
                >
                  <img src="/mic.png" alt="mic" className="w-6" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-5">
              <button className="sm:hidden text-2xl" onClick={() => setMobileSearch(true)}>
                <FaSearch />
              </button>

              <button className="hidden text-[#202020] sm:flex items-center gap-1 bg-[#f2f2f2] hover:bg-gray-200 px-4 py-[6px] rounded-full text-sm font-semibold">
                <span className="text-xl"><img src="/plus.png" alt="plus"  className="w-6"/></span> Create
              </button>

              <div className="relative cursor-pointer">
                <FaBell className="text-2xl" />
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-1.5 py-[1px] rounded-full">
                  9+
                </span>
              </div>

              <button className="sm:hidden text-3xl">＋</button>

              <div className="w-9 h-9 bg-blue-700 rounded-full text-white flex items-center justify-center text-lg font-semibold cursor-pointer">
                F
              </div>
            </div>
          </>
        )}
      </div>

      {/* Voice modal */}
      {voiceActive && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg flex flex-col items-center gap-4 w-80">
            <p className="font-semibold text-lg">Voice Search</p>
            <button
              onClick={startVoiceSearch}
              className={`px-4 py-2 rounded-full ${
                listening ? "bg-red-500 text-white" : "bg-gray-200 text-black"
              }`}
            >
              {listening ? "Listening..." : "Start Speaking"}
            </button>
            <p className="text-gray-700">{voiceText}</p>
            <button
              onClick={() => setVoiceActive(false)}
              className="mt-2 text-sm text-blue-500 underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
