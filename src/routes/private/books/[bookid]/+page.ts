import type { PageLoad } from './$types';

export const load: PageLoad = async ({ parent, params }) => {
	const { supabase } = await parent();
	const { bookid } = params;

	const bookIdNumber = parseInt(bookid);

	if (isNaN(bookIdNumber)) {
		return {
			error: { message: 'Invalid book ID' }
		};
	}

	const { data, error } = await supabase.from('books').select('*').eq('id', bookIdNumber).single();

	if (data) {
		return {
			book: data
		};
	} else {
		return {
			error: error
		};
	}
};
