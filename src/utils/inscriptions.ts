export const INSCRIPTION_CONTENT_BASE_URL =
  import.meta.env.VITE_INSCRIPTION_CONTENT_URL || 'https://peppool.space/content';

export function inscriptionContentUrl(id: string): string {
  return `${INSCRIPTION_CONTENT_BASE_URL}/${id}`;
}

export type InscriptionMediaKind = 'image' | 'video' | 'audio' | 'html' | 'text' | 'json' | 'other';

export function classifyContentType(contentType: string | undefined | null): InscriptionMediaKind {
  if (!contentType) return 'other';
  const lower = contentType.toLowerCase();
  if (lower.startsWith('image/')) return 'image';
  if (lower.startsWith('video/')) return 'video';
  if (lower.startsWith('audio/')) return 'audio';
  if (lower.startsWith('text/html') || lower.startsWith('application/xhtml')) return 'html';
  if (lower.startsWith('application/json') || lower.endsWith('+json')) return 'json';
  if (lower.startsWith('text/')) return 'text';
  return 'other';
}
