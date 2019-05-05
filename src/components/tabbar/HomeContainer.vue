<template>
  <div>
    <!-- 轮播图区域 -->
    <mt-swipe :auto="4000">
      <!-- 在组件中，使用 v-for 循环的话，一定要使用 key -->
      <mt-swipe-item v-for="item in lunbotuList" :key="item.url">
        <img :src="item.img" alt="">
      </mt-swipe-item>
    </mt-swipe>

    <h3>HomeContainer</h3>
  </div>
</template>

<script>
import { Toast } from "mint-ui"

export default {
  data() {
    return {
      lunbotuList: [] // 保存轮播图的数组
    };
  },
  created() {
    this.getLunbotu();
  },
  methods: {
    getLunbotu() {
      // 获取轮播图数据的方法
      this.$http
        .get("http://www.liulongbin.top:3005/api/getlunbo")
        .then(result => {
          // console.log(result.body);
          if (result.body.status === 0) {
            // 成功
            this.lunbotuList = result.body.message;
          } else {
            // 失败
            Toast('加载轮播图失败...');
          }
        });
    }
  }
};
</script>


<style scoped>
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
.mint-swipe-item img{
  width: 100%;
  height: 100%;
}
</style>
