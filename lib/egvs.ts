import axios from 'axios';

const toDexcomDate = (date: Date) => date.toISOString(); //.replace(/\.\d{3}Z$/, "");

export const fetchEgvsRange = async (
  accessToken: string,
  start: Date,
  end: Date
) => {
  const all: any[] = [];
  let cursor = new Date(start);

  while (cursor < end) {
    const next = new Date(cursor.getTime() + 24 * 60 * 60 * 1000);

    const chunk = await fetchEgvs(accessToken, cursor, next < end ? next : end);

    all.push(...chunk);
    cursor = next;
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
