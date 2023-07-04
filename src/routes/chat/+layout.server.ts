import { prisma } from '$lib/prisma';
import type { LayoutServerLoad } from './$types';
import { redirect } from "@sveltejs/kit";
export const load = (async (e) => {
    const session = await e.locals.getSession()
    if (session?.user) {
        const convs = await prisma.user.findUniqueOrThrow({
            include: {
                conversations: {
                    include: {
                        users: true
                    },
                }
            },
            where: { id: session.user.id }
        }
        )
        return { convs: convs };
    }
    throw redirect(303, "/")
}) satisfies LayoutServerLoad;