type DexcomSession = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: number;
};

interface ValidDexcomSession {
  accessToken: string;
  sessionId: string;
}

type ApiErrorCode =
  | "SESSION_NOT_FOUND"
  | "SESSION_EXPIRED"
  | "TOKEN_REFRESH_FAILED"
  | "RATE_LIMITED"
  | "INVALID_DATE_RANGE"
  | "DEXCOM_ERROR";

interface GlucoseSummary {
  estimatedA1c: number | null;
  meanGlucose: number | null;
  coveragePercent: number;
  days: number;
  sampleCount: number;
}

interface Egv {
  systemTime: string;
  value: number;
}

interface DexcomRequestContext {
  accessToken: string;
  sessionId: string;
  start: Date;
  end: Date;
}

export {
  Egv,
  DexcomSession,
  ValidDexcomSession,
  ApiErrorCode,
  GlucoseSummary,
  DexcomRequestContext,
};
