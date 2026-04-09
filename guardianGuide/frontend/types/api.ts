export interface ApiError {
  detail: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ZonesApiResponse {
  zones: import("./zone").SafetyZone[];
  geojson?: Record<string, unknown>;
}

export interface SosApiResponse {
  success: boolean;
  message?: string;
  emergencyServices?: Record<string, unknown[]>;
}
