<template>
  <div>
    <!-- 顶部盒子 -->
    <div class="header-box">
      <div class="me-header">
        <!-- 点击图片 登陆 wx.getUserInfo() -->
        <!-- open-type 可以十分便捷的获取用户的非私密信息 -->
        <!-- <button class="icon" open-type="getUserInfo" @getuserinfo="userInfo"> -->
        <button class="icon" open-type="getUserInfo" @click="login">
          <img :src="icon" alt="">
        </button>
        <span class="iconfont icon-shezhi"></span>
        <span class="iconfont icon-xiaoxi"></span>
        <p class="p">{{info}}</p>
      </div>
    </div>
    <!-- 底部内容 -->
    <div class="info-box">
      <!-- 顶部 -->
      <div class="item-list">
        <div class="item">
          <p class="num">0</p>
          <p class="title">收藏的店铺</p>
        </div>
        <div class="item">
          <p class="num">0</p>
          <p class="title">收藏的商品</p>
        </div>
        <div class="item">
          <p class="num">0</p>
          <p class="title">关注的商品</p>
        </div>
        <div class="item">
          <p class="num">0</p>
          <p class="title">我的足迹</p>
        </div>
      </div>
      <!-- 订单 -->
      <div class="order">
        <div class="title">我的订单</div>
        <div class="options">
          <div class="item" @click="toOrder(2)">
            <span class="iconfont icon-daifukuan"></span>
            <p class="opt-name">待付款</p>
          </div>
          <div class="item" @click="toOrder(3)">
            <span class="iconfont icon-daishouhuo"></span>
            <p class="opt-name">待收货</p>
          </div>
          <div class="item" @click="toOrder(4)">
            <span class="iconfont icon-tuikuan"></span>
            <p class="opt-name">退款/退货</p>
          </div>
          <div class="item" @click="toOrder(1)">
            <span class="iconfont icon-dingdan"></span>
            <p class="opt-name">全局订单</p>
          </div>
        </div>
      </div>
      <!-- 获取用户地址 -->
      <div class="address" @click="getAddress">
        <span class="manage">收货地址管理</span>
        <span class="iconfont icon-jiantouyou"></span>
      </div>
      <div @click="callKF" class="opt">
        <span class="manage">联系客服</span>
        <span>400-100-10086</span>
      </div>
      <!-- 扫码 -->
      <div @click="scanCode" class="opt">
        <span class="manage">意见反馈</span>
        <span class="iconfont icon-jiantouyou"></span>
      </div>
      <div class="opt">
        <span class="manage">关于我们</span>
        <span class="iconfont icon-jiantouyou"></span>
      </div>
    </div>
  </div>
</template>

