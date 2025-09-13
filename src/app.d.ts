// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: import('@supabase/supabase-js').SupabaseClient<
				import('$lib/types/database.types').Database
			>;
			safeGetSession(): Promise<{
				session: import('@supabase/supabase-js').Session | null;
				user: import('@supabase/supabase-js').User | null;
			}>;
			session: import('@supabase/supabase-js').Session | null;
			user: import('@supabase/supabase-js').User | null;
		}
		interface PageData {
			session: import('@supabase/supabase-js').Session | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

// Ensure SvelteKit modules are available
declare module '$app/navigation' {
	export function goto(
		url: string | URL,
		opts?: {
			replaceState?: boolean;
			noScroll?: boolean;
			keepFocus?: boolean;
			invalidateAll?: boolean;
			state?: any;
		}
	): Promise<void>;
	export function invalidate(dependency: string | ((url: URL) => boolean)): Promise<void>;
	export function invalidateAll(): Promise<void>;
	export function preloadData(href: string): Promise<void>;
	export function preloadCode(...urls: string[]): Promise<void>;
	export function beforeNavigate(
		fn: (navigation: {
			from: URL | null;
			to: URL | null;
			type: 'enter' | 'leave' | 'link' | 'goto' | 'popstate';
			willUnload: boolean;
			cancel(): void;
		}) => void
	): void;
	export function afterNavigate(
		fn: (navigation: {
			from: URL | null;
			to: URL | null;
			type: 'enter' | 'leave' | 'link' | 'goto' | 'popstate';
		}) => void
	): void;
	export function onNavigate(
		fn: (navigation: {
			from: URL | null;
			to: URL | null;
			type: 'enter' | 'leave' | 'link' | 'goto' | 'popstate';
			complete: Promise<void>;
		}) => void | Promise<void>
	): void;
	export function disableScrollHandling(): void;
	export function pushState(url: string | URL, state: any): void;
	export function replaceState(url: string | URL, state: any): void;
	export const navigating: import('svelte/store').Readable<{
		from: URL | null;
		to: URL | null;
		type: 'enter' | 'leave' | 'link' | 'goto' | 'popstate';
	} | null>;
	export const page: import('svelte/store').Readable<{
		url: URL;
		params: Record<string, string>;
		route: { id: string | null };
		status: number;
		error: Error | null;
		data: Record<string, any>;
		form?: any;
		state: Record<string, any>;
	}>;
	export const updated: import('svelte/store').Readable<boolean>;
}

export {};
