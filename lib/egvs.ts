import axios from 'axios';
import { WINDOW_MS } from '../constants';

const toDexcomDate = (date: Date) =>
  date.toISOString().replace(/\.\d{3}Z$/, 'Z'); //.replace(/\.\d{3}Z$/, "");

export const fetchEgvsRange = async (
  accessToken: string,
  start: Date,
  end: Date
) => {
  const all: any[] = [];
  let cursor = new Date(start);

  while (cursor < end) {
    const windowEnd = new Date(
      Math.min(cursor.getTime() + WINDOW_MS - 5000, end.getTime())
    );

    if (windowEnd <= cursor) break;
    // const next = new Date(cursor.getTime() + 24 * 60 * 60 * 1000);

    const chunk = await fetchEgvs(accessToken, cursor, windowEnd);

    all.push(...chunk);
    cursor = windowEnd;
  }

  return all;
};

export const fetchEgvs = async (
  accessToken: string,
  start: Date,
  end: Date
) => {
  const params = {
    startDate: toDexcomDate(start),
    endDate: toDexcomDate(end),
  };

  const res = await axios.get(process.env.DEXCOM_EGV_URL!, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params,
  });

  return res.data;
};
