/**
 * Generates an uncrackable, clean 10-character alphanumeric guest access code
 * Uses unambiguous characters (excludes 0, O, 1, I, L) for maximum clarity on mobile screens.
 */
export function generateGuestCode(): string {
  const chars = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
