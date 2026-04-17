import { describe, it, expect } from 'vitest';
import { toInscription, type RawInscriptionResponse } from './Inscription';

const mockRawResponse: RawInscriptionResponse = {
  id: '5f48e29eabc123def456e2f3i0',
  number: 17212333,
  effective_content_type: 'image/png',
  content_length: 793,
  height: 500000,
  value: 100000,
  satpoint: '5f48e29eabc123def456e2f3:0:0',
  timestamp: 1773570237,
  properties: { title: 'peppool', traits: { eyes: 'laser' } }
};

describe('Inscription Model', () => {
  it('maps raw API response to slim Inscription', () => {
    const result = toInscription(mockRawResponse);
    expect(result).toEqual({
      id: '5f48e29eabc123def456e2f3i0',
      number: 17212333,
      contentType: 'image/png',
      contentLength: 793,
      height: 500000,
      value: 100000,
      satpoint: '5f48e29eabc123def456e2f3:0:0',
      timestamp: 1773570237,
      properties: { title: 'peppool', traits: { eyes: 'laser' } }
    });
  });

  it('uses effective_content_type as contentType (handles delegates)', () => {
    const raw: RawInscriptionResponse = {
      ...mockRawResponse,
      effective_content_type: 'image/webp'
    };
    expect(toInscription(raw).contentType).toBe('image/webp');
  });

  it('handles null properties', () => {
    const raw: RawInscriptionResponse = { ...mockRawResponse, properties: null };
    expect(toInscription(raw).properties).toBeNull();
  });
});
