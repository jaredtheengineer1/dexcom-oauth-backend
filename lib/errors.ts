import { VercelResponse } from '@vercel/node';
import { ApiErrorCode } from '../types';

const apiError = (
  res: any,
  status: number,
  code: ApiErrorCode,
  message?: string
) => {
  res.status(status).json({
    error: code,
    message,
  });
};

const handleApiErrors = (err: any, res: VercelResponse) => {
  if (err.code === 'SESSION_NOT_FOUND' || err.code === 'TOKEN_REFRESH_FAILED') {
    return apiError(res, 401, err.code);
  }

  if (err.code === 'RATE_LIMITED') {
    if (err.retryAfter) {
      res.setHeader('Retry-After', err.retryAfter);
    }
    return apiError(res, 429, err.code);
  }

  if (err.code === 'INVALID_DATE_RANGE') {
    return apiError(res, 400, err.code);
  }

  console.error(err);
  return apiError(res, 500, 'DEXCOM_ERROR');
};

export { apiError, handleApiErrors };
