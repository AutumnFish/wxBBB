<template>
  <div>
    <!-- 搜索栏 -->
    <div class="header">
      <icon type="search" size="16"></icon>
      <input type="text" placeholder="搜索">
    </div>
    <!-- 轮播图  容器标签 可以随便写 小程序独有的功能标签 不能乱写
        indicator-dots小圆点
        autoplay 自动切换
        circular 头尾相连
     -->
    <swiper indicator-dots autoplay circular>
      <swiper-item v-for="(item, index) in swiperList" :key="item.name">
        <image mode="aspectFill" :src="item.image_src"></image>
      </swiper-item>
    </swiper>
    <!-- 分类区域
        普通的标签 可以写 html的 微信的也支持
        功能类的标签 只能写 微信的
     -->
    <ul class="cate-box">
      <li class="item" v-for="(item, index) in cateList" :key="item.name">
        <img class="img" :src="item.image_src" alt="">
        <text class="text">{{item.name}}</text>
      </li>
    </ul>
    <!-- 楼层 -->
    <div class="section" v-for="(item, index) in floorList" :key="index" >
      <div class="title">
        <text class="text" >{{item.floor_title.name}}</text>
        <img class="image" :src="item.floor_title.image_src" alt="">
      </div>
      <div class="content">
          <a class="nav" href="#" v-for="(it, i) in item.product_list" :key="i">
            <img class="image" :src="it.image_src" alt="">
          </a>
      </div>
    </div>

  </div>
</template>

<script>
// 导入模块
import tool from "../../utils/index";

export default {
  // 数据
  data: function() {
    return {
      // 轮播图数据
      swiperList: [],
      // 分类的数据
      cateList: [],
      // 楼层数据
      floorList:[]
    };
  },
  // 生命周期函数
  created() {
    // 获取轮播图数据
    tool
      .thenAjax({
        url: "api/public/v1/home/swiperdata"
      })
      // 轮播图
      .then(res => {
        // console.log(res);
        // 绑定数据
        this.swiperList = res.data.message;
        // 返回一个 thenAjax
        return tool.thenAjax({
          url: "api/public/v1/home/catitems"
        });
      })
      // 分类
      .then(res => {
        console.log(res);
        this.cateList = res.data.message;
        // 返回 楼层数据
        return tool.thenAjax({
          url:"api/public/v1/home/floordata"
        })
      })
      .then(res=>{
        // console.log(res);
        this.floorList = res.data.message;
      })
  }
};
</script>

<style lang='less'>
.header {
  padding: 20rpx 16rpx;
  position: relative;
  background-color: #ff2d4a;
  icon {
    position: absolute;
    top: 34rpx;
    left: 50%;
    transform: translateX(-200%);
    z-index: 998;
  }
  input {
    height: 60rpx;
    border-radius: 10rpx;
    background-color: white;
    width: 100%;
    color: #bbb;
    text-align: center;
    font-size: 24rpx;
  }
}
// 轮播图
swiper {
  height: 384rpx;
  swiper-item {
    image {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}
// 分类选项
.cate-box {
  padding-top: 24rpx;
  padding-bottom: 30rpx;
  display: flex;
  .item {
    flex: 1;
    .img {
      width: 100rpx;
      height: 100rpx;
      display: block;
      margin: 0 auto 20rpx;
    }
    .text{
      display: block;
      text-align: center;
      font-size:24rpx;
    }
  }
}
// 楼层数据
.section{
  .title{
    position: relative;
    .text{
      position: absolute;
      color:#FF7B94;
      font-weight: 700;
      font-size:50rpx;
      left:20rpx;
      top:10rpx;
    }
    .image{
      height:85rpx ;
      width:100%;
    }
  }
  .content{
    padding: 20rpx 16rpx;
    height: 440rpx;
    .nav{
      display: block;
      float: left;
      width:33.333%;
      height: 100%;
      padding: 5rpx;
      box-sizing: border-box;
    }
    .image{
      display: block;
      width: 100%;
      height: 100%;
    }
    // 只要不是第一个 nav
    .nav:not(:first-child){
      height: 50%;
    }
  }
}
</style>
