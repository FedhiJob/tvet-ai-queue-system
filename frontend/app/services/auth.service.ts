export type AuthTokens = {
  access_token: string;
  refresh_token: string;
  token_type?: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  email: string;
  password: string;
  role?: string;
};

type RefreshPayload = {
  refresh_token: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    credentials: "include",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Request failed (${res.status})`);
  }

  return (await res.json()) as T;
}

export async function login(payload: LoginPayload): Promise<AuthTokens> {
  return postJson<AuthTokens>("/auth/login", payload);
}

export async function logout(): Promise<void> {
  // No backend logout endpoint yet; client can just clear tokens.
  return;
}

export async function register(payload: RegisterPayload): Promise<AuthTokens> {
  return postJson<AuthTokens>("/auth/register", payload);
}

export async function refreshToken(payload: RefreshPayload): Promise<AuthTokens> {
  return postJson<AuthTokens>("/auth/refresh", payload);
}

