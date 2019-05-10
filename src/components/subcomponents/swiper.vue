<template>
  <div>
    <mt-swipe :auto="4000">
      <!-- 在组件中，使用 v-for 循环的话，一定要使用 key -->
      <!-- 将来，谁使用此 轮播图组件，谁为我们传递 lunbotuList -->
      <!-- 此时，lunbotuList 应该是父组件向子组件传值来设置 -->
      <mt-swipe-item v-for="item in lunbotuList" :key="item.img">
        <img :src="item.img" alt>
      </mt-swipe-item>
    </mt-swipe>
  </div>
</template>

<script>
export default {
  props: ["lunbotuList"]
};
</script>

<style lang="scss" scoped>
.mint-swipe {
  height: 200px;
}
.mint-swipe-item:nth-child(1) {
  background-color: red;
}
.mint-swipe-item:nth-child(2) {
  background-color: blue;
}
.mint-swipe-item:nth-child(3) {
  background-color: green;
}
.mint-swipe-item img {
  width: 100%;
  height: 100%;
}
</style>
