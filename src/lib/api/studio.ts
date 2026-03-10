import { apiFetch } from './client';
import type { StudioConfig } from '$lib/types';

export const getStudioConfig = () =>
  apiFetch<StudioConfig>('/api/studio/config');
