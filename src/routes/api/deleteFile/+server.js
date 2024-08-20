import { deleteFile } from '../../../db/gfs';
import { fail } from '@sveltejs/kit';
import getUser from '../../../db/getUser';
export const DELETE = async ({ cookies }) => {
	try {
		let response;
		const { user, db } = await getUser(cookies);
		if (user.picture) {
			await deleteFile(user.picture, db);
			await db.collection('users').updateOne({ email: user.email }, { $unset: { picture: '' } });
			response = new Response('Successfully deleted picture.', { status: 200 });
		} else {
			return fail(404, {
				error: 'No file to delete'
			});
		}
		return response;
	} catch (e) {
		console.error('Failed to delete file:', e);
		return fail(400, {
			error: 'Could not delete the file from the database.'
		});
	}
};
