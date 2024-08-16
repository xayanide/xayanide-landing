import { DATABASE_NAME } from '$env/static/private';
import { fail } from '@sveltejs/kit';
import { encryptUserId, hashPassword, validatePassword } from '$db/security';
import clientPromise from "$db/mongo";
import ip from "ip";

export const actions = {
  login: async ({ cookies, request }) => {
    try {
      const data = await request.formData();
      const email = data.get('email');
      const password = data.get('password');
      const client = await clientPromise;
      const db = client.db(DATABASE_NAME);
      const user = await db
        .collection("users")
        .findOne({ email });
      if (user == null) {
        return fail(401, {
          error: "The user doesn't exist"
        });
      }
      if (!validatePassword(password, user.password)) {
        return fail(401, {
          error: "Wrong password"
        });
      }
      cookies.set("userId", encryptUserId(user._id.toString(), ip.address()), { path: "/", sameSite: true, secure: true });
    } catch (e) {
      return fail(400, {
        error: "Cannot login"
      });
    }
  },

  register: async ({ cookies, request }) => {
    try {
      const data = await request.formData();
      const email = data.get('email');
      const password = data.get('password');
      const client = await clientPromise;
      const db = client.db(DATABASE_NAME);
      const user = await db
        .collection("users")
        .findOne({ email })
      if (user != null) {``
        return fail(401, {
          error: "This user already exists"
        });
      }
      const newUser = await db
        .collection("users")
        .insertOne({ email, password: hashPassword(password) });
      // ! A `secure` cookie will not be available on the client side, but still visible in the console.
      cookies.set("userId", encryptUserId(newUser.insertedId.toString(), ip.address()), { path: "/", sameSite: true, httpOnly: true, secure: true });
    } catch (e) {
      return fail(400, {
        error: "Cannot sign in"
      });
    }
  },
};
