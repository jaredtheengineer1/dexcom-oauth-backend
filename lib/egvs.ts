import axios from 'axios';

const toDexcomDate = (date: Date) => date.toISOString(); //.replace(/\.\d{3}Z$/, "");

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
