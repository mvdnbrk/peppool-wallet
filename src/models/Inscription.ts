import * as v from 'valibot';

export const InscriptionSchema = v.object({
  id: v.string(),
  number: v.number(),
  contentType: v.string(),
  contentLength: v.number(),
  height: v.number(),
  value: v.number(),
  parents: v.array(v.string()),
  properties: v.nullable(v.record(v.string(), v.unknown())),
  satpoint: v.string(),
  timestamp: v.number()
});

export type Inscription = v.InferOutput<typeof InscriptionSchema>;

/**
 * Maps the raw API response from GET /inscription/:id to a slim Inscription.
 */
export const RawInscriptionResponseSchema = v.object({
  id: v.string(),
  number: v.number(),
  effective_content_type: v.string(),
  content_length: v.nullable(v.number()),
  height: v.number(),
  value: v.number(),
  parents: v.array(v.string()),
  properties: v.nullable(v.record(v.string(), v.unknown())),
  satpoint: v.string(),
  timestamp: v.number()
});

export type RawInscriptionResponse = v.InferOutput<typeof RawInscriptionResponseSchema>;

export const RawAddressInscriptionsResponseSchema = v.object({
  inscriptions: v.array(v.string()),
  outputs: v.array(v.string()),
  total: v.number()
});

export type RawAddressInscriptionsResponse = v.InferOutput<
  typeof RawAddressInscriptionsResponseSchema
>;

export function toInscription(raw: RawInscriptionResponse): Inscription {
  return {
    id: raw.id,
    number: raw.number,
    contentType: raw.effective_content_type,
    contentLength: raw.content_length ?? 0,
    height: raw.height,
    value: raw.value,
    parents: raw.parents,
    properties: raw.properties,
    satpoint: raw.satpoint,
    timestamp: raw.timestamp
  };
}
