import * as v from 'valibot';

export const InscriptionSchema = v.object({
  id: v.string(),
  number: v.number(),
  contentType: v.string(),
  contentLength: v.number(),
  value: v.number(),
  satpoint: v.string(),
  timestamp: v.number(),
  properties: v.nullable(v.record(v.string(), v.unknown()))
});

export type Inscription = v.InferOutput<typeof InscriptionSchema>;

/**
 * Maps the raw API response from GET /inscription/:id to a slim Inscription.
 */
export const RawInscriptionResponseSchema = v.object({
  id: v.string(),
  number: v.number(),
  effective_content_type: v.string(),
  content_length: v.number(),
  value: v.number(),
  satpoint: v.string(),
  timestamp: v.number(),
  properties: v.nullable(v.record(v.string(), v.unknown()))
});

export type RawInscriptionResponse = v.InferOutput<typeof RawInscriptionResponseSchema>;

export function toInscription(raw: RawInscriptionResponse): Inscription {
  return {
    id: raw.id,
    number: raw.number,
    contentType: raw.effective_content_type,
    contentLength: raw.content_length,
    value: raw.value,
    satpoint: raw.satpoint,
    timestamp: raw.timestamp,
    properties: raw.properties
  };
}
