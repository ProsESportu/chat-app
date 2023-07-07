<script lang="ts">
    import type { PageServerData } from "./$types";
    import { page } from "$app/stores";
    import { enhance } from "$app/forms";
    import { Input, Button } from "flowbite-svelte";
    import { PapperPlaneSolid } from "flowbite-svelte-icons";
    import ChatBubble from "$lib/ChatBubble.svelte";
    import { onMount } from "svelte";
    export let data: PageServerData;
    let main: HTMLElement;
    onMount(scrollBottom);

    function scrollBottom() {
        main.scrollTop = main.scrollHeight;
    }
</script>

<svelte:head>
    <title
        >{data.conv.convs.conversations
            .find((e) => e.id === $page.params.cuid)
            ?.users.reduce((r, e) => r + e.name + ",", "") || "?"}</title
    >
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
                    content: message,
                    timestamp: new Date(),
                    conversationId: $page.params.cuid,
                    userId: $page.data.session.user.id,
                    sender: {
                        email: $page.data.session.user.email || null,
                        name: $page.data.session.user.name || null,
                        image: $page.data.session.user.image || null,
                    },
                });
                data = data;
                setTimeout(scrollBottom,50)
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
