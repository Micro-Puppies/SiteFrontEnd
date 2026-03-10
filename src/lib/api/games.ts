import { apiFetch } from './client';
import type { GameDto } from '$lib/types';

export const getAllGames    = ()            => apiFetch<GameDto[]>('/api/games');
export const getFeaturedGames = ()         => apiFetch<GameDto[]>('/api/games/featured');
export const getGame       = (slug: string) => apiFetch<GameDto>(`/api/games/${slug}`);
