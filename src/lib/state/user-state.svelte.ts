import { goto } from '$app/navigation';
import type { Database } from '$lib/types/database.types';
import type { Session, SupabaseClient, User } from '@supabase/supabase-js';
import { getContext, setContext } from 'svelte';
import { SvelteDate } from 'svelte/reactivity';

export interface UserStateProps {
	session: Session | null;
	supabase: SupabaseClient | null;
	user: User | null;
}

export interface Book {
	author: string | null;
	cover_image: string | null;
	created_at: string;
	description: string | null;
	finished_reading_on: string | null;
	genre: string | null;
	id: number;
	rating: number | null;
	started_reading_on: string | null;
	title: string;
	user_id: string;
}

type UpdateableBookFields = Omit<Book, 'id' | 'user_id' | 'created_at'>;

export class UserState {
	session = $state<Session | null>(null);
	supabase = $state<SupabaseClient<Database> | null>(null);
	user = $state<User | null>(null);
	allBooks = $state<Book[]>([]);
	userName = $state<string | null>(null);

	constructor(data: UserStateProps) {
		this.updateState(data);
	}

	updateState(data: UserStateProps) {
		const userChanged = this.user?.id !== data.user?.id;

		console.log('UserState.updateState called:', {
			oldUser: this.user?.email || 'no user',
			newUser: data.user?.email || 'no user',
			userChanged,
			hasSession: !!data.session,
			hasSupabase: !!data.supabase
		});

		this.session = data.session;
		this.supabase = data.supabase;
		this.user = data.user;

		if (data.user && userChanged) {
			this.fetchUserData();
		} else if (!data.user) {
			this.allBooks = [];
		}
	}

	async fetchUserData() {
		if (!this.user || !this.supabase) {
			console.log('fetchUserData - Missing user or supabase:', {
				hasUser: !!this.user,
				hasSupabase: !!this.supabase
			});
			return;
		}

		const userId = this.user.id;

		const [booksResponse, userNamesResponse] = await Promise.all([
			this.supabase.from('books').select('*').eq('user_id', this.user.id),
			this.supabase.from('user_names').select('name').eq('user_id', userId).single()
		]);

		if (
			booksResponse.error ||
			!booksResponse.data ||
			userNamesResponse.error ||
			!userNamesResponse.data
		) {
			console.error('Error fetching user data:', booksResponse.error, userNamesResponse.error);
			return;
		}

		this.allBooks = booksResponse.data;
		this.userName = userNamesResponse.data.name;
		// this.allBooks = data || [];
	}

	getHighestRatedBooks() {
		if (this.allBooks.length === 0) {
			return [];
		}

		return this.allBooks
			.filter((book) => book.rating)
			.toSorted((a, z) => z.rating! - a.rating!)
			.slice(0, 9);
	}

	getUnreadBooks() {
		if (this.allBooks.length === 0) {
			return [];
		}

		return this.allBooks
			.filter((book) => !book.started_reading_on)
			.toSorted(
				(a, z) => new SvelteDate(z.created_at).getTime() - new SvelteDate(a.created_at).getTime()
			)
			.slice(0, 9);
	}

	getFavoriteGenre() {
		if (this.allBooks.length === 0) {
			return '';
		}

		const genreCounts: { [key: string]: number } = {};

		this.allBooks.forEach((book) => {
			const genres = book.genre ? book.genre.split(',') : [];
			genres.forEach((genre) => {
				const trimmedGenre = genre.trim();
				if (trimmedGenre) {
					if (!genreCounts[trimmedGenre]) genreCounts[trimmedGenre] = 1;
					else genreCounts[trimmedGenre]++;
				}
			});
		});

		const mostCommonGenre = Object.keys(genreCounts).reduce((a, b) =>
			genreCounts[a] > genreCounts[b] ? a : b
		);

		return mostCommonGenre;
	}

	getBooksFromFavoriteGenre() {
		const favoriteGenre = this.getFavoriteGenre();
		if (!favoriteGenre || this.allBooks.length === 0) {
			return [];
		}

		return this.allBooks
			.filter((book) => book.genre && book.genre.includes(favoriteGenre))
			.slice(0, 9);
	}

	getBookById(bookId: number) {
		return this.allBooks.find((book) => book.id === bookId);
	}

	async updateBook(bookId: number, updateObject: Partial<UpdateableBookFields>) {
		if (!this.supabase) {
			console.error('No Supabase client found');
			return;
		}

		const { status, error } = await this.supabase
			.from('books')
			.update(updateObject)
			.eq('id', bookId);

		if (error) {
			console.error('Error updating book:', error);
			return;
		}

		if (status === 204 && !error) {
			this.allBooks = this.allBooks.map((book) => {
				if (book.id == bookId) {
					return {
						...book,
						...updateObject
					};
				} else {
					return book;
				}
			});
		}
	}

	async uploadBookCover(file: File, bookId: number) {
		if (!this.user || !this.supabase) {
			return;
		}

		const filePath = `${this.user.id}/${bookId}/${file.name}`;
		const { error: uploadError } = await this.supabase.storage
			.from('book-covers')
			.upload(filePath, file);

		if (uploadError) {
			console.error('Error uploading book cover:', uploadError);
			return;
		}

		const {
			data: { publicUrl }
		} = this.supabase.storage.from('book-covers').getPublicUrl(filePath);

		await this.updateBook(bookId, { cover_image: publicUrl });
	}

	async deleteBookFromLibrary(bookId: number) {
		if (!this.supabase) {
			return;
		}

		const { error, status } = await this.supabase.from('books').delete().eq('id', bookId);
		if (!error && status === 204) {
			this.allBooks = this.allBooks.filter((book) => book.id !== bookId);
		}
		goto('/private/dashboard');
	}

	async logout() {
		await this.supabase?.auth.signOut();
		goto('/login');
	}
}

const USER_STATE_KEY = Symbol('USER_STATE');

export function setUserState(data: UserStateProps) {
	return setContext(USER_STATE_KEY, new UserState(data));
}

export function getUserState() {
	return getContext<ReturnType<typeof setUserState>>(USER_STATE_KEY);
}
