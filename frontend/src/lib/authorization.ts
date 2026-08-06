// Authorization rules live in the composition (core) domain — never in a
// service domain. Auth owns the *settings* (the permission tokens a user
// holds); this module owns the *rules* that map capabilities to the access
// rights required to perform them.

export type AccessRight = 'verified_user' | (string & {});

export type Capability = 'marketplace:publish' | (string & {});

export const CAPABILITY_RIGHTS: Record<Capability, AccessRight[]> = {
  'marketplace:publish': ['verified_user'],
};

export interface UserLike {
  id?: string;
  permissions?: string[];
  emailVerified?: boolean;
}

export function rightsFor(user: UserLike | null | undefined): Set<string> {
  const rights = new Set<string>(user?.permissions ?? []);
  if (user?.emailVerified) rights.add('verified_user');
  return rights;
}

export function can(user: UserLike | null | undefined, capability: Capability): boolean {
  const required = CAPABILITY_RIGHTS[capability] ?? [];
  const held = rightsFor(user);
  return required.every((right) => held.has(right));
}

export function missingRights(
  user: UserLike | null | undefined,
  capability: Capability,
): string[] {
  const required = CAPABILITY_RIGHTS[capability] ?? [];
  const held = rightsFor(user);
  return required.filter((right) => !held.has(right));
}

export function firstMissingRight(
  user: UserLike | null | undefined,
  capability: Capability,
): string | null {
  return missingRights(user, capability)[0] ?? null;
}

// Re-reads the authenticated user's access rights from Auth so the gate never
// trusts a stale session flag. Auth returns raw permission tokens; the rule
// mapping lives here.
export async function fetchAccessRights(authBase: string, token: string): Promise<string[]> {
  const base = authBase.replace(/\/+$/, '');
  try {
    const res = await fetch(`${base}/access-rights`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.permissions) ? data.permissions : [];
  } catch {
    return [];
  }
}
