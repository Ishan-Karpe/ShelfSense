import { goto } from '$app/navigation';
import type { Database } from '$lib/types/database.types';
import type { User, Session, SupabaseClient } from '@supabase/supabase-js';
import { getContext, setContext } from 'svelte';

interface UserStateProps {
	session: Session | null;
	user: User | null;
	supabase: SupabaseClient | null;
}

interface Book {
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

export class UserState {
	session = $state<Session | null>(null);
	supabase = $state<SupabaseClient<Database> | null>(null);
	user = $state<User | null>(null); //if not logged in user is null
	allBooks = $state<Book[]>([]);

	//session is set to whatever coming in constructor
	constructor(data: UserStateProps) {
		this.updateState(data);
	}

	updateState(data: UserStateProps) {
		const userChanged = this.user?.id !== data.user?.id;
		
		console.log('UserState.updateState called:', {
			oldUser: this.user?.email || 'no user',
			newUser: data.user?.email || 'no user',
			userChanged
		});

		this.session = data.session;
		this.user = data.user;
		this.supabase = data.supabase;

		// Only fetch user data if the user actually changed
		if (userChanged && data.user) {
			this.fetchUserData();
		} else if (!data.user) {
			// Clear books if user logged out
			this.allBooks = [];
		}
	}

	async fetchUserData() {
		if (!this.user || !this.supabase) {
			return;
		}

		const { data, error } = await this.supabase
			.from('books')
			.select('*')
			.eq('user_id', this.user.id);
		if (error) {
			console.error(error);
			return;
		}

		this.allBooks = data;
	}

	async logout() {
		console.log('Logout called - current user:', this.user?.email);
		await this.supabase?.auth.signOut();
		console.log('Supabase signOut completed');
		goto('/'); //reminder that goto is for routing
	}
}

const USER_STATE_KEY = Symbol('USER_STATE');

export function setUserState(data: UserStateProps) {
	return setContext(USER_STATE_KEY, new UserState(data));
} //everytime called you get the same instance of the class, same session in all different files

export function getUserState() {
	return getContext<ReturnType<typeof setUserState>>(USER_STATE_KEY);
} //to get the state of the object
