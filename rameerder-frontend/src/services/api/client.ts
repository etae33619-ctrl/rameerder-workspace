import { ApiError } from "./errors";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
  data?: unknown;
}

/**
 * Universal JSON Fetch Client handling JWT Bearer injection,
 * query parameter serialization, and standardized FastAPI error mapping.
 */
export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, data, headers: customHeaders, ...customConfig } = options;

  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  const token = localStorage.getItem("rpg_token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customHeaders,
  };

  const config: RequestInit = {
    method: data ? "POST" : "GET",
    headers,
    body: data ? JSON.stringify(data) : undefined,
    ...customConfig,
  };

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (networkError) {
    throw ApiError.networkError(networkError);
  }

  if (response.status === 401) {
    // Clear credentials on invalid/expired token
    localStorage.removeItem("rpg_token");
    localStorage.removeItem("rpg_user");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw ApiError.fromResponse(response.status, errorData);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return await response.json();
}