<script lang="ts">
    import {
        Button,
        Modal,
        DarkMode,
        Navbar,
        NavBrand,
        Avatar,
        NavHamburger,
        Dropdown,
        DropdownHeader,
        DropdownItem,
        DropdownDivider,
    } from "flowbite-svelte";
    import { signIn, signOut } from "@auth/sveltekit/client";
    import { page } from "$app/stores";
    import {
        AngleDownSolid,
        UserSettingsSolid,
        GithubSolid,
    } from "flowbite-svelte-icons";
</script>

<Navbar let:toggle>
    <NavBrand href="/">Insert logo here</NavBrand>
    {#if $page.data.session}
        <div class="flex items-center">
            {#if $page.data.session.user?.image}
                <Avatar id="avatar-menu" src={$page.data.session.user?.image} />
                <AngleDownSolid class="p-1" on:click={toggle} />
            {:else}
                <p id="avatar-menu">Insert profile pic here</p>
            {/if}
            <NavHamburger on:click={toggle} />
        </div>
        <Dropdown placement="bottom" triggeredBy="#avatar-menu">
            <DropdownHeader>
                <p>{$page.data.session.user?.name}</p>
                <p>{$page.data.session.user?.email}</p>
            </DropdownHeader>
            <DropdownItem class="flex">
                <UserSettingsSolid />
                <p class="px-1">Settings</p>
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem on:click={signOut}>Sign out</DropdownItem>
        </Dropdown>
    {:else}
        <Button on:click={()=>signIn("github")}><GithubSolid /><p class="px-1"> Sign in with Github</p></Button>
    {/if}
</Navbar>
