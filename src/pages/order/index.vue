<template>
  <div class="root">
    <!-- tabbar -->
    <div class="tab-bar">
      <div class="item" :class="{active:index==1}" @click="changeTab(1)">全部</div>
      <div class="item" :class="{active:index==2}" @click="changeTab(2)">待付款</div>
      <div class="item" :class="{active:index==3}" @click="changeTab(3)">已付款</div>
      <div class="item" :class="{active:index==4}" @click="changeTab(4)">退款/退货</div>
    </div>
    <!-- tabcontent -->
    <div class="tab-content">
      <div class="item" v-show="index==1">
        <ul class="order-list" v-if="orderList.length!=0">
          <li class="item" v-for="(item, index) in orderList" :key="item.order_id">
            <div v-for="(it, i) in item.goods" :key="it.id" class="top">
              <img class="pic" :src="it.goods_small_logo" alt="">
              <div class="right">
                <div class="title">{{it.goods_name}}</div>
                <div class="right-bottom">
                  <div class="price">¥
                    <span class="price-num">{{it.goods_price}}</span>.00</div>
                  <div class="num">x{{it.goods_number}}</div>
                </div>
              </div>
            </div>
            <div class="middle">
              <div class="info">共件{{item.total_count}}商品 总计:¥{{item.total_price}}(含运费0.00)</div>
            </div>
            <div class="bottom">
              <div class="bottom-left">
                订单号: {{item.order_number}}
              </div>
              <button class="bottom-right">支付</button>
            </div>
          </li>
        </ul>
      </div>
      <!-- 待付款 -->
      <div class="item" v-show="index==2">
        <ul class="order-list" v-if="noPayList.length!=0">
          <li class="item" v-for="(item, index) in noPayList" :key="item.order_id">
            <div v-for="(it, i) in item.goods" :key="it.id" class="top">
              <img class="pic" :src="it.goods_small_logo" alt="">
              <div class="right">
                <div class="title">{{it.goods_name}}</div>
                <div class="right-bottom">
                  <div class="price">¥
                    <span class="price-num">{{it.goods_price}}</span>.00</div>
                  <div class="num">x{{it.goods_number}}</div>
                </div>
              </div>
            </div>
            <div class="middle">
              <div class="info">共件{{item.total_count}}商品 总计:¥{{item.total_price}}(含运费0.00)</div>
            </div>
            <div class="bottom">
              <div class="bottom-left">
                订单号: {{item.order_number}}
              </div>
              <button @click="payMoney(item.order_number)" class="bottom-right">支付</button>
            </div>
          </li>
        </ul>
      </div>
      <!-- 已付款 -->
      <div class="item" v-show="index==3">
        <ul class="order-list" v-if="orderList.length!=0">
          <li class="item" v-for="(item, index) in yiPayList" :key="item.order_id">
            <div v-for="(it, i) in item.goods" :key="it.id" class="top">
              <img class="pic" :src="it.goods_small_logo" alt="">
              <div class="right">
                <div class="title">{{it.goods_name}}</div>
                <div class="right-bottom">
                  <div class="price">¥
                    <span class="price-num">{{it.goods_price}}</span>.00</div>
                  <div class="num">x{{it.goods_number}}</div>
                </div>
              </div>
            </div>
            <div class="middle">
              <div class="info">共件{{item.total_count}}商品 总计:¥{{item.total_price}}(含运费0.00)</div>
            </div>
            <div class="bottom">
              <div class="bottom-left">
                订单号: {{item.order_number}}
              </div>
              <button class="bottom-right">查看</button>
            </div>
          </li>
        </ul>
      </div>
      <div class="item" v-show="index==4">4</div>
    </div>
  </div>
