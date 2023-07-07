<script lang="ts">
    import { Avatar } from "flowbite-svelte";

    export let image: string;
    export let isUser: boolean;
    export let userName: string;
    export let text: string;
    export let timestamp: Date;
    $:time=new Intl.DateTimeFormat("pl-PL",{timeStyle:"short",dateStyle:"short"}).format(timestamp)
</script>

<div class="flex flex-col w-full p-4">
    <div class={isUser?"text-right":"text-left"}>{time}</div>
    <div class="flex p-2 {isUser?"flex-row-reverse":"flex-row"}">
        <Avatar class="m-2" src={image} />
        <div class="bg-primary-700 text-white rounded-lg p-4">{text}</div>
    </div>
    <div class={isUser?"text-right":"text-left"}>{userName}</div>
</div>
