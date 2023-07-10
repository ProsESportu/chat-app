import Pusher from "@pusher/push-notifications-server";
import Channels from "pusher"
import { PUSHER_SECRET,PUSHER_APP_ID,PUSHER_CHANNELS_SECRET } from "$env/static/private";
import { PUBLIC_PUSHER_INSTANCE_ID,PUBLIC_PUSHER_APP_KEY,PUBLIC_PUSHER_CLUSTER } from "$env/static/public";
export const serverClient = new Pusher({
    instanceId: PUBLIC_PUSHER_INSTANCE_ID,
    secretKey: PUSHER_SECRET
})
export const client = new Channels({
    appId:PUSHER_APP_ID,
    key:PUBLIC_PUSHER_APP_KEY,
    secret:PUSHER_CHANNELS_SECRET,
    cluster:PUBLIC_PUSHER_CLUSTER
})