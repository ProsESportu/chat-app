import { prisma } from '$lib/prisma.server';
import type { SessionWithId } from '$lib/types';
import type { LayoutServerLoad, } from './$types';
import { redirect } from "@sveltejs/kit";
export const load = (async (e) => {
    const session = await e.locals.getSession() as SessionWithId;
    if (!session?.user) {
        throw redirect(303, "/")
    }
    const convs = await prisma.user.findUniqueOrThrow({
        include: {
            conversations: {
                include: {
                    users: {
                        where: { id: { not: session.user.id } },
                        select: { image: true, name: true }
                    }
                },
            }
        },
        where: { id: session.user.id }
    }
    )
    return { convs: convs };
}) satisfies LayoutServerLoad;