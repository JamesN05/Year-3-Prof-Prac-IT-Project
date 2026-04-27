export function usernameToEmail(username: string) {
  const cleanUsername = username
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "");

  return `${cleanUsername}@taskmaxxing.app`;
}
