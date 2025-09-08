export type DailyCloudCoverResponse = {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  daily_units: {
    time: string;              // "iso8601"
    cloud_cover_mean: string;  // "%"
  };
  daily: {
    time: string[];            // z. B. ["2025-09-07", "2025-09-08"]
    cloud_cover_mean: number[]; // Werte in %
  };
};