<script>
// 导入自己封装的ajax模块
import tool from "../../utils/index";
export default {
  data: function() {
    return {
      icon: "/static/icon.png",
      info: "登陆/注册"
    };
  },
  methods: {
    // 进行授权 才可以让这个小程序获取你的用户信息
    /*
      用户授权 早期 如果用户拒绝了一次 就不会弹出来了
      需要把这个小程序删掉 再进入 才可以
      最早的时候 是 通过 wx.getUserInfo 来获取用户信息
    */
    userInfo(res) {
      console.log(res);
      if (res.mp.detail.errMsg != "getUserInfo:ok") {
        // 没有授权
        wx.showModal({
          title: "提示",
          content: "要授权哦",
          cancelColor: "#000000",
          confirmText: "知道啦!",
          confirmColor: "#3CC51F",
          success: res => {
            if (res.confirm) {
            }
          }
        });
      } else {
        // 授权成功
        this.icon = res.mp.detail.userInfo.avatarUrl;
        this.info = res.mp.detail.userInfo.nickName;
      }
    },
    // 获取用户收货地址
    getAddress() {
      // 获取微信中收货地址
      /*
        手机上 会弹出一个新的地址管理页面 不需要我们编写
        直接就是一个地址列表
        如果没有要的地址 点击右上角的加号 会自动跳转到新增地址页
        直到我们选中了一个地址 点击确定 才会 触发这个success
        打印的内容 就是 用户的各种地址信息
      */
      wx.chooseAddress({
        success: function(res) {
          console.log(res);
          console.log(res.userName);
          console.log(res.postalCode);
          console.log(res.provinceName);
          console.log(res.cityName);
          console.log(res.countyName);
          console.log(res.detailInfo);
          console.log(res.nationalCode);
          console.log(res.telNumber);
        }
      });
    },
    // 拨打电话
    callKF() {
      // 跳转到手机的拨号页面
      // 填入  配置的号码
      // 不要乱打电话哦!!!
      wx.makePhoneCall({ phoneNumber: "手机号" });
    },
    // 扫码
    scanCode() {
      // 调用微信的api即可
      // 可以选择图片扫码
      // 如果二维码没有任何的错误 可以识别其内部保存的信息
      /*
        绝大多数情况下 二维码中保存的信息 都是 网页地址
        微信小程序 不支持跳转去网址 不希望微信小程序引流
        微信小程序 出发点 就是单纯 用完即走
      */

      wx.scanCode({
        // onlyFromCamera: true, //是否只能从相机扫码，不允许从相册选择图片,
        success: res => {
          console.log(res);
        }
      });
    },
    // 微信第三方登陆
    login() {
      // 定义变量 保存登陆的各种信息
      let code = "";
      // userInfo中的私密信息
      let encryptedData = "";
      let iv = "";
      let rawData = "";
      let signature = "";
      // 微信登陆
      wx.login({
        success: logRes => {
          //  console.log(logRes);
          // 保存code 用户的标记
          code = logRes.code;
          // 获取用户的更为私密信息
          wx.getUserInfo({
            withCredentials: true,
            // 中文显示
            // lang: 'zh_CN',
            success: userRes => {
              console.log(userRes);
              encryptedData = userRes.encryptedData;
              iv = userRes.iv;
              rawData = userRes.rawData;
              signature = userRes.signature;

              // 保存用户信息
              this.icon = userRes.userInfo.avatarUrl;
              this.info = userRes.userInfo.nickName;

              // 调用第三方登陆
              tool
                .thenAjax({
                  url: "api/public/v1/users/wxlogin",
                  method: "post",
                  data: {
                    code,
                    encryptedData,
                    iv,
                    rawData,
                    signature
                  }
                })
                .then(myRes => {
                  // console.log(myRes);
                  // 保存 token
                  wx.setStorageSync("token", myRes.data.message.token);
                });
            }
          });
        }
      });
    },
    // 带着索引值 去订单页
    toOrder(index){
      // console.log(index);
      wx.navigateTo({
        url: '/pages/order/main?index='+index
      });
    }
  }
};
</script>

<style lang="less">
page {
  padding: 0;
}
/* 顶部盒子 */
.header-box {
  height: 420rpx;
  background-color: #ff2d4a;
  display: flex;
  justify-content: center;
  align-items: center;
  .me-header {
    position: relative;
  }
  .icon {
    width: 140rpx;
    height: 140rpx;
    border-radius: 50%;
    border: 4rpx solid white;
    padding: 0;
    image {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
  .iconfont {
    position: absolute;
    color: white;
    top: 60rpx;
    &.icon-shezhi {
      left: -80rpx;
    }
    &.icon-xiaoxi {
      right: -80rpx;
    }
  }
  .p {
    display: block;
    text-align: center;
    margin-top: 20rpx;
    color: white;
    font-size: 28rpx;
  }
}
.info-box {
  padding: 0 16rpx;
  background-color: #ccc;
  // 顶部
  > .item-list {
    transform: translateY(-30rpx);
    height: 120rpx;
    background-color: white;
    display: flex;
    align-items: center;
    .item {
      flex: 1;
      color: #666666;
      text-align: center;
      font-size: 24rpx;
      .num {
        margin-bottom: 15rpx;
      }
    }
  }
  // 订单
  .order {
    background-color: white;
    .title {
      height: 90rpx;
      border-bottom: 1rpx solid #dddddd;
      line-height: 90rpx;
      padding-left: 30rpx;
    }
    .options {
      display: flex;
      align-items: center;
      height: 166rpx;
      .item {
        flex: 1;
        text-align: center;
        .iconfont {
          color: #eb4450;
          font-size: 60rpx;
          font-weight: 700;
        }
        .opt-name {
          font-size: 28rpx;
        }
      }
    }
  }
  // 收货地址管理
  .address {
    margin: 20rpx 0;
    height: 88rpx;
    background-color: white;
    padding: 0 32rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .manage {
      font-size: 32rpx;
    }
    .iconfont {
      color: #ccc;
    }
  }
  // 下面一列选项
  .opt {
    height: 88rpx;
    background-color: white;
    padding: 0 32rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1rpx solid #ddd;
    .manage {
      font-size: 32rpx;
    }
    .iconfont {
      color: #ccc;
    }
  }
}
</style>
