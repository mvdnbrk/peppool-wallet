import * as v from 'valibot';

export const UtxoSchema = v.object({
  txid: v.string(),
  vout: v.number(),
  value: v.number(),
  status: v.object({
    confirmed: v.boolean(),
    block_height: v.optional(v.number()),
    block_time: v.optional(v.number())
  })
});

export type Utxo = v.InferOutput<typeof UtxoSchema>;
