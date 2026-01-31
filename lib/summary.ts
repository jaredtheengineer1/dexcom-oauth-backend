import { Egv, GlucoseSummary } from "../types";
import {
  EGV_INTERVAL_MINUTES,
  EXPECTED_EGVS_PER_DAY,
  MIN_DAYS_FOR_A1C,
  MIN_COVERAGE_PERCENT,
  ONE_DAY,
  GMI_INTERCEPT,
  GMI_SLOPE,
} from "../constants";

const summarizeEgvs = (egvs: Egv[]): GlucoseSummary => {
  if (egvs.length === 0) {
    return {
      estimatedA1c: null,
      meanGlucose: null,
      coveragePercent: 0,
      days: 0,
      sampleCount: 0,
    };
  }

  const sorted = [...egvs].sort(
    (a, b) =>
      new Date(a.systemTime).getTime() - new Date(b.systemTime).getTime(),
  );

  const daySet = new Set(
    sorted.map((e) => new Date(e.systemTime).toISOString().slice(0, 10)),
  );
  const days = daySet.size;
  const expectedSamples = days * EXPECTED_EGVS_PER_DAY;
  const coveragePercent = Math.round(
    Math.min(1, sorted.length / expectedSamples) * 100,
  );
  const meanGlucose =
    sorted.reduce((sum, e) => sum + e.value, 0) / sorted.length;
  const hasEnoughData =
    days >= MIN_DAYS_FOR_A1C && coveragePercent >= MIN_COVERAGE_PERCENT;
  const estimatedA1c = hasEnoughData
    ? Number((GMI_INTERCEPT + GMI_SLOPE * meanGlucose).toFixed(1))
    : null;

  return {
    estimatedA1c,
    meanGlucose: Number(meanGlucose.toFixed(1)),
    coveragePercent,
    days,
    sampleCount: sorted.length,
  };
};

export { summarizeEgvs };
