<script lang="ts">
    import type { LayoutServerData } from "./$types";
    import {
        Avatar,
        Listgroup,
        ListgroupItem,
        Search,
        Button,
        Dropdown,
        DropdownItem,
    } from "flowbite-svelte";
    import { SearchOutline } from "flowbite-svelte-icons";
    import { page } from "$app/stores";
    export let data: LayoutServerData;
    let query: string;
    let result:
        | undefined
        | { id: string; name: string; image: string; email: string }[];
    interface Ires {
        id: string;
        users: { image: string; name: string }[];
    }
    const hClick = async (e: string) => {
        const res: Ires = await fetch("/chat", {
            body: e,
            method: "POST",
        }).then((f) => f.json());
        data.convs?.conversations.push({
            id: res.id,
            users: res.users,
        });
        data = data;
    };
</script>

<div class="flex h-5/6">
    <Listgroup active class="w-1/3 ml-2"
        ><form
            class="flex m-1 items-center"
            on:submit|preventDefault={async () => {
                result = await fetch(`/chat?data=${query}`).then((f) =>
                    f.json()
                );
            }}
        >
            <Search
                bind:value={query}
                class="py-2"
                size="lg"
                placeholder="Search for other users"
            />
            <Button type="submit" class="mx-1"><SearchOutline /></Button>
        </form>
        {#if result && Object.keys(result || {}).length}
            <Dropdown open={true}>
                {#each result as item}
                    <DropdownItem class="flex" on:click={() => hClick(item.id)}>
                        <Avatar src={item.image} />
                        <div class="flex flex-col p-2">
                            <p>{item.name}</p>
                            <p>{item.email}</p>
                        </div>
                    </DropdownItem>
                {/each}
            </Dropdown>
        {/if}
        {#if data.convs?.conversations}
            {#each data.convs?.conversations as item}
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
        {/if}
    </Listgroup>
    <slot />
</div>
