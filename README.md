# 这是一个 NB 的项目!

## 用(传统方式)命令行把修改过后的代码上传到码云:
1. git add .
2. git commit -m "提交信息"
3. git push

## 制作首页App组件
1. 完成 Header 区域，使用的是 Mint-UI 中的 Header 组件
2. 制作底部的 Tabbar 区域，使用的是 MUI 的 Tabbar.html
    + 在制作 购物车 小图标的时候，操作会相对多一些:
    + 先把扩展图标的 css 样式，拷贝到项目中
    + 拷贝 扩展字体库 ttf 文件，到项目中
    + 为购物车小图标，添加 如下样式 'mui-icon mui-icon-extra mui-icon-extra-cart'
3. 要在中间区域放置一个 router-view 来展示路由匹配到的组件

## 改造 tabbar 为 router-link

## 设置路由高亮

## 点击 tabbar 中的路由链接，展示对应的路由组件

## 制作首页轮播图布局

## 加载首页轮播图数据
1. 获取数据，如何获取呢，使用 vue-resource
2. 使用 vue-resource 的 this.$http.get 获取数据
3. 获取到的数据，要保存到 this.data 身上
4. 使用 v-for 循环渲染每个 item 项

## 改造九宫格 区域的样式

## 改造 新闻咨询 路由链接

## 新闻咨询 页面制作
1. 绘制界面，使用 MUI 中的 media-list.html
2. 使用 vue-resource 获取数据
3. 渲染真实数据

## 实现 新闻资讯列表 点击跳转到新闻详情
1. 把列表中的每一项改造为 router-link，同时，在跳转到时候应该提供唯一的ID标识符
2. 创建新闻详情的组件页面 NewsInfo.vue
3. 在 路由模块中，将新闻详情的 路由地址 和 组件页面 对应起来

## 实现 新闻详情 的 页面布局 

## 单独封装一个 comment.vue 评论子组件
1. 先创建一个单独的 comment.vue 组件模板
2. 在需要使用 comment 组件的页面中，先手动导入 comment 组件
    + `import comment from './comment.vue'`
3. 在父组件中，使用 `components` 属性，将刚才导入 comment 组件，注册为自己的子组件
4. 将注册子组件时候的，注册名称，以标签形式，在页面中 引用即可

## 获取所有的评论数据显示到页面中
1. getComments

## 实现点击加载更多评论的功能
1. 为加载更多按钮，绑定点击事件，在事件中，请求下一页数据
2. 点击加载更多，让 pageIndex++,然后重新调用 this.getComments() 方法重新获取最新一页的数据
3. 为了防止新数据覆盖老数据的情况，我么在点击加载更多的时候，每当获取到新数据，应该让老数据调用数组的 concat 方法，拼接上新数组

## 发表评论
1. 把文本框做双向数据绑定
2. 为发表按钮绑定一个事件
3. 校验评论内容是否为空，如果为空，则Toast提示用户 评论内容不能为空
4. 通过 vue-resource 发送一个请求，把评论内容提交给服务器
5. 当发表评论OK后，重新刷新列表，以查看最新的评论
    + 如果调用 getComments 方法重新刷新评论列表的话，可能只能得到最后一页的评论，前几页的评论获取不到
    + 换一种思路，当评论成功后，在客户端，手动拼接出一个 最新的评论对象，然后，调用数组的 unshift 方法，把最新的评论，追加到 data 中 comments 的开头；这样，就能完美实现刷新评论列表的需求

## 改造图片分享按钮为路由的链接并显示对应的组件页面 

## 绘制 图片列表 组件页面结构并美化样式
1. 制作 顶部的滑动条
2. 制作 底部的图片列表
### 制作顶部滑动条的坑:
1. 需要借助于 MUI 中的 tab-top-webview-main.html
2. 需要把 slider 区域的 mui-fullscreen 类去掉
3. 滑动条无法被正常触发滑动，通过检查官方文档发现，发现这是 JS 组件，需要初始化一下
    + 导入 mui.js
    + 调用官方提供的 方式 去初始化:
    ```
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005 // flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值 0.0006
    })
    ```
4. 我们在初始化 滑动条 的时候，导入的 mui.js,但是，控制台报错:
    + mui.js 中用到了'caller','callee',and 'arguments'东西，但是，webpack 打包好的 bundle.js 中，默认是启用严格模式的，所以，这两者冲突了;
    + 解决方案：1.把 mui.js 中的 非严格 模式的代码改掉，但是不现实;2.把 webpack 打包时候的严格模式禁用掉;
    + 最终，我们选择了 plan B 移除严格模式：使用这个插件 babel-plugin-transform-remove-strict-mode