<template>
  <div>
    <!-- 顶部滑动条区域 -->
    <div id="slider" class="mui-slider">
      <div
        id="sliderSegmentedControl"
        class="mui-scroll-wrapper mui-slider-indicator mui-segmented-control mui-segmented-control-inverted"
      >
        <div class="mui-scroll">
          <a
            :class="['mui-control-item', item.id == 0 ? 'mui-active':'']"
            v-for="item in cates"
            :key="item.id" @click="getPhotoListByCateId(item.id)"
          >{{ item.title }}</a>
        </div>
      </div>
    </div>

    <!-- 图片列表区域 -->
    <ul>
      <li v-for="item in list" :key="item.id">
        <img v-lazy="item.img_url">
      </li>
    </ul>
  </div>
</template>

<script>
// 1.导入 mui 的js文件
// import mui from "../../lib/mui/js/mui.js";

export default {
  data() {
    return {
      cates: [], // 所有分类的列表数组
      list: [] // 图片列表的数组
    };
  },
  created() {
    this.getAllCategory();
    // 默认进入页面，就主动请求所有图片列表的数据
    this.getPhotoListByCateId(0);
  },
  mounted() {
    // 当组件中的 DOM 结构被渲染好并放到页面中后，会执行这个 钩子 函数
    // 如果要操作元素了，再好在 mounted 里面，因为，这时候的 DOM 元素 是最新的
    // 2.初始化滑动控件
    // mui(".mui-scroll-wrapper").scroll({
    //   deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    // });
  },
  methods: {
    getAllCategory() {
      // 获取所有的图片分类
      this.$http.get("api/getimgcategory").then(result => {
        if (result.body.status === 0) {
          result.body.message.unshift({ title: "全部", id: 0 });
          this.cates = result.body.message;
        }
      });
    },
    getPhotoListByCateId(cateId) {
      // 根据 分类Id，获取图片列表
      this.$http.get("api/getimages/" + cateId).then(result => {
        if (result.body.status === 0) {
          this.list = result.body.message;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  touch-action: pan-y;
}
img[lazy="loading"] {
  width: 40px;
  height: 300px;
  margin: auto;
}
</style>
