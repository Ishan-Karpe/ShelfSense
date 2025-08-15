<script>
    import {SideNav} from "$components";
    let {children} = $props();
</script>

<div class='auth-area'>
    <SideNav />
    <div class='main-area'>
        {@render children()}
    </div>
</div>

<style>
    .auth-area {
        display: flex;
        overflow: hidden;
        height: 100vh;
    }
    .main-area {
        flex: 1;
        min-width: 0;
        padding: 40px 4vw 100px 40px;
        overflow-y: auto;
    }
</style>