import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { Database } from '$lib/types/database.types';
import { createClient } from '@supabase/supabase-js';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const DELETE: RequestHandler = async ({ request }) => {
	const supabaseAdmin = createClient<Database>(PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

	const authHeader = request.headers.get('Authorization');

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		console.error('Missing or invalid Authorization header');
		return new Response('Unauthorized - Missing authorization header', { status: 401 });
	}

	const token = authHeader.split(' ')[1];
	console.log('Attempting to delete account with token:', token.substring(0, 20) + '...');

	try {
		const { data: userData, error: verificationError } = await supabaseAdmin.auth.getUser(token);

		if (verificationError) {
			console.error('Token verification error:', verificationError);
			return new Response(`Unauthorized - ${verificationError.message}`, { status: 401 });
		}

		if (!userData.user) {
			console.error('No user found with provided token');
			return new Response('Unauthorized - Invalid user', { status: 401 });
		}

		const userId = userData.user.id;
		console.log('Deleting user with ID:', userId);

		// First, delete user's data from custom tables
		try {
			const { error: booksDeleteError } = await supabaseAdmin
				.from('books')
				.delete()
				.eq('user_id', userId);

			if (booksDeleteError) {
				console.error('Error deleting books:', booksDeleteError);
			} else {
				console.log('Successfully deleted user books');
			}

			const { error: userNamesDeleteError } = await supabaseAdmin
				.from('user_names')
				.delete()
				.eq('user_id', userId);

			if (userNamesDeleteError) {
				console.error('Error deleting user_names:', userNamesDeleteError);
			} else {
				console.log('Successfully deleted user_names');
			}
		} catch (dataDeleteError) {
			console.error('Error deleting user data:', dataDeleteError);
			// Continue with auth deletion even if data deletion fails
		}

		// Delete the user from Supabase Auth
		const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

		if (deleteError) {
			console.error('Auth deletion error:', deleteError);
			return json({ error: deleteError.message }, { status: 500 });
		}

		console.log('User deleted successfully');
		return json({ message: 'User deleted successfully' });
	} catch (error) {
		console.error('Error deleting user:', error);
		return json({ error: 'An error occurred while deleting the user' }, { status: 500 });
	}
};
