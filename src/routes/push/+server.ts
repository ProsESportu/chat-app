import { json, error } from '@sveltejs/kit'
import { serverClient } from "$lib/pusher.server";
export const GET = async (e) => {

    const session = await e.locals.getSession()
    if (session?.user?.id != e.url.searchParams.get("user_id")) {
        throw error(401, "Malformed request")
    }
    return json(serverClient.generateToken(session?.user?.id))
}