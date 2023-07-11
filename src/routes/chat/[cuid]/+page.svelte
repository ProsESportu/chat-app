<script lang="ts">
    import type { PageServerData } from "./$types";
    import type { Message } from "$lib/types";
    import { page } from "$app/stores";
    import { enhance } from "$app/forms";
    import { Input, Button } from "flowbite-svelte";
    import { PapperPlaneSolid } from "flowbite-svelte-icons";
    import ChatBubble from "$lib/ChatBubble.svelte";
    import { onMount, onDestroy } from "svelte";
    export let data: PageServerData;
    let main: HTMLElement;
    import Channel, * as Channels from "pusher-js";
    import {
        PUBLIC_PUSHER_APP_KEY,
        PUBLIC_PUSHER_CLUSTER,
    } from "$env/static/public";
    import { browser } from "$app/environment";
    let channel: Channels.Channel;
    let pusher: Channel;
    onMount(() => {
        scrollBottom();
        pusher = new Channel(PUBLIC_PUSHER_APP_KEY, {
            cluster: PUBLIC_PUSHER_CLUSTER,
        });
        channel = pusher.subscribe($page.params.cuid);
        channel.bind("message", (e: Message) => {
            if (e.userId !== $page.data.session?.user?.id) {
                data.messages.push({
                    id: Math.random(),
                    content: e.content,
                    timestamp: new Date(e.timestamp),
                    userId: e.userId,
                    conversationId: $page.params.cuid,
                    sender: {
                        id: e.userId,
                        image: e.sender.image || null,
                        name: e.sender.name || null,
                    },
                });
                data.messages = data.messages;
                setTimeout(scrollBottom, 50);
            }
        });
    });
    if (browser) {
        onDestroy(() => {
            channel.unsubscribe();
            pusher.disconnect();
        });
    }
    function scrollBottom() {
        main.scrollTop = main.scrollHeight;
    }
</script>

<svelte:head>
    <title>{data.title}</title>
</svelte:head>
<main class="w-full overflow-y-scroll" bind:this={main}>
    {#each data.messages as message (message.timestamp)}
        <ChatBubble
            image={message.sender.image || ""}
            userName={message.sender.name || ""}
            isUser={$page.data.session?.user?.id === message.userId}
            text={message.content}
            timestamp={message.timestamp}
        />
    {/each}
    <form
        class="flex fixed bottom-0 w-2/3"
        method="post"
        use:enhance={(e) => {
            const message = e.formData.get("message");
            if (typeof message === "string" && $page.data.session?.user) {
                data.messages.push({
                    id: Math.random(),
                    content: message,
                    timestamp: new Date(),
                    conversationId: $page.params.cuid,
                    userId: $page.data.session.user.id,
                    sender: {
                        id: $page.data.session.user.id,
                        name: $page.data.session.user.name || null,
                        image: $page.data.session.user.image || null,
                    },
                });
                data = data;
                setTimeout(scrollBottom, 50);
            }
        }}
    >
        <Input
            name="message"
            type="text"
            class="w-2/3 m-2"
            placeholder="Start chatting"
            required
        />
        <Button type="submit" class="my-2"
            ><PapperPlaneSolid class="rotate-45" /></Button
        >
    </form>
</main>
