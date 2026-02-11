import { FaChevronLeft, FaChevronRight, FaInfoCircle } from "react-icons/fa";

export default function Sidebar({
  open,
  setOpen,
  sidebarValues,
  setSidebarValues,
  musicOptions = [],
  onMusicClick,
  isLoading = false,
  estimatedTime = null,
}) {
  const formatTime = (minutes) => {
    if (minutes < 1) return "less than a minute";
    if (minutes === 1) return "1 minute";
    return `${minutes} minutes`;
  };
  const {
    businessType,
    theme,
    scenes,
    characterAge,
    gender,
    ethnicity,
    businessName,
    phoneNumber,
    website,
    music,
  } = sidebarValues;

  return (
    <aside
      className={`relative transition-all duration-300
    bg-white border-r border-slate-200 text-slate-700
      ${open ? "w-80 p-6" : "w-16 p-3 overflow-hidden"}
      flex flex-col h-full overflow-y-auto
      ${isLoading ? "opacity-90" : ""}
      `}
    >
      <button
        onClick={() => !isLoading && setOpen(!open)}
        disabled={isLoading}
        className={`absolute top-4 right-4 text-slate-600 focus:outline-none transition-all
        ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:text-[#1E63B6]"}
        `}
        title={isLoading ? "Processing... Please wait" : "Toggle sidebar"}
      >
        {open ? <FaChevronLeft /> : <FaChevronRight />}
      </button>

      {isLoading && (
        <div className="absolute top-0 left-0 right-0 bg-blue-100 text-blue-800 text-xs">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
          Processing...
          {estimatedTime && (
            <span className="ml-2 text-blue-200">
              ~{formatTime(estimatedTime)}
            </span>
          )}
        </div>
      )}

      {open && (
        <>
          <div className={`${isLoading ? "opacity-75" : ""}`}>
            <h2 className="font-semibold text-slate-800 text-base">
              ⚙ Campaign Settings
              {isLoading && (
                <span className="text-xs bg-blue-800 text-blue-200 px-2 py-1 rounded-full animate-pulse">
                  Active
                </span>
              )}
            </h2>

            <div className="space-y-4 text-sm text-slate-700">
              <div>
                <label
                  htmlFor="businessType"
                  className=" mb-1 text-slate-600 flex items-center gap-1"
                >
                  Business type
                  <FaInfoCircle
                    className="text-slate-500 text-xs"
                    title="Select your business type for tailored content"
                  />
                </label>

                <select
                  className="w-full bg-white rounded-md px-3 py-2 
                  border border-slate-300 
                  focus:border-[#1E63B6] focus:ring-1 focus:ring-[#1E63B6]
                  text-slate-700 text-sm"
                  value={businessType}
                  onChange={(e) =>
                    setSidebarValues({
                      ...sidebarValues,
                      businessType: e.target.value,
                    })
                  }
                  disabled={isLoading}
                >
                  <option value="">Please select</option>
                  <option value="nail salon">Nail Salon</option>
                  <option value="hair salon">Hair Salon</option>
                  <option value="spa">Spa</option>
                </select>
              </div>
              <div>
                <label className="text-slate-600 text-sm">Theme</label>
                <select
                  className="w-full bg-white rounded-md px-3 py-2 
                  border border-slate-300 
                  focus:border-[#1E63B6] focus:ring-1 focus:ring-[#1E63B6]
                  text-slate-700 text-sm"
                  value={theme}
                  onChange={(e) =>
                    setSidebarValues({
                      ...sidebarValues,
                      theme: e.target.value,
                    })
                  }
                  disabled={isLoading}
                >
                  <option value="">Please select</option>
                  <option value="christmas">Christmas</option>
                  <option value="new year">New Year</option>
                  <option value="valentine">Valentine's Day</option>
                  <option value="summer">Summer</option>
                  <option value="winter">Winter</option>
                  <option value="spring">Spring</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 text-sm">
                  Number of scenes
                </label>
                <select
                  className="w-full bg-white rounded-md px-3 py-2 
                  border border-slate-300 
                  focus:border-[#1E63B6] focus:ring-1 focus:ring-[#1E63B6]
                  text-slate-700 text-sm"
                  value={scenes}
                  onChange={(e) =>
                    setSidebarValues({
                      ...sidebarValues,
                      scenes: e.target.value,
                    })
                  }
                  disabled={isLoading}
                >
                  <option value="">Please select</option>
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </select>

                <div className="flex items-center gap-2 mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700">
                  <input
                    type="checkbox"
                    checked
                    readOnly
                    className="h-4 w-4 accent-blue-600"
                    disabled={isLoading}
                  />
                  <span>Recommended: 3-5 scenes for best results</span>
                </div>
              </div>

              <div>
                <label className="text-slate-600 text-sm">Character age</label>
                <input
                  type="text"
                  className="w-full bg-white rounded-md px-3 py-2 
                  border border-slate-300 
                  focus:border-[#1E63B6] focus:ring-1 focus:ring-[#1E63B6]
                  text-slate-700 text-sm"
                  value={characterAge}
                  onChange={(e) =>
                    setSidebarValues({
                      ...sidebarValues,
                      characterAge: e.target.value,
                    })
                  }
                  placeholder="e.g., 25-35, young adult, middle-aged"
                  disabled={isLoading}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Examples: "25-35", "young adult", "middle-aged"
                </p>
              </div>

              <div>
                <label className="text-slate-600 text-sm">Gender</label>
                <select
                  className="w-full bg-white rounded-md px-3 py-2 
                  border border-slate-300 
                 focus:border-[#1E63B6] focus:ring-1 focus:ring-[#1E63B6]
                 text-slate-700 text-sm"
                  value={gender}
                  onChange={(e) =>
                    setSidebarValues({
                      ...sidebarValues,
                      gender: e.target.value,
                    })
                  }
                  disabled={isLoading}
                >
                  <option value="">Please select</option>
                  <option value="woman">Woman</option>
                  <option value="man">Man</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 text-sm">Ethnicity</label>
                <select
                  className="w-full bg-white rounded-md px-3 py-2 
                  border border-slate-300 
                  focus:border-[#1E63B6] focus:ring-1 focus:ring-[#1E63B6]
                  text-slate-700 text-sm"
                  value={ethnicity}
                  onChange={(e) =>
                    setSidebarValues({
                      ...sidebarValues,
                      ethnicity: e.target.value,
                    })
                  }
                  disabled={isLoading}
                >
                  <option value="">Please select</option>
                  <option value="indian">Indian</option>
                  <option value="american">American</option>
                  <option value="asian">Asian</option>
                  <option value="african">African</option>
                  <option value="european">European</option>
                  <option value="latino">Latino</option>
                  <option value="middle eastern">Middle Eastern</option>
                </select>
              </div>
            </div>
          </div>

          <div className={`mt-6 ${isLoading ? "opacity-75" : ""}`}>
            <h2 className="font-semibold text-slate-800 text-base">
              💼 Business Info
              <span className="text-xs text-slate-400">
                (For video customization)
              </span>
            </h2>

            <div className="space-y-4 text-sm text-slate-700">
              <div>
                <label className="text-slate-600 text-sm">Business name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) =>
                    setSidebarValues({
                      ...sidebarValues,
                      businessName: e.target.value,
                    })
                  }
                  className="w-full bg-white rounded-md px-3 py-2 
                  border border-slate-300 
                  focus:border-[#1E63B6] focus:ring-1 focus:ring-[#1E63B6]
                  text-slate-700 text-sm"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="text-slate-600 text-sm">Add Music</label>
                <select
                  onFocus={onMusicClick}
                  className="w-full bg-white rounded-md px-3 py-2 
                   border border-slate-300 
                  focus:border-[#1E63B6] focus:ring-1 focus:ring-[#1E63B6]
                  text-slate-700 text-sm"
                  value={music}
                  onChange={(e) =>
                    setSidebarValues({
                      ...sidebarValues,
                      music: e.target.value,
                    })
                  }
                  disabled={isLoading}
                ></select>
              </div>

              <div>
                <label className="text-slate-600 text-sm">Phone number</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) =>
                    setSidebarValues({
                      ...sidebarValues,
                      phoneNumber: e.target.value,
                    })
                  }
                  className="w-full bg-white rounded-md px-3 py-2 
                  border border-slate-300 
                  focus:border-[#1E63B6] focus:ring-1 focus:ring-[#1E63B6]
                  text-slate-700 text-sm"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="text-slate-600 text-sm">Website</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) =>
                    setSidebarValues({
                      ...sidebarValues,
                      website: e.target.value,
                    })
                  }
                  className="w-full bg-white rounded-md px-3 py-2 
                  border border-slate-300 
                  focus:border-[#1E63B6] focus:ring-1 focus:ring-[#1E63B6]
                  text-slate-700 text-sm"
                  placeholder="https://example.com"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="mt-6 p-3 bg-blue-900/30 border border-blue-800 rounded-lg">
              <div className="flex items-center gap-2 text-blue-300 mb-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                <span className="font-medium">Processing in progress</span>
              </div>
              <p className="text-xs text-blue-400">
                Video generation may take{" "}
                {estimatedTime ? formatTime(estimatedTime) : "a few minutes"}.
                Please keep this window open. You can continue to adjust
                settings.
              </p>
            </div>
          )}

          {!isLoading && (
            <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-medium text-blue-800 text-sm mb-1 flex items-center gap-2">
                <FaInfoCircle className="text-slate-500" />
                Tips for best results:
              </h3>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Fill all fields for personalized content</li>
                <li>• More scenes = more variety in videos</li>
                <li>• Specific details yield better customization</li>
                <li>• Video generation may take 2-5 minutes</li>
              </ul>
            </div>
          )}
        </>
      )}

      {!open && isLoading && (
        <div className="mt-4 flex flex-col items-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mb-2"></div>
          <span className="text-xs text-slate-400 text-center">Processing</span>
        </div>
      )}
    </aside>
  );
}
