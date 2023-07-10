import { prisma } from "$lib/prisma.server";
import { error, json } from "@sveltejs/kit";

export const GET = async (e) => {
    const data = e.url.searchParams.get("data")

    if (data) {
        const res = await prisma.user.findMany({
            where: {
                OR: [{
                    name: { contains: data },
                },

                {
                    email: { contains: data },
                }]
            }

        })
        return json(res)
    }
    throw error(400, "No data provided")
}
export const POST = async (e) => {
    const data = await e.request.text()
    const session = await e.locals.getSession()
    if (session?.user?.id && data) {
        const res = await prisma.conversation.create({
            data: {
                users: {
                    connect: [
                        { id: session.user.id },
                        { id: data },
                    ]
                }
            },
            include: {
                users: {
                    where: { id: { not: session.user.id } }
                }
            }
        })
        return json(res)
    }
    throw error(400, "No data provided")
}