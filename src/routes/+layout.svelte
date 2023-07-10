<script lang="ts">
    import "../app.css";
    import {
        Button,
        Navbar,
        NavBrand,
        Avatar,
        NavHamburger,
        Dropdown,
        DropdownHeader,
        DropdownItem,
        DropdownDivider,
        NavUl,
        NavLi,
        DarkMode,
    } from "flowbite-svelte";
    import { signIn, signOut } from "@auth/sveltekit/client";
    import { page } from "$app/stores";
    import {
        AngleDownSolid,
        UserSettingsSolid,
        GithubSolid,
    } from "flowbite-svelte-icons";
    import logo from "$lib/images/svelte-logo.svg";
</script>

<div class="h-screen">
    <Navbar let:hidden let:toggle>
        <NavBrand href="/">
            <img src={logo} alt="logo" class="h-12" />
            <p>Insert logo here</p>
        </NavBrand>
        <div class="flex">
            <NavUl {hidden}>
                <NavLi class="py-2" href="/" active={$page.route.id === "/"}
                    >Home</NavLi
                >
                <NavLi href="/chat" active={$page.route.id?.startsWith("/chat")}
                    >Chat</NavLi
                >
            </NavUl>
            <DarkMode class="p-2 m-2" />
            {#if $page.data.session}
                <div class="flex items-center">
                    <Avatar
                        id="avatar-menu"
                        src={$page.data.session.user?.image || undefined}
                    />
                    <AngleDownSolid class="p-1" on:click={toggle} />

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
                <Button on:click={() => signIn("github")}
                    ><GithubSolid />
                    <p class="px-1">Sign in with Github</p></Button
                >
            {/if}
        </div>
    </Navbar>

    <slot />
</div>
