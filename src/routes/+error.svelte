<script>
    import { page } from "$app/stores";
    import { Alert } from "flowbite-svelte";
</script>
<Alert color="red">{$page.error?.message}</Alert>
