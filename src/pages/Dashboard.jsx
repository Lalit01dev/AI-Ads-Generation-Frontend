import { useState } from "react";
import Sidebar from "../components/Sidebar";
import {
  generateBeautyCampaign,
  generateCampaignVideos,
} from "../API/Campaign.api";
import { MdFullscreen } from "react-icons/md";
import { IoIosClose } from "react-icons/io";
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
  });

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
      const response = await generateCampaignVideos(
        campaignId,
        sidebarValues.businessName,
        sidebarValues.phoneNumber,
        sidebarValues.website,
      );
      console.log("VIDEO URL SET TO:", response?.data?.final_merged_video);
      setVideoUrl(response.final_merged_video);
      setVideoSuccess(true);
    } catch (error) {
      console.error("Video generation failed", error);
    } finally {
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

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      <Sidebar
        open={open}
        setOpen={setOpen}
        sidebarValues={sidebarValues}
        setSidebarValues={setSidebarValues}
      />

      <main className="flex-1 p-6 space-y-6 h-full overflow-y-auto">
        <div className="rounded-2xl bg-gradient from-slate-800 via-slate-700 to-slate-600 p-6 flex items-center gap-4 shadow-lg">
          <div className="text-3xl">🎬</div>
          <div>
            <h1 className="text-2xl font-semibold">AI Ad Studio</h1>
            <p className="text-sm text-slate-300">
              Generate professional AI video ads using Veo 3.1
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">
            Step 1 : Generate Campaign Images
          </h2>
        </div>
        <button
          onClick={handleGenerateCampaign}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2 bg-violet-600 rounded-lg disabled:opacity-50 hover:bg-violet-500 transition"
        >
          {loading ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              Generating...
            </>
          ) : (
            <>✨ Generate Campaign Images</>
          )}
        </button>

        {success && (
          <div className="bg-green-900/40 border border-green-700 text-green-300 px-4 py-3 rounded-lg">
            Images generated successfully
          </div>
        )}

        {scenes.length > 0 && (
          <>
            <h2 className="text-xl font-semibold">Generated Images</h2>
            <div className="grid justify-center grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
              {scenes.map((scene) => (
                <div
                  key={scene.scene_number}
                  className={`relative bg-slate-900 rounded-xl overflow-hidden 
                  border border-slate-800 hover:scale-[1.02] transition
                  ${scenes.length === 1 ? "w-full max-w-full sm:max-w-6xl mx-auto" : "max-w-none"}`}
                >
                  <button
                    onClick={() => setFullscreenImage(scene.image)}
                    className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 hover:opacity-100 transition z-10"
                    title="View Fullscreen"
                  >
                    <MdFullscreen />
                  </button>

                  <img
                    src={scene.image}
                    alt={`Scene ${scene.scene_number} - ${scene.title}`}
                    className={`w-full ${scenes.length === 1 ? "h-auto" : "h-64"} object-cover opacity-0 animate-fadeIn`}
                    onLoad={(e) =>
                      e.currentTarget.classList.remove("opacity-0")
                    }
                  />
                  <div className="p-3 text-sm text-slate-300">
                    Scene {scene.scene_number}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        {campaignId && (
          <>
            <div className="flex items-center gap-3 mt-10">
              <h2 className="text-xl font-semibold">
                Step 2 : Generate Campaign Video
              </h2>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
              <div className="text-sm text-slate-300">Campaign ID</div>

              <input
                type="text"
                value={campaignId}
                readOnly
                className="w-full bg-slate-800 rounded px-3 py-2 text-slate-300"
              />

              <button
                onClick={handleGenerateVideo}
                disabled={videoLoading}
                className="flex items-center gap-2 px-6 py-2 bg-emerald-600 rounded-lg disabled:opacity-50 hover:bg-emerald-500 transition"
              >
                {videoLoading ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Generating Video...
                  </>
                ) : (
                  <>🎬 Generate Video</>
                )}
              </button>

              {videoSuccess && (
                <div className="bg-green-900/40 border border-green-700 text-green-300 px-4 py-3 rounded-lg">
                  Video generated successfully
                </div>
              )}
            </div>
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
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Final AI Advertisement</h3>
            <video
              key={videoUrl}
              src={videoUrl}
              controls
              preload="metadata"
              className="w-full rounded-lg shadow-lg mt-2"
            />
            <button
              onClick={handleDownloadVideo}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition"
            >
              ⬇️ Download Final Ad
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
