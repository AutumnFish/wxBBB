<template>
  <div>
    <!-- 顶部轮播图 -->
    <swiper class="swiper" indicator-dots autoplay circular>
      <block v-for="(item, index) in goodsInfo.pics" :key="item.pics_id">
        <swiper-item @click="previewImg(index)">
          <image mode="aspectFill" :src="item.pics_mid"></image>
        </swiper-item>
      </block>
    </swiper>
    <!-- 价格 跟简略介绍 -->
    <div class="goods_info">
      <div class="price">¥{{goodsInfo.goods_price}}</div>
      <div class="info">
        <div class="left">{{goodsInfo.goods_name}}</div>
        <div class="right">
          <span class="iconfont icon-shoucang"></span>
          <span class="text">收藏</span>
        </div>
      </div>
    </div>
    <!-- 运费 -->
    <div class="express-price">
      快递:&nbsp;&nbsp;&nbsp;&nbsp;免运费
    </div>
    <div class="bottom">
      <!-- 商品 促销 选项-->
      <div class="option">
        <div class="item">
          促销
          <span class="red">满1000减999</span>
        </div>
        <div class="item">
          已选
          <span class="gray">绿色/XS/1件</span>
        </div>
      </div>
      <!-- 地址选择 -->
      <div class="option" @click="chooseAddress">
        <div class="item">
          送至
          <span class="address gray">{{address}}
            <span class="iconfont icon-jiantouyou"></span>
          </span>
        </div>
      </div>
      <!-- tab栏切换 -->
      <!-- tab 头 -->
      <div class="tab-bar">
        <div class="item" :class="{active:tabIndex==0}" @click="changeTab(0)">图文介绍</div>
        <div class="item" :class="{active:tabIndex==1}" @click="changeTab(1)">规格参数</div>
      </div>
      <!-- tab content -->
      <div class="tab-content">
        <!-- 详情 -->
        <div class="item" v-show="tabIndex==0">
          <!-- 使用框架的标签 -->
          <wxParse :content="goodsInfo.goods_introduce" @preview="preview" @navigate="navigate" />
        </div>
        <!-- 产品属性 参数 -->
        <div class="item" v-show="tabIndex==1">
          <div v-for="(item, index) in goodsInfo.attrs" :key="item.goods_id" class="row">
            <div class="col">{{item.attr_name}}</div>
            <div class="col">{{item.attr_value}}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部的固定定位 -->
    <div class="control-box">
      <div class="call-kf">
        <span class='iconfont icon-kefu'></span>
        联系客服
      </div>
      <div @click="toCart" class="to-cart">
        <span class='iconfont icon-gouwuche'></span>
        购物车
      </div>
      <button @click="addCart">加入购物车</button>
      <button>立即购买</button>
    </div>
  </div>
</template>

<script>
// 自己的工具函数
import tool from "../../utils/index";
// 引入wxParse解析html
import wxParse from "mpvue-wxparse";

export default {
  // 组件注册
  components: {
    wxParse
  },
  data: function() {
    return {
      goods_id: 0,
      // 商品详情
      goodsInfo: {},
      // 收货地址 省市区
      address: "",
      // 选中哪一个tab
      tabIndex: 0
    };
  },
  onLoad(options) {
    console.log(options);
    this.goods_id = options.goods_id;
    // 调用接口获取数据
    tool
      .thenAjax({
        url: `api/public/v1/goods/detail?goods_id=${this.goods_id}`
      })
      .then(res => {
        // console.log(res);
        this.goodsInfo = res.data.message;
      });
  },
  // 事件
  methods: {
    // 定义打开预览图片 并且接受索引值
    previewImg(index) {
      // 给的是一个图片地址数组 默认的数据中没有 我们自行准备一个
      let picUrls = [];
      this.goodsInfo.pics.forEach(v => {
        picUrls.push(v.pics_big_url);
      });
      wx.previewImage({
        urls: picUrls, //需要预览的图片链接列表,
        current: picUrls[index] // 默认显示的图片 根据索引获取即可
      });
    },
    // 选择地址
    chooseAddress() {
      // 选择地址
      wx.chooseAddress({
        success: res => {
          // console.log(res.userName);
          // console.log(res.postalCode);
          // console.log(res.provinceName);
          // console.log(res.cityName);
          // console.log(res.countyName);
          // console.log(res.detailInfo);
          // console.log(res.nationalCode);
          // console.log(res.telNumber);
          this.address =
            res.provinceName + " " + res.cityName + " " + res.countyName;
        }
      });
    },
    // tab栏切换
    changeTab(index) {
      this.tabIndex = index;
    },
    // wxparse的方法
    preview(src, e) {
      // do something
      console.log(src, e);
    },
    navigate(href, e) {
      // do something
      console.log(href, e);
    },
    // 加入购物车
    addCart(){
      let cartData = wx.getStorageSync('cart');
      // console.log(cartData);
      // 操纵数据
      if(cartData){
        // console.log('有值');
        // 已经添加了这个商品
        if(cartData[this.goods_id]){
          // console.log('已经添加');
          // 累加数量
          cartData[this.goods_id] +=1;
        }else{
          // console.log('还没添加');
          // 直接赋值为1即可
          cartData[this.goods_id] = 1;
        }
        // 还没添加这个商品
      }else{
        // console.log('没值');
        // cartData = {
        //   // 默认属性名 无论些什么 都会直接解析为 属性名{ goods_id:}
        //   // 加上中括号的目的是 把这个变量(表达式解析了)把值放在那个位置
        //   [this.goods_id]:1
        // }

        // 跟上面的逻辑是一样的
        cartData = {}
        cartData[this.goods_id] = 1;
      }
      // 如果缓存中有购物车数据 修改
      // 如果缓存中没有购物车数据 直接新增
      /*
        id:数量
        缓存起来
      */ 
     // 缓存起来
     wx.setStorageSync('cart', cartData);
    },
    // 去购物车
    toCart(){
      console.log('购物车');
      // 代码跳转
      // 购物车页面是由tabbar管理维护的
      // 这种页面的跳转方式不是 navigateTo
      // switchTab即可
      // wx.navigateTo({
      //   url: '/pages/cart/main'
      // });
      wx.switchTab({
        url: '/pages/cart/main'
      });
    }
  }
};
</script>

