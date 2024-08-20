import { json } from '@sveltejs/kit';
import mongoClient from '../../../db/mongo';
import { DATABASE_NAME } from '$env/static/private';

export const GET = async () => {
	try {
		const db = (await mongoClient).db(DATABASE_NAME);
		const collection = db.collection('jsondata');
		const latestEntry = await collection.findOne({}, { sort: { _id: -1 } });
		if (latestEntry) {
			return json({
				insertedId: latestEntry._id.toString(),
				upload_date: latestEntry.upload_date.toString()
			});
		} else {
			return json({ error: 'No data found' }, { status: 404 });
		}
	} catch (error) {
		return json({ error: 'Failed to fetch the latest inserted ID' }, { status: 500 });
	}
};
