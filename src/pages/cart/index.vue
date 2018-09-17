<template>
  <div>
    <!-- 顶部地址选择 -->
    <div class="address-box">
      <div class="item">
        <div class="left">收货人:&nbsp;&nbsp;&nbsp;&nbsp;{{userName}}</div>
        <div class="right">{{userMobile}}&nbsp;&nbsp;&nbsp;&nbsp;
          <span class="iconfont icon-jiantouyou"></span>
        </div>
      </div>
      <div class="item">
        <div class="left">
          收货地址:&nbsp;&nbsp;{{userAddress}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 导入工具函数
import tool from "../../utils/index";
export default {
  // 数据
  data: function() {
    return {
      cartList: []
    };
  },
  // 加载完毕之后 去获取数据
  created() {
    // 读取缓存数据
    let cartData = wx.getStorageSync("cart");
    // 拼接为id1,id2
    let ids = "";
    for (const key in cartData) {
      // 根据拼接key即可
      ids += key;
      ids += ",";
    }
    // 截取末尾的,
    ids = ids.slice(0, -1);
    // 获取数据
    tool
      .thenAjax({
        url: `api/public/v1/goods/goodslist?goods_ids=${ids}`
      })
      .then(res => {
        // console.log(res);
        this.cartList = res.message;
      });
  }
};
</script>

<style lang="less">
page {
  padding: 0;
}
.address-box {
  height: 222rpx;
  .item {
    height: 104rpx;
    display: flex;
    padding-left: 18rpx;
    padding-right: 30rpx;
    justify-content: space-between;
    align-items: center;
    font-size: 30rpx;
    .left {
    }
    .right {
    }
  }
  // 不能使用本地图片作为  图片的背景图
  // 工作时 找ui设计师帮你做一个即可
  background-image: url("http://www.hulinghao.cn/static/img/line.jpg");
  background-size: 150rpx 14rpx;
  background-repeat: repeat-x;
  background-position-x: 0;
  background-position-y: 208rpx;
  // 底部的线
  // css3中渐变 生成的其实是 图片 不能设置给 颜色 只能设置给图片
  // 第一个颜色 默认从0开始
  // 最后一个颜色 默认到 100%
  // 自己使用线性渐变实现底部的线段
  // background-image: linear-gradient(
  //   -45deg,
  //   blue 22%,
  //   white 22% 28%,
  //   red 28% 72%,
  //   white 72% 78%,
  //   blue 78%
  // );
  // background-size: 150rpx 14rpx;
  // background-repeat: repeat-x;
  // background-position-x: 0;
  // background-position-y: 208rpx;
}
</style>
