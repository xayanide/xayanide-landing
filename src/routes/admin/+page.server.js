import getUser from "$db/getUser";
import { replaceFile, uploadFile } from '$db/gfs';
import { fail } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
	const { user } = await getUser(cookies);
	return {
		user: {
			file: user.file,
			email: user.email
			// ... and some more info about the user.
		}
	};
};



export const actions = {
	upload: async ({ cookies, request }) => {
		const data = await request.formData();
		const file = data.get('file');
		// Below are arbitrary values used for the example.
		// It is highly recommended to set those as global variables,
		// and to widen the possibilites.
		const availableTypes = ['application/json'];
		if (!availableTypes.includes(file.type)) {
			return fail(400, {
				error: 'The file type is not allowed. Must be json.'
			});
		}
		try {
			const { user, decipheredUserId, db } = await getUser(cookies);
			const options = { metadata: { uploadedBy: decipheredUserId, type: file.type } };
			let fileId;
			try {
				// Does the user already have a picture?
				// Depending on your needs, you'll either want to keep the old one or delete it.
				// Here, I'm deleting the old version to save space.
				if (user.file) {
					fileId = await replaceFile(user.file, 'file', file, db, options);
				} else {
					fileId = await uploadFile('file', file, db, options);
				}
			} catch (e) {
				return fail(400, {
					error: 'Could not save the file to the database.'
				});
			}
			await db
				.collection('users')
				.updateOne({ email: user.email }, { $set: { file: fileId } });
		} catch (e) {
			return fail(400, {
				error: 'Could not save the file to the database.'
			});
		}
	},
};
