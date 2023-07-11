import { SvelteKitAuth } from "@auth/sveltekit";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GitHub from "@auth/core/providers/github";
import { AUTH_SECRET, GITHUB_ID, GITHUB_SECRET } from "$env/static/private";
import { prisma } from "$lib/prisma.server";
import type { SessionWithId } from "$lib/types";

export const handle = SvelteKitAuth({
  adapter: PrismaAdapter(prisma),
  providers: [GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET })],
  secret: AUTH_SECRET,
  callbacks: {
    session: (e): SessionWithId => {
      if (e.session.user) {
        e.session.user.id = e.user.id
      }
      return e.session as SessionWithId;
    }
  }
});