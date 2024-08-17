import { deleteFile } from '$db/gfs';
import { fail } from '@sveltejs/kit';
import getUser from '$db/getUser';
export const DELETE = async ({ cookies }) => {
	try {
	  const { user, db } = await getUser(cookies);
	  if (user.picture) {
		await deleteFile(user.picture, db);
		await db.collection('users').updateOne({ email: user.email }, { $unset: { picture: "" } });
		return new Response("Successfully deleted profile picture.", { status: 200 })
	  } else {
		return fail(404, {
		  error: 'No picture to delete'
		});
	  }
	} catch (e) {
	  console.error('Failed to delete picture:', e);
	  return fail(400, {
		error: 'Could not delete the picture from the database.'
	  });
	}
}
