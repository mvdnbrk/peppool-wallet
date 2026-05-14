import type { Form } from '@/utils/form';

export type SendInscriptionForm = Form<{
  recipient: string;
  password: string;
  step: number;
  txid: string;
}>;
