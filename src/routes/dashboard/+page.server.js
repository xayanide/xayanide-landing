import getUser from '../../db/getUser';

export const load = async (loadData) => {
	const { user } = await getUser(loadData.cookies);
	return {
		user: {
			email: user.email
		}
	};
};
