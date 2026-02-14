import axiosInstance, { createCancelToken } from "../Interceptor/AxiosInstance";

export const generateBeautyCampaign = ({
  business_type,
  campaign_theme,
  character_age,
  character_gender,
  character_ethnicity,
  character_style,
  num_scenes,
}) => {
  const params = new URLSearchParams({
    business_type,
    campaign_theme,
    character_age,
    character_gender,
    character_ethnicity,
    character_style,
    num_scenes,
  });

  return axiosInstance.post(
    `/api/campaign/generate_beauty_campaign?${params.toString()}`,
    {},
    {
      timeout: 300000,
    },
  );
};

export const generateCampaignVideos = (
  campaign_id,
  business_name,
  phone_number,
  website,
  onProgress = null,
) => {
  console.log("generateCampaignVideos called", {
    campaign_id,
    business_name,
    phone_number,
    website,
  });
  const cancelTokenSource = createCancelToken();
  if (onProgress?.cancelRef) {
    onProgress.cancelRef.current = cancelTokenSource.cancel;
  }
  return axiosInstance.post(
    `/api/campaign/generate_campaign_videos/${campaign_id}`,
    null,
    {
      params: {
        ...(business_name && { business_name }),
        ...(phone_number && { phone_number }),
        ...(website && { website }),
      },

      timeout: 360000,
      cancelToken: cancelTokenSource.token,
    },
  );
};

export const getCampaignStatus = async (campaign_id) => {
  const response = await axiosInstance.get(
    `/api/campaign/campaign/${campaign_id}`,
  );
  return response;
};

export const getMusicOption = async () => {
  const response = await axiosInstance.get(`/api/campaign/music-options`);
  return response;
};
