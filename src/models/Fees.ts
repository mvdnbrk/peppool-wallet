import * as v from 'valibot';

export const RecommendedFeesSchema = v.object({
  fastestFee: v.number(),
  halfHourFee: v.number(),
  hourFee: v.number(),
  economyFee: v.number(),
  minimumFee: v.number()
});

export type RecommendedFees = v.InferOutput<typeof RecommendedFeesSchema>;
