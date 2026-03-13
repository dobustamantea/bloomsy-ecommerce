function getAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined) {
  if (!email) {
    return false;
  }

  return getAdminEmails().includes(email.trim().toLowerCase());
}

export async function getAdminSession() {
  const { auth } = await import("@/auth");
  const session = await auth();

  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    return null;
  }

  return session;
}
