import type { User, Session, SupabaseClient } from '@supabase/supabase-js';
import { getContext, setContext } from 'svelte';

interface UserStateProps {
	session: Session | null;
	user: User | null;
	supabase: SupabaseClient | null;
}

export class UserState {
	session = $state<Session | null>(null);
	supabase = $state<SupabaseClient | null>(null);
	user = $state<User | null>(null); //if not logged in user is null

	//session is set to whatever coming in constructor
	constructor(data: UserStateProps) {
		this.updateState(data);
	}

	updateState(data: UserStateProps) {
		this.session = data.session;
		this.user = data.user;
		this.supabase = data.supabase;
	}

    async logout() {
        await this.supabase?.auth.signOut();
    }
}

const USER_STATE_KEY = Symbol('USER_STATE');

export function setUserState(data: UserStateProps) {
	return setContext(USER_STATE_KEY, new UserState(data));
} //everytime called you get the same instance of the class, same session in all different files

export function getUserState() {
	return getContext<ReturnType<typeof setUserState>>(USER_STATE_KEY);
}//to get the state of the object
