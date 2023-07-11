
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/prisma.server';
import type { SessionWithId, Message } from '$lib/types';
import { client } from '$lib/pusher.server';

export const load = (async (e) => {
    const session = await e.locals.getSession() as SessionWithId
    if (!session?.user) {
        throw redirect(303, "/")
    }
    const authorized = await prisma.conversation.findUniqueOrThrow({
        where: { id: e.params.cuid },
        include: { users: { select: { id: true } } }
    })
    if (!(authorized.users.map(user => user.id).includes(session.user.id))) {
        throw redirect(303, "/")
    }
    const messages = await prisma.message.findMany({
        where: {
            conversationId: e.params.cuid
        },
        include: {
            sender: {
                select: {
                    name: true, image: true, id: true,
                }
            },
        },
    })
    const title = (await prisma.conversation.findUniqueOrThrow({
        where: { id: e.params.cuid },
        include: {
            users: {
                where: { id: { not: session.user.id } },
                select: { name: true }
            }
        }

    })).users.reduce((r, e) => r + e.name + ",", "")
    return { messages, title };
}) satisfies PageServerLoad;

export const actions = {
    default: (async (e) => {
        const message = (await e.request.formData()).get("message")
        const session = await e.locals.getSession() as SessionWithId
        if (session?.user && typeof message === "string") {
            const push: Message = {
                content: message,
                timestamp: new Date().getTime(),
                userId: session.user.id,
                sender: {
                    image: session.user.image || undefined,
                    name: session.user.name || undefined
                }
            }
            await client.trigger(e.params.cuid, "message", push)
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