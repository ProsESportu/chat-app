import type { SessionWithId } from "$lib/types";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async (event) => {
  return {
    session: await event.locals.getSession() as SessionWithId,
  };
};