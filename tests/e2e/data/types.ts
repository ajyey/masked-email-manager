import type { MaskedEmail } from 'fastmail-masked-email';

// Fastmail returns null when a masked email has never received a message,
// although the upstream package currently types this field as string-only.
export type E2EMaskedEmail = Omit<MaskedEmail, 'lastMessageAt'> & {
  lastMessageAt: string | null;
};
