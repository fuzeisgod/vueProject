// 入口文件
import Vue from 'vue'
// 1.1 导入路由的包
import VueRouter from 'vue-router'
// 1.2 安装路由
Vue.use(VueRouter)

// 注册 Vuex
import Vuex from 'vuex'
Vue.use(Vuex)
// 每次刚进入网站，肯定会调用 main.js ,在刚调用的时候，先从本地存储中，把购物车的数据读出来，放到 store 中
var car = JSON.parse(localStorage.getItem('car') || '[]')
var store = new Vuex.Store({
    state: { // this.$store.state.xxx
        car: car // 将购物车中的商品的数据，用一个数组存储起来，在 car 数组中，存储一些商品的对象，咱们可以暂时将商品对象，设计成这个样子 
        // {id：商品的id, count：要购买的数量, price：要购买的商品的单价, selected：false}
    },
    mutations: { // this.$store.commit('方法名称')
        addToCar(state, goodsinfo) {
            // 点击加入购物车，把商品信息，保存到 store 中的 car 上
            // 分析：
            // 1.如果购物车中，之前就已经有这个对应的商品了，那么，只需要更新数量
            // 2.如果没有，则直接把商品数据，push 到 car 中即可
            // 假设 在购物车中，没有找到对应的商品
            var flag = false

            // some() 为数组中的每一个元素执行一次 callback 函数，直到找到一个使得 callback 返回一个“真值”（即可转换为布尔值 true 的值）
            state.car.some(item => {
                if (item.id == goodsinfo.id) {
                    item.count += parseInt(goodsinfo.count)
                    flag = true
                    return true
                }
            })

            // 如果最终，循环完毕，得到的 flag 还是 false，则把商品数据直接 push 到购物车
            if (!flag) {
                state.car.push(goodsinfo)
            }

            // 当更新 car 之后，把 car 数组，存储到本地的 localStorage 中
            localStorage.setItem('car', JSON.stringify(state.car))
        }
    },
    getters: { // this.$store.getters.***
        // 相当于计算属性，也相当于 filters
        getAllCount(state) {
            var sum = 0
            state.car.forEach(item => {
                sum += item.count
            })
            return sum
        }
    }
})


// 导入格式化时间的插件
import moment from 'moment'
// 定义全局的过滤器
Vue.filter('dateFormat', function (dataStr, pattern = "YYYY-MM-DD HH:mm:ss") {
    return moment(dataStr).format(pattern)
})

// 2.1 导入 vue-resource
import VueResource from 'vue-resource'
// 2.2 安装 vue-resource
Vue.use(VueResource)
// 设置请求的根路径
Vue.http.options.root = 'http://www.liulongbin.top:3005'
// 全局设置 post 时候表单数据格式组织形式
Vue.http.options.emulateJSON = true


// 导入 MUI 的样式
import './lib/mui/css/mui.min.css'
import './lib/mui/css/icons-extra.css'


// 按需导入 Mint-UI 中的组件
// import { Header, Swipe, SwipeItem, Button, Lazyload } from 'mint-ui'
// Vue.component(Header.name, Header)
// Vue.component(Swipe.name, Swipe)
// Vue.component(SwipeItem.name, SwipeItem)
// Vue.component(Button.name, Button)
// Vue.use(Lazyload)
import MintUI from 'mint-ui'
Vue.use(MintUI)
import 'mint-ui/lib/style.css'


// 安装 图片预览插件
import VuePreview from 'vue-preview'
Vue.use(VuePreview)


// 1.3 导入自己的 router.js 路由模块
import router from './router.js'


// 导入 App 跟组件
import app from './App.vue'


var vm = new Vue({
    el: '#app',
    render: c => c(app),
    router, // 1.4 挂载路由对象到 VM 实例上
    store // 挂载 store 状态管理对象
})