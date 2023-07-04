<script lang="ts">
    import type { LayoutServerData } from "./$types";
    import {
        Avatar,
        Listgroup,
        ListgroupItem,
        Search,
        Chevron,
        Button,
    } from "flowbite-svelte";
    import { SearchSolid } from "flowbite-svelte-icons";
    import { page } from "$app/stores";
    export let data: LayoutServerData;
</script>

<div class="flex">
    <Listgroup active class="w-1/3 ml-2"
        ><form class="flex m-1">
            <Search class="py-3" />
            <Button class="mx-1"><SearchSolid /></Button>
        </form>
        {#each data.convs.conversations as item}
            <ListgroupItem
                current={$page.params.cuid === item.id}
                href={`/chat/${item.id}`}
                class="flex"
            >
                {#each item.users as img}
                    <Avatar src={img.image || undefined} class="mx-2" />
                {/each}
                {#each item.users as name}
                    {name.name},
                {/each}
            </ListgroupItem>
        {/each}
    </Listgroup>
    <slot />
</div>
