
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/prisma.server';
import type { SessionWithId } from '$lib/types';

export const load = (async (e) => {
    //check if the user is authenticated
    const session = await e.locals.getSession() as SessionWithId
    if (!session?.user) {
        throw redirect(303, "/")
    }
    const authorized = await prisma.conversation.findUniqueOrThrow({
        where: { id: e.params.cuid },
        include: { users: true }
    })
    if (!(authorized.users.map(user => user.id).includes(session.user.id))) {
        throw redirect(303, "/")
    }
    const messages = await prisma.message.findMany({
        where: {
            conversationId: e.params.cuid
        },
        include: {
            sender: true,
            conversation: {
                include: { users: true }
            }
        }
    })
    return { messages, conv: await e.parent() };
}) satisfies PageServerLoad;

export const actions = {
    default: (async (e) => {
        const message = (await e.request.formData()).get("message")
        const session = await e.locals.getSession() as SessionWithId
        if (session?.user && typeof message === "string") {
            await prisma.message.create({
                data: {
                    content: message,
                    conversationId: e.params.cuid,
                    userId: session.user.id
                }

            })
        }


    })
} satisfies Actions