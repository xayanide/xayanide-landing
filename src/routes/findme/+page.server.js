
import getUser from "$db/getUser";
export const load = async ({ cookies }) => {
	const { user } = await getUser(cookies);
	return {
		user: {
			file: user.file,
			// ... and some more info about the user.
		}
	};
};
