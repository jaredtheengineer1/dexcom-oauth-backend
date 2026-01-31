import { ApiErrorCode } from "../types";

const apiError = (
  res: any,
  status: number,
  code: ApiErrorCode,
  message?: string,
) => {
  res.status(status).json({
    error: code,
    message,
  });
};

export { apiError };
