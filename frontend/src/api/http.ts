import Constants from 'expo-constants';

import { mockRequest } from '@/api/mock/server';

const extra = (Constants.expoConfig?.extra ?? {}) as {
  apiBaseUrl?: string;
  useMockApi?: boolean;
};

/**
 * Config resolution order: env var (EXPO_PUBLIC_*) → app.json `extra` → default.
 * Set `EXPO_PUBLIC_USE_MOCK=false` in a `.env` file to hit the Django backend.
 */
const USE_MOCK =
  process.env.EXPO_PUBLIC_USE_MOCK != null
    ? process.env.EXPO_PUBLIC_USE_MOCK !== 'false'
    : (extra.useMockApi ?? true);

const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? extra.apiBaseUrl ?? 'http://localhost:8000/api';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

function messageFromBody(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined;
  const d = data as Record<string, unknown>;
  // DRF returns { detail } or { <field>: [msg] } or a bare [msg]; mock returns { message }.
  if (typeof d.message === 'string') return d.message;
  if (typeof d.detail === 'string') return d.detail;
  const first = Object.values(d)[0];
  if (Array.isArray(first) && typeof first[0] === 'string') return first[0];
  return undefined;
}

/**
 * Single choke point for network access. Every feature talks to the backend
 * through here, so retries, auth headers, logging and the mock/real switch all
 * live in one place.
 */
export async function request<T>(method: Method, path: string, body?: unknown): Promise<T> {
  if (USE_MOCK) {
    const res = await mockRequest<T>(method, path, body);
    if (res.status >= 400) {
      throw new ApiError(messageFromBody(res.data) ?? 'Request failed', res.status);
    }
    return res.data;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = (await res.json().catch(() => null)) as T;
  if (!res.ok) {
    throw new ApiError(messageFromBody(data) ?? 'Request failed', res.status);
  }
  return data;
}

export const http = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
};
