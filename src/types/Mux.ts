type Mux = {
  data: {
    upload_id: string;
    tracks: (
      | {
          type: "audio";
          primary: boolean;
          max_channels: string;
          max_channel_layout: string;
          id: string;
          duration: number;
        }
      | {
          type: "video";
          max_width: number;
          max_height: number;
          max_frame_rate: number;
          id: string;
          duration: number;
        }
    )[];
    status: string;
    resolution_tier: string;
    playback_ids: {
      policy: "public" | "signed";
      id: string;
    }[];
    non_standard_input_reasons?: any;
    aspect_ratio?: string;
    mp4_support: "none" | "standard";
    max_stored_resolution: string;
    max_resolution_tier: "1080p" | "1440p" | "2160p";
    master_access: string;
    id: string;
    encoding_tier: "smart" | "baseline";
    duration: number;
    created_at: string;
  }[];
};

export default Mux;
