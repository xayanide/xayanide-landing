export const load = async ({ cookies }) => {
	const userId = cookies.get('userId');
	return {
		userId
	};
};
