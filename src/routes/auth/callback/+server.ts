import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const code = url.searchParams.get('code');
	const error = url.searchParams.get('error');
	const errorDescription = url.searchParams.get('error_description');

	// Handle OAuth errors
	if (error) {
		console.error('OAuth error:', error, errorDescription);
		throw redirect(
			303,
			`/login?error=${error}&description=${encodeURIComponent(errorDescription || '')}`
		);
	}

	if (code) {
		const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
		if (exchangeError) {
			console.error('Code exchange error:', exchangeError);
			throw redirect(303, '/login?error=exchange_failed');
		}
	}

	const sessionData = await supabase.auth.getSession();

	if (sessionData.data.session) {
		console.log(sessionData.data.session.user);
		const userId = sessionData.data.session.user.id;
		const userName = sessionData.data.session.user.user_metadata.name;

		const { data: existingUser, error: selectError } = await supabase
			.from('user_names')
			.select('name')
			.eq('user_id', userId)
			.single();

		if (selectError && selectError.code !== 'PGRST116') {
			// postgres 116
			return new Response('Failed to check for existing user', { status: 500 });
		}

		if (!existingUser) {
			const { error: insertError } = await supabase
				.from('user_names')
				.insert([{ user_id: userId, name: userName }]);

			if (insertError) {
				return new Response('Failed to insert user name', { status: 500 });
			}
		}

		throw redirect(303, '/private/dashboard');
	}

	throw redirect(303, '/login?error=no_session');
};
