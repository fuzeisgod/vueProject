<template>
  <div class="goodsinfo-container">
    <transition @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
      <div class="ball" v-show="ballFlag" ref="ball"></div>
    </transition>

    <!-- 商品轮播图区域 -->
    <div class="mui-card">
      <div class="mui-card-content">
        <div class="mui-card-content-inner">
          <swiper :lunbotuList="lunbotu" :isfull="false"></swiper>
        </div>
      </div>
    </div>

    <!-- 商品购买区域 -->
    <div class="mui-card">
      <div class="mui-card-header">{{ goodsinfo.title }}</div>
      <div class="mui-card-content">
        <div class="mui-card-content-inner">
          <p class="price">
            市场价:
            <del>￥{{ goodsinfo.market_price }}</del>&nbsp;&nbsp;销售价：
            <span class="now_price">￥{{ goodsinfo.sell_price }}</span>
          </p>
          <p>
            购买数量：
            <numbox @getcount="getSelectedCount"></numbox>
          </p>
          <p>
            <mt-button type="primary" size="small">立即购买</mt-button>
            <mt-button type="danger" size="small" @click="addToShopCar">加入购物车</mt-button>
            <!-- 分析：如何实现加入购物车时候，拿到选择的数量 -->
            <!-- 1. 经过分析发现：按钮属于 goodsinfo 页面，数字 属于 numberbox 组件 -->
            <!-- 2. 由于涉及到了父子组建的嵌套了，所以，无法直接在 goodsinfo 中获取到 选中的商品数量值 -->
            <!-- 3. 怎么解决这个问题：涉及到了子组件向父组件传值（事件调用机制） -->
            <!-- 4. 事件调用的本质：父向子传递方法，子调用这个方法，同时把数据当做参数 传递给这个方法 -->
          </p>
        </div>
      </div>
    </div>

    <!-- 商品参数区域 -->
    <div class="mui-card">
      <div class="mui-card-header">商品参数</div>
      <div class="mui-card-content">
        <div class="mui-card-content-inner">
          <p>商品货号：{{ goodsinfo.goods_no }}</p>
          <p>库存情况：{{ goodsinfo.stock_quantity }}件</p>
          <p>上架时间：{{ goodsinfo.add_time | dateFormat }}</p>
        </div>
      </div>
      <div class="mui-card-footer">
        <mt-button type="primary" size="large" plain @click="goDesc(id)">图文介绍</mt-button>
        <mt-button type="danger" size="large" plain @click="goComment(id)">商品详情</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
// 导入轮播图组件
import swiper from "../subcomponents/swiper.vue";
// 导入 数字选择框 组件
import numbox from "../subcomponents/goodsinfo_numberbox.vue";

export default {
  data() {
    return {
      id: this.$route.params.id, // 将路由参数对象中的 id 挂载到 data，方便后期调用
      lunbotu: [], // 轮播图的数据
      goodsinfo: {}, // 获取到的商品信息
      ballFlag: false, // 控制小球的隐藏和显示的标识符
      selectedCount: 1 // 保存用户选中的商品数量，默认，认为用户买1个
    };
  },
  created() {
    this.getLunbotu();
    this.getGoodsInfo();
  },
  methods: {
    getLunbotu() {
      this.$http.get("api/getthumimages/" + this.id).then(result => {
        if (result.body.status === 0) {
          // 先循环轮播图数组的每一项，为 item 添加 img 属性，因为 轮播图 组件中，只认识 item.img,不认识 item.src
          result.body.message.forEach(item => {
            item.img = item.src;
          });
          this.lunbotu = result.body.message;
        }
      });
    },
    getGoodsInfo() {
      // 获取商品的信息
      this.$http.get("api/goods/getinfo/" + this.id).then(result => {
        if (result.body.status === 0) {
          this.goodsinfo = result.body.message[0];
        }
      });
    },
    goDesc(id) {
      // 点击使用编程式导航跳转到 图文介绍页面
      this.$router.push({ name: "goodsdesc", params: { id } });
    },
    goComment(id) {
      // 点击跳转到评论页面
      this.$router.push({ name: "goodscomment", params: { id } });
    },
    addToShopCar() {
      // 添加到购物车
      this.ballFlag = !this.ballFlag;
      // {id：商品的id, count：要购买的数量, price：要购买的商品的单价, selected：false}
      // 拼接出一个，要保存到 store 中 car 数组里的 商品信息对象
      var goodsinfo = {
        id: this.id,
        count: this.selectedCount,
        price: this.goodsinfo.sell_price,
        selected: true
      };
      // 调用 store 中的 mutations 来将商品加入购物车
      this.$store.commit('addToCar', goodsinfo)
    },
    beforeEnter(el) {
      el.style.transform = "translate(0, 0)";
    },
    enter(el, done) {
      el.offsetWidth;

      // 小球动画优化思路
      // 1.先分析导致 动画 不准确的 本质原因：我们把小球最终位移到的位置，已经局限在了某一分辨率下的滚动条未滚动的情况下;
      // 2.只要分辨率和 测试的时候不一样，或者 滚动条有一定的滚动距离之后，问题就出现了；
      // 3.因此，我们经过分析，得到结论：不能把位移的横纵坐标 直接写死了，而是应该 根据不同情况，动态计算这个坐标值;
      // 4.先得到 徽标 的横纵 坐标，再得到 小球 的横纵坐标，然后 让 Y 值 求差，x 值也求差，得到的结果，就是横纵坐标要位移的距离
      // 5.如何 获取 徽标 和 小球的位置？ domObject.getBoundingClientRect()

      // 获取小球 在页面中的位置
      const ballPosition = this.$refs.ball.getBoundingClientRect();
      // 获取徽标 在页面中的位置
      const badgePosition = document
        .getElementById("badge")
        .getBoundingClientRect();

      const xDist = badgePosition.left - ballPosition.left;
      const yDist = badgePosition.top - ballPosition.top;

      el.style.transform = `translate(${xDist}px, ${yDist}px)`;
      el.style.transition = "all .5s cubic-bezier(.4,-0.3,1,.68)";
      done();
    },
    afterEnter(el) {
      this.ballFlag = !this.ballFlag;
    },
    getSelectedCount(count) {
      // 当子组件把 选中的数量传递给父组件的时候，把选中的值保存到 data 上
      this.selectedCount = count;
      console.log("父组件拿到的数量值为：" + this.selectedCount);
    }
  },
  components: {
    swiper,
    numbox
  }
};
</script>

<style lang="scss" scoped>
.goodsinfo-container {
  background-color: #eee;
  overflow: hidden;
  .now_price {
    color: red;
    font-size: 16px;
    font-weight: bold;
  }
  .mui-card-footer {
    display: block;
    button {
      margin: 15px 0;
    }
  }
  .ball {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: red;
    position: absolute;
    z-index: 11;
    top: 390px;
    left: 150px;
  }
}
</style>
