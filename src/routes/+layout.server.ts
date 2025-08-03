export const load = async ({ locals: { safeGetSession }, cookies }) => {
	const { session } = await safeGetSession();
	return {
		session,
		cookies: cookies.getAll()
	};
};
//pass the safeget sessions down and the cookies are also part of the request to forward to +layout.ts