</template>
<script>
// 引入工具函数
import tool from "../../utils/index";
export default {
  data: function() {
    return {
      // tab索引
      index: 1,
      // token
      token: "",
      // 绑定 订单数据
      // 所有订单
      orderList: [],
      // 未支付订单,
      noPayList: [],
      // 已支付订单
      yiPayList: []
    };
  },
  onLoad(options) {
    // 从缓存中获取token
    let token = wx.getStorageSync("token");
    // 如果没有 token
    if (token) {
      this.index = options.index;
      // 保存 token
      this.token = token;
      // 进来的时候 选中的是哪一页 就要那一页
      this.getOrderData();
    } else {
      wx.showModal({
        title: "提示", //提示的标题,
        content: "(づ￣3￣)づ╭❤～,先登录", //提示的内容,
        showCancel: true, //是否显示取消按钮,
        cancelText: "确定", //取消按钮的文字，默认为取消，最多 4 个字符,
        cancelColor: "#000000", //取消按钮的文字颜色,
        confirmText: "我确定", //确定按钮的文字，默认为取消，最多 4 个字符,
        confirmColor: "#3CC51F", //确定按钮的文字颜色,
        success: res => {
          // if (res.confirm) {
          //   console.log('用户点击确定')
          // } else if (res.cancel) {
          //   console.log('用户点击取消')
          // }
          wx.navigateBack({
            delta: 1
          });
        }
      });
    }
  },
  // 事件
  methods: {
    // tab切换
    changeTab(index) {
      this.index = index;
      // 数据清空
      this.orderList = [];
      // 重新获取 订单数据
      this.getOrderData();
    },
    // tab对应数据获取
    // 因为接口问题 获取 已付款 以及退货 退款 没有订单信息
    // 只有 全部 跟待付款有信息
    // 只渲染前两个页面即可
    getOrderData() {
      tool
        .thenAjax({
          url: "api/public/v1/my/orders/all?type=" + this.index,
          header: {
            Authorization: this.token
          }
        })
        .then(res => {
          // 所有订单
          this.orderList = res.data.message.orders;
          // 挨个的验证 订单是否支付
          // 需要等到 10次请求 全部完成 才可以 让用户点击
          let finishNum = 0;
          wx.showLoading({
            title: "Loading...", //提示的内容,
            mask: true, //显示透明蒙层，防止触摸穿透,
            success: res => {}
          });
          console.log(res.data.message.orders.length);
          for (let i = 0; i < res.data.message.orders.length; i++) {
            tool
              .thenAjax({
                url: "api/public/v1/my/orders/chkOrder",
                data: {
                  order_number: res.data.message.orders[i].order_number
                },
                header: {
                  Authorization: this.token
                },
                method: "post"
              })
              .then(res => {
                // console.log(res);
                // console.log('查询到了支付数据')
                // console.log(i);
                if (res.data.meta.status == 200) {
                  // 已支付
                  // 放到 已支付的订单中
                  this.yiPayList.push(this.orderList[i]);
                } else {
                  // 未支付
                  // 放到 未支付的订单中
                  this.noPayList.push(this.orderList[i]);
                }
                finishNum++;
                if (finishNum == this.orderList.length) {
                  wx.hideLoading();
                }
              });
          }
        });
    },
    // 发起微信支付
    payMoney(order_number) {
      // console.log(order_number);
      tool
        .thenAjax({
          url: "api/public/v1/my/orders/req_unifiedorder",
          data: {
            order_number
          },
          header: {
            Authorization: this.token
          },
          method: "post"
        })
        .then(res => {
          // console.log(res);
          // 调用微信的 支付 api  发起支付即可
          wx.requestPayment({
            timeStamp: res.data.message.wxorder.timeStamp, //时间戳从1970年1月1日00:00:00至今的秒数,即当前的时间,
            nonceStr: res.data.message.wxorder.nonceStr, //随机字符串，长度为32个字符以下,
            package: res.data.message.wxorder.package, //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*,
            signType: res.data.message.wxorder.signType, //签名算法，暂支持 MD5,
            paySign: res.data.message.wxorder.paySign, //签名,具体签名方案参见小程序支付接口文档,
            success: res => {
              // console.log(res);
              // 订单已经支付成功
              // 重新获取订单数据
              wx.showToast({
                title: "恭喜",
                icon: "success",
                duration: 1500,
                mask: false
              });
              this.getOrderData();
            },
            fail: () => {},
            complete: () => {}
          });
        });
    }
  }
};
</script>
<style lang="less">
page {
  padding-top: 100rpx;
}
.root {
  min-height: 600rpx;
}
.tab-bar {
  height: 100rpx;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: white;
  z-index: 998;
  display: flex;
  align-items: center;
  box-shadow: 0 -10rpx 69rpx gray;
  .item {
    flex: 1;
    text-align: center;
    font-size: 26rpx;
    height: 100%;
    line-height: 100rpx;
    &.active {
      color: #eb4450;
      border-bottom: 12rpx solid #eb4450;
    }
  }
}
// 内容区域
/*
  css预处理的权重问题
  一直嵌套 权重很高 生成的css 很长一溜
  有的时候 会把一些嵌套关系 稍微挪一下
*/
.tab-content {
  .order-list {
    background-color: gray;
    .item {
      margin-top: 30rpx;
      background-color: white;
      padding-left: 24rpx;
      .top {
        height: 260rpx;
        display: flex;
        .pic {
          width: 210rpx;
          height: 210rpx;
        }
        .right {
          flex: 1;
          margin-left: 25rpx;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 30rpx 0;
          .title {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            font-size: 34rpx;
          }
          .right-bottom {
            display: flex;
            justify-content: space-between;
            // flex-end 底部  flex-start
            align-items: flex-end;
            .price {
              color: #eb4450;
              font-size: 24rpx;
              .price-num {
                font-size: 38rpx;
              }
            }
            .num {
              font-size: 22rpx;
            }
          }
        }
      }
      .middle {
        border-top: 1rpx solid gray;
        border-bottom: 1rpx solid gray;
        height: 88rpx;
        text-align: right;
        .info {
          color: gray;
          font-size: 24rpx;
          line-height: 88rpx;
          padding-right: 30rpx;
        }
      }
      .bottom {
        display: flex;
        justify-content: space-between;
        height: 88rpx;
        align-items: center;
        padding-right: 30rpx;
        .bottom-left {
          color: gray;
          font-size: 24rpx;
        }
        .bottom-right {
          width: 156rpx;
          height: 56rpx;
          background-color: white;
          color: #eb4450;
          font-size: 24rpx;
          line-height: 56rpx;
          margin: 0;
          padding: 0;
        }
      }
    }
  }
}
</style>


