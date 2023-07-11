import { SvelteKitAuth } from "@auth/sveltekit";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { AUTH_SECRET, GITHUB_ID, GITHUB_SECRET, GOOGLE_CLIENT_ID, GOOGLE_SECRET } from "$env/static/private";
import { prisma } from "$lib/prisma.server";
import type { SessionWithId } from "$lib/types";

export const handle = SvelteKitAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET }),
    Google({ clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_SECRET })
  ],
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