import { useEffect, useRef } from "react";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  generateBeautyCampaign,
  generateCampaignVideos,
  getCampaignStatus,
  getMusicOption
} from "../API/Campaign.api";
import { MdFullscreen } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
import { FiDownload } from "react-icons/fi";
import { PiFilmSlate } from "react-icons/pi";
import { FaDownload } from "react-icons/fa";

import Navbar from "../components/Navbar/Navbar";
import CircularLoader from "../components/Loader/CircularLoader";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [scenes, setScenes] = useState([]);
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(true);
  const [campaignId, setCampaignId] = useState(null);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoSuccess, setVideoSuccess] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const pollingRef = useRef(null);
  const [startPolling, setStartPolling] = useState(false);
  const [musicOptions, setMusicOptions] = useState([]);
  const [videoStatusMessage, setVideoStatusMessage] = useState(
    "Initializing video generation…",
  );
  const [sidebarValues, setSidebarValues] = useState({
    businessType: "",
    theme: "",
    scenes: "",
    characterAge: "25-30",
    gender: "",
    ethnicity: "",
    businessName: "",
    phoneNumber: "",
    website: "",
    music: "",
  });
  useEffect(() => {
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, []);

  const handleFetchMusicOptions = async () => {
    try {
      const response = await getMusicOption();

      console.log("Music API Response:", response);

      setMusicOptions(response?.music_options || []);
    } catch (error) {
      console.error("Failed to fetch music options", error);
    }
  };

  const handleGenerateCampaign = async () => {
    try {
      setLoading(true);
      setSuccess(false);
      const response = await generateBeautyCampaign({
        business_type: sidebarValues.businessType.toLowerCase(),
        campaign_theme: sidebarValues.theme.toLowerCase(),
        character_age: sidebarValues.characterAge,
        character_gender: sidebarValues.gender.toLowerCase(),
        character_ethnicity: sidebarValues.ethnicity.toLowerCase(),
        character_style: "professional, natural",
        num_scenes: sidebarValues.scenes,
        background_music: sidebarValues.music,
      });
      console.log("GENERATE RESPONSE", response);
      setScenes(response?.scenes || []);
      setCampaignId(response?.campaign_id);
      setSuccess(true);
    } catch (error) {
      console.error("Campaign generation failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!campaignId) return;
    try {
      setVideoLoading(true);
      setVideoSuccess(false);
      setVideoUrl(null);
      const response = await generateCampaignVideos(
        campaignId,
        sidebarValues.businessName,
        sidebarValues.phoneNumber,
        sidebarValues.website,
        sidebarValues.music,
      );

      if (response) {
        setStartPolling(true);
      }
    } catch (error) {
      console.error("Video generation failed", error);
      setVideoLoading(false);
    }
  };

  const handleDownloadVideo = async () => {
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "campaign-video.mp4";
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Video download failed", error);
    }
  };

  const handleDownloadImage = async (imageUrl, sceneNumber) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `scene-${sceneNumber}.png`;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Image download failed", error);
    }
  };

  useEffect(() => {
    if (!startPolling || !campaignId || pollingRef.current) return;
    if (videoUrl) {
      setVideoSuccess(true);
      setVideoLoading(false);
      setVideoStatusMessage("");
      setStartPolling(false);
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    pollingRef.current = setInterval(async () => {
      try {
        const response = await getCampaignStatus(campaignId);
        const status = response?.campaign?.status;
        const videoUrlFromApi = response?.campaign?.final_video_url;
        if (!videoUrlFromApi) {
          if (status === "merging_video") {
            setVideoStatusMessage("Merging scenes into final video…");
          } else if (status === "processing") {
            setVideoStatusMessage("Processing video scenes…");
          } else {
            setVideoStatusMessage("Video is being generated…");
          }
          return;
        } else {
          setVideoUrl(videoUrlFromApi);
          setVideoSuccess(true);
          setVideoLoading(false);
          setVideoStatusMessage("");
          setStartPolling(false);
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      } catch (error) {
        console.error("Polling failed", error);
      }
    }, 10000);
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [startPolling, campaignId]);

  return (
    <div className="h-screen bg-[#F4F7FB] font-lexend">
      {loading && <CircularLoader text="GENERATING" />}

      <Navbar />

      <div className="flex h-[calc(100vh-56px)] overflow-hidden">
        <Sidebar
          open={open}
          setOpen={setOpen}
          sidebarValues={sidebarValues}
          setSidebarValues={setSidebarValues}
          musicOptions={musicOptions}
          onMusicClick={handleFetchMusicOptions}
        />
        <main className="flex-1 pl-16 md:pl-6 p-6 h-full overflow-y-auto">
          <div
            className="rounded-2xl bg-white border border-slate-200
            p-3 md:p-6 flex items-center gap-3 md:gap-4 shadow-lg"
          >
            <div className="icon-flip w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] flex items-center justify-center bg-[#1e63b6] rounded-full text-white text-[24px]">
              <PiFilmSlate />
            </div>
            <div className="w-[calc(100%-40px)] sm:w-[calc(100%-50px)]">
              <h2 className="text-xl md:text-2xl font-semibold text-[#1E63B6]">
                AI Ad Studio
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Generate professional AI video ads using Veo 3.1
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-6 md:mt-10 mb-4">
            <h3 className="text-lg leading-5 md:text-xl font-semibold">
              Step 1 : Generate Campaign Images
            </h3>
          </div>
          <div className="">
            <button
              onClick={handleGenerateCampaign}
              disabled={loading}
              className="primary_btn px-4 py-[10px] rounded-md bg-[#1E63B6] 
            text-white text-xs sm:text-sm uppercase tracking-[1px] font-semibold
             border border-[#1E63B6]
            cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Generating...
                </>
              ) : (
                <>
                  <span>Generate Campaign Images</span>
                </>
              )}
            </button>
          </div>
          {success && (
          <div className="flex items-center justify-center  gap-3 my-6 p-4 rounded-lg 
               bg-green-100 border border-green-200">

              <div className="flex items-center justify-center 
                w-8 h-8 rounded-full bg-green-600 text-white shrink-0">
                ✓
              </div>

              <div>
                <h4 className="text-green-700 font-semibold text-sm md:text-xl capitalize">
                  Images generated successfully
                </h4>
              </div>
          </div>
          )}
          {scenes.length > 0 && (
            <>
              <h2 className="text-lg leading-5 md:text-xl font-semibold mb-4">Generated Images</h2>
              <div className="grid justify-center grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
                {scenes.map((scene) => (
                  <div
                    key={scene.scene_number}
                    className={`relative bg-white rounded-xl  overflow-hidden
                  shadow-[0px_2px_8px_0px_rgba(99,99,99,0.2)] hover:shadow-[0px_3px_10px_5px_rgba(99,99,99,0.2)] transition-all duration-300 ease-in-out
                  ${scenes.length === 1 ? "w-full max-w-full sm:max-w-6xl mx-auto" : "max-w-none"}`}
                  >
                    <div className="group  overflow-hidden">
                      <button
                        onClick={() => setFullscreenImage(scene.image)}
                        className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full transition z-10 cursor-pointer"
                        title="View Fullscreen"
                        >
                        <MdFullscreen />
                      </button>
                      <img
                        src={scene.image}
                        alt={`Scene ${scene.scene_number} - ${scene.title}`}
                        className={`w-full ${scenes.length === 1 ? "h-auto" : "h-64"}
                        object-cover opacity-0 animate-fadeIn transition-transform duration-500 ease-out group-hover:scale-[1.05]`}
                        onLoad={(e) =>
                          e.currentTarget.classList.remove("opacity-0")
                        }
                      />
                    </div>
                    
                    <div className="px-4 py-3 text-sm text-black flex items-center justify-between">
                      <h3 className="text-lg font-semibold uppercase tracking-[0.5px] text-[#1E63B6]">Scene {scene.scene_number}</h3>
                      <button
                      onClick={() =>
                        handleDownloadImage(scene.image, scene.scene_number)
                      }
                      className="bg-black/60 hover:bg-black text-white p-2 rounded-full transition cursor-pointer"
                      title="Download Image"
                    >
                      <FiDownload size={16} />
                    </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {campaignId && (
            <>
              <div className="flex items-center gap-3 mt-10">
                <h2 className="text-lg leading-5 md:text-xl font-semibold mb-4">
                  Step 2 : Generate Campaign Video
                </h2>
              </div>
              <div className="shadow-[0px_2px_8px_0px_rgba(99,99,99,0.2)] bg-white rounded-xl p-3 md:p-5 mb-6 space-y-3 md:space-y-4">
                <div className="">
                  <h3 className="text-lg leading-5 md:text-xl text-[#1E63B6] font-semibold">
                    Campaign ID
                  </h3>
                </div>
                <input
                  type="text"
                  value={campaignId}
                  readOnly
                  className="w-full bg-gray-200 rounded px-3 py-2 text-[#1E63B6] text-sm"
                />
                <button
                  onClick={handleGenerateVideo}
                  disabled={videoLoading}
                  className="primary_btn px-4 py-[10px] rounded-md bg-[#1E63B6] 
            text-white text-xs sm:text-sm uppercase tracking-[1px] font-semibold
            border-1 border-[#1E63B6]
            cursor-pointer"
                >
                  {videoLoading ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Video is Generating...
                    </>
                  ) : (
                    <>
                      <span> Generate Video</span>
                    </>
                  )}
                </button>
                {videoSuccess && videoUrl && (
                <div className="flex items-center justify-center  gap-3 my-6 p-4 rounded-lg 
                      bg-green-100 border border-green-200">

                    <div className="flex items-center justify-center 
                      w-8 h-8 rounded-full bg-green-600 text-white shrink-0">
                      ✓
                    </div>

                    <div>
                      <h4 className="text-green-700 font-semibold text-sm md:text-xl capitalize">
                        Video generated successfully
                      </h4>
                    </div>
                </div>
                )}
              </div>
            </>
          )}

          {videoLoading && !videoUrl && (
            <>
              {videoLoading && !videoUrl && (
                <CircularLoader
                  label="GENERATING"
                  status={videoStatusMessage}
                />
              )}
            </>
          )}

          {fullscreenImage && (
            <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
              <button
                onClick={() => setFullscreenImage(null)}
                className="absolute top-4 right-4 text-white text-2xl font-bold"
              >
                <IoIosClose />
              </button>
              <img
                src={fullscreenImage}
                alt="Fullscreen"
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              />
            </div>
          )}
          {videoUrl && (
            <div className="mt-10">
              <h3 className="text-lg leading-5 md:text-xl font-semibold mb-4">Final AI Advertisement</h3>
              <video
                key={videoUrl}
                src={videoUrl}
                controls
                preload="metadata"
                className="w-full rounded-lg shadow-lg mt-2"
              />
              <button
                onClick={handleDownloadVideo}
                className="primary_btn mt-5 px-4 py-[10px] rounded-md bg-[#1E63B6] 
            text-white text-xs sm:text-sm uppercase tracking-[1px] font-semibold
            border-1 border-[#1E63B6]
            cursor-pointer"
              >
                <span className="flex items-center gap-3">
                <FaDownload />
                   Download Final Ad
                </span>
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
