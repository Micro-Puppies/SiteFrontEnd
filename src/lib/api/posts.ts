import { apiFetch } from './client';
import type { PostDto } from '$lib/types';

export const getAllPosts    = ()             => apiFetch<PostDto[]>('/api/posts');
export const getRecentPosts = (n: number)   => apiFetch<PostDto[]>(`/api/posts/recent/${n}`);
export const getPost       = (slug: string)  => apiFetch<PostDto>(`/api/posts/${slug}`);
