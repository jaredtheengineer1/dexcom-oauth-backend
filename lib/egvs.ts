import axios from 'axios';
import { WINDOW_MS } from '../constants';

/**
 * 
 * Dexcom Date Rules
 * 
 * For /v3/users/self/egvs, Dexcom is very strict:

    startDate must be before endDate

    Range cannot exceed Dexcom’s allowed window

    Sandbox is especially strict

    Dates must be ISO 8601 and aligned to available data

    Sandbox often has data only for specific historical windows


 */
const toDexcomDate = (date: Date) =>
  date.toISOString().replace(/\.\d{3}Z$/, 'Z'); //.replace(/\.\d{3}Z$/, "");

const startOfUtcDay = (d: Date) =>
  new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

const endOfUtcDay = (d: Date) =>
  new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59)
  );

export const fetchEgvsRange = async (
  accessToken: string,
  start: Date,
  end: Date
) => {
  const all: any[] = [];
  let cursor = new Date(start);

  while (cursor < end) {
    const dayStart = startOfUtcDay(cursor);
    const dayEnd = endOfUtcDay(cursor);

    const windowStart = cursor;
    const windowEnd = new Date(Math.min(dayEnd.getTime(), end.getTime()));

    if (windowEnd <= windowStart) break;

    const chunk = await fetchEgvs(accessToken, windowStart, windowEnd);
    all.push(...chunk);

    // advance to next day boundary
    cursor = new Date(dayEnd.getTime() + 1000);
  }

  return all;
};

export const fetchEgvs = async (
  accessToken: string,
  start: Date,
  end: Date
) => {
  // const params = {
  //   startDate: toDexcomDate(start),
  //   endDate: toDexcomDate(end),
  // };

  const start1 = new Date('2022-01-01T00:00:00Z');
  const end1 = new Date('2022-01-02T00:00:00Z');

  const params = {
    startDate: toDexcomDate(start1),
    endDate: toDexcomDate(end1),
  };

  const res = await axios.get(process.env.DEXCOM_EGV_URL!, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params,
  });

  return res.data;
};
