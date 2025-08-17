import { PUBLIC_FRONTEND_URL } from '$env/static/public';
import { fail, redirect } from '@sveltejs/kit';
// Define the structure for action response data
interface ReturnObject {
	success: boolean;
	email: string;
	password: string;
	passwordConfirmation?: never;
	name?: never;
	errors: string[];
}

export const actions = {
	signInWithPassword: async ({ request, locals: { supabase } }) => {
		// Extract form data from the POST request
		const formData = await request.formData();

		// Get form field values and cast to strings
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		// Initialize response object with success state
		const returnObject: ReturnObject = {
			success: true,
			email,
			password,
			errors: []
		};

		// Validate email is provided
		if (!email.length) {
			returnObject.errors.push('Email is required.');
		}

		// Validate password is provided
		if (!password.length) {
			returnObject.errors.push('Password is required.');
		}

		// If validation errors exist, mark as failed and return
		if (returnObject.errors.length) {
			returnObject.success = false;
			return returnObject;
		}

		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error || !data.user) {
			returnObject.success = false;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return fail(400, returnObject as any);
		}

		redirect(303, '/private/dashboard');
	},
	googleLogin: async ({ locals: { supabase } }) => {
		console.log(
			'Initiating Google login with redirect to:',
			`${PUBLIC_FRONTEND_URL}/auth/callback`
		);

		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `${PUBLIC_FRONTEND_URL}/auth/callback`
			}
		});

		if (error) {
			console.error('Google OAuth error:', error);
			return fail(400, {
				message: 'Something went wrong with Google login'
			});
		}

		console.log('Redirecting to Google OAuth URL:', data.url);
		throw redirect(303, data.url);
	}
};
