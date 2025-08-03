import { fail, redirect} from '@sveltejs/kit';
// Define the structure for action response data
interface ReturnObject {
	success: boolean;
	errors: string[];
}

export const actions = {
	default: async ({ request, locals: {supabase} }) => {
		// Extract form data from the POST request
		const formData = await request.formData();

		// Get form field values and cast to strings
		const name = formData.get('name') as string;
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const passwordConfirmation = formData.get('passwordConfirmation') as string;

		// Initialize response object with success state
		const returnObject: ReturnObject = {
			success: true,
			errors: []
		};

		// Validate name length requirement
		if (name.length < 3) {
			returnObject.errors.push('Name has to be at least of length 3 characters.');
		}

		// Validate email is provided
		if (!email.length) {
			returnObject.errors.push('Email is required.');
		}

		// Validate password is provided
		if (!password.length) {
			returnObject.errors.push('Password is required.');
		}

		// Validate passwords match
		if (password !== passwordConfirmation) {
			returnObject.errors.push('Passwords do not match.');
		}

		// If validation errors exist, mark as failed and return
		if (returnObject.errors.length) {
			returnObject.success = false;
			return returnObject;
		}

		const {data, error} = await supabase.auth.signUp({
			email,
			password
		});

		if (error || !data.user) {
			console.log("There has been an error");
			console.log(error);
			returnObject.success = true;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			return fail(400, returnObject as any);
		  }

		redirect(303, '/private/dashboard');
	}
};
