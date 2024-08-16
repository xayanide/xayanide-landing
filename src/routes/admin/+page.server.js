import getUser from "$db/getUser";

export const load = async ({ cookies }) => {
  const {user, db} = await getUser(cookies);
  const data = await db
    .collection("projects")
    .find({})
    .toArray();
  return {
    projects: data.map(v => ({ ...v, _id: v._id.toString() })),
    user: {
      email: user.email
    },
  }
};
