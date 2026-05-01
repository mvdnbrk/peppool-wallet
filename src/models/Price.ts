import * as v from 'valibot';

export const PriceSchema = v.object({
  USD: v.number(),
  EUR: v.number()
});

export type Price = v.InferOutput<typeof PriceSchema>;
