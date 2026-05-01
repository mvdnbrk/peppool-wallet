import * as v from 'valibot';

export const RawAddressStatsSchema = v.object({
  funded_txo_count: v.number(),
  funded_txo_sum: v.number(),
  spent_txo_count: v.number(),
  spent_txo_sum: v.number(),
  tx_count: v.number()
});

export type RawAddressStats = v.InferOutput<typeof RawAddressStatsSchema>;

export const RawAddressInfoSchema = v.object({
  address: v.string(),
  chain_stats: RawAddressStatsSchema,
  mempool_stats: RawAddressStatsSchema
});

export type RawAddressInfo = v.InferOutput<typeof RawAddressInfoSchema>;
