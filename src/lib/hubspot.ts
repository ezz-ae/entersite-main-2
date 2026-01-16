import { Client } from '@hubspot/api-client';
import { CAP } from '@/lib/capabilities';

export const hubspot = CAP.hubspot
  ? new Client({ accessToken: process.env.HUBSPOT_ACCESS_TOKEN! })
  : null;
