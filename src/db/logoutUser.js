/**
 * Logs out the user.
 * Logging out the user means deleting the cookie holding his user ID.
 * @param cookies The cookies. One must be "userId".
 */
export default function logOutUser(cookies) {
  cookies.delete("userId", { path: "/" });
}
