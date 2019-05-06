<template>
    <div>
        <h3>新闻详情 -- {{ id }}</h3>
    </div>
</template>

<script>
export default {
    data() {
        return {
            id:this.$route.params.id // 将 URL 地址中传递过来的 Id值，挂载到 data 上，方便以后调用
        }
    },
}
</script>

<style scoped>

</style>
