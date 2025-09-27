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
		return new Response('Unauthorized', { status: 401 });
	}

	const token = authHeader.split(' ')[1];

	try {
		const { data: userData, error: verificationError } = await supabaseAdmin.auth.getUser(token);

		if (verificationError || !userData.user) {
			return new Response('Unauthorized', { status: 401 });
		}

		const userId = userData.user.id;
		const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

		if (deleteError) {
			return json({ error: deleteError.message }, { status: 500 });
		}

		return json({ message: 'User deleted successfully' });
	} catch (error) {
		console.error('Error deleting user:', error);
		return json({ error: 'An error occurred while deleting the user' }, { status: 500 });
	}
};
