
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { prisma } from '$lib/prisma.server';
import type { SessionWithId, Message } from '$lib/types';
import { serverClient, client } from '$lib/pusher.server';

export const load = (async (e) => {
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
        },
        orderBy:{timestamp:"desc"}
    })
    return { messages, conv: await e.parent() };
}) satisfies PageServerLoad;

export const actions = {
    default: (async (e) => {
        const message = (await e.request.formData()).get("message")
        const session = await e.locals.getSession() as SessionWithId
        if (session?.user && typeof message === "string") {
            const users = await prisma.conversation.findUniqueOrThrow({
                where: { id: e.params.cuid },
                include: {
                    users: {
                        where: {
                            id: { not: session.user.id }
                        }
                    }
                }
            })
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
            await serverClient.publishToUsers(users.users.map(user => user.id), {
                web: {
                    notification: {
                        deep_link: e.url.toString(),
                        title: session.user.name || undefined,
                        body: message
                    }
                }
            })
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