<style lang="less">
// 引入样式
@import url("~mpvue-wxparse/src/wxParse.css");
page {
  padding: 0 0 100rpx;
}
// 轮播图
.swiper {
  height: 720rpx;
  swiper-item {
    image {
      display: block;
      height: 100%;
      width: 100%;
    }
  }
}
// 商品简单介绍
.goods_info {
  padding: 0 20rpx;
  .price {
    padding: 50rpx 0 45rpx;
    color: #eb4450;
    font-size: 50rpx;
  }
  .info {
    display: flex;
    justify-content: space-between;
    .left {
      font-size: 34rpx;
      width: 520rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    .right {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 142rpx;
      border-left: 1rpx solid #ccc;
      .iconfont {
        display: block;
        color: gray;
      }
      .text {
        display: block;
        color: gray;
        font-size: 26rpx;
      }
    }
  }
}
// 底部的商品购买 控制布局
.control-box {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: white;
  .iconfont {
    display: block;
    color: gray;
    font-size: 30rpx;
    margin-bottom: 10rpx;
  }

  > view {
    flex: 1;
    text-align: center;
    font-size: 24rpx;
    color: gray;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .call-kf {
  }
  .to-cart {
  }
  button {
    width: 210rpx;
    height: 100rpx;
    color: white;
    text-align: center;
    line-height: 100rpx;
    font-size: 28rpx;
    border-radius: 0;
    // 必须是 第一个子元素才会命中
    // &:first-child{
    // 第一个 这种按钮
    &:first-of-type {
      background-color: #f4b73f;
    }
    &:last-child {
      background-color: #eb4450;
    }
  }
}
// 运费
.express-price {
  padding-left: 20rpx;
  color: #9f9f9f;
  margin-top: 40rpx;
  font-size: 28rpx;
}
.bottom {
  background-color: yellowgreen;
  padding-top: 20rpx;
}
// 商品 促销选项
.option {
  margin-bottom: 20rpx;
  .item {
    line-height: 100rpx;
    height: 100rpx;
    background-color: white;
    padding-left: 20rpx;
    font-size: 28rpx;
    .red {
      color: #ff2d4a;
      padding-left: 40rpx;
    }
    .gray {
      color: gray;
      padding-left: 40rpx;
    }
  }
}
// tab区域
.tab-bar {
  height: 100rpx;
  display: flex;
  background-color: white;
  .item {
    flex: 1;
    text-align: center;
    line-height: 100rpx;
    font-size: 26rpx;
    &.active {
      color: #ff2d4a;
      border-bottom: 10rpx solid #ff2d4a;
    }
  }
}
.tab-content {
  background-color: white;
  .item {
    padding: 6rpx 7rpx;
    view {
      margin: 0;
    }
    image {
      display: block;
    }
    // 行跟列
    .row {
      display: flex;
      .col {
        flex: 1;
        height: 84rpx;
        border: 1rpx solid #cdcdcd;
        font-size:22rpx;
        text-align: center;
        line-height: 84rpx;
        &:last-child{
          margin-left: -1rpx;
        }
      }
      // not选择器(取反)
      // .row 不是 第一个的话 往上挪1个rpx
      &:not(:first-child){
        margin-top: -1rpx;
      }
    }
  }
}
</style>
