/*
import { MongoClient } from "mongodb";
import { MONGODB_URI, DATABASE_NAME } from "$env/static/private";

const client = new MongoClient(MONGODB_URI);

export function start_mongo() {
  return client.connect();
}

export default client.db(DATABASE_NAME);
*/

// The code below is useful for improving performance on development mode.
// If you don't care about that and want something easier to use,
// then use the code above and call `start_mongo` in `hooks.server.ts`
// in order to connect to the database every time a request is made,
// or every time the user reloads the page.

// If you decide to go with the code below,
// then make sure to connect to the right database before every request.
// Connect to the database like this:
// 1. import the default export as `mongoClient`
// 2. `const client = await mongoClient`
// 3. `const db = client.db(DATABASE_NAME)`
// One-liner would be: `const db = (await mongoClient).db(DATABASE_NAME)`

import { MongoClient } from 'mongodb';
import { MONGODB_URI } from '$env/static/private';
import { dev } from '$app/environment';

if (!MONGODB_URI) {
	throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const options = {};

let mongoClient;

if (dev) {
	// In development mode, use a global variable so that the value
	// is preserved across module reloads caused by HMR (Hot Module Replacement).
	if (!global._mongomongoClient) {
		mongoClient = new MongoClient(MONGODB_URI, options);
		global._mongomongoClient = mongoClient.connect();
	}
	mongoClient = global._mongomongoClient;
} else {
	// In production mode, it's best to not use a global variable.
	mongoClient = new MongoClient(MONGODB_URI, options).connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default mongoClient;
