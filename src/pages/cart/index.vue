<template>
  <div>
    <!-- 顶部地址选择 -->
    <div class="address-box">
      <div class="item" @click="chooseAddress">
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
    <!-- 选购的商品列表 -->
    <div class="list-box">
      <div class="title">
        <span class="iconfont icon-dianpu"></span>
        优购生活馆
      </div>
      <!-- 商品列表 -->
      <ul class="items">
        <li class='item' v-for="(item, index) in cartList" :key="item.goods_id">
          <div class="left">
            <!-- 
              v-model 绑定的是 表单元素的 value属性
              如果是原生的html没有问题
              这里是 微信小程序的标签 v-model 用不了

             -->
            <!-- <input color="#EB4450" type="radio" class="radio" v-model="item.selected"> -->
            <input color="#EB4450" type="radio" class="radio" :checked="item.selected" @click="changeChecked(index)">
          </div>
          <div class="right">
            <img class="img" :src="item.goods_small_logo" alt="">
            <div class="right-content">
              <div class="right-title">{{item.goods_name}}</div>
              <div class="control">
                <span class="price">¥
                  <span class="price-num">{{item.goods_price}}</span>.00
                </span>
                <div class="num-control">
                  <span @click="sub(index)" class="sub btn">-</span>
                  <span class="buy-num">{{item.buyCount}}</span>
                  <span @click="add(index)" class="add btn">+</span>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!-- 底部的结算区域 -->
    <div class="pay-box">
      <input type="radio" @click="checkAll" :checked="isCheckAll" color="#EB4450" class="check-all">
      <span class='info'>全选</span>
      <div class="price-box">
        <div class="top">
          合计:
          <span class="span">¥
            <span class="price">{{totalPrice}}</span>.00</span>
        </div>
        <div class="bottom">
          包含运费
        </div>
      </div>
      <button @click="payOrder" class="button">结算({{totalCount}})</button>
    </div>
    <!-- 第三方的提示框
        变为1 还继续去递减
     -->
    <toast message="哥们,别点啦,没有啦" :visible.sync="visible" :img="img"></toast>
    <!-- 没有登陆 提示 -->
    <toast message="O(∩_∩)O 登录先!" :visible.sync="loginVisible" icon-class="iconfont icon-xiao"></toast>
  </div>
</template>

<script>
// 导入工具函数
import tool from "../../utils/index";
// 导入 第三方的弹框组件
import toast from "mpvue-toast";
// 引入图片
import img from "../../../static/wb.jpg";
export default {
  // 数据
  data: function() {
    return {
      cartList: [],
      // 用户名
      userName: "",
      // 手机号
      userMobile: "",
      // 地址
      userAddress: "",
      // 是否被全选
      isCheckAll: true,
      // 控制弹框是否显示
      visible: false,
      // 提示图片
      img,
      // 控制登陆弹框是否出现
      loginVisible: false
    };
  },
  // 注册自定义组件
  components: {
    toast
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
        console.log(res);
        // this.cartList = res.data.message;
        // 缺少购买数量 是否被勾选
        res.data.message.forEach(v => {
          // 默认全部选中
          v.selected = true;
          // 购买数量
          v.buyCount = cartData[v.goods_id];
        });
        // 修改好了数据
        this.cartList = res.data.message;
      });
  },
  // 微信原生的生命周期函数
  onLoad() {
    // 读取数据
    let addressData = wx.getStorageSync("address");
    if (addressData) {
      this.userName = addressData.userName;
      this.userAddress = addressData.userAddress;
      this.userMobile = addressData.userMobile;
    }
    // 有数据直接赋值
  },
  // 方法
  methods: {
    // 选择地址
    chooseAddress() {
      wx.chooseAddress({
        success: res => {
          // console.log(res.userName);
          this.userName = res.userName;
          // console.log(res.postalCode);l,k
          // console.log(res.provinceName);
          // console.log(res.cityName);
          // console.log(res.countyName);
          this.userAddress =
            res.provinceName + " " + res.cityName + "" + res.countyName;
          // console.log(res.detailInfo);
          // console.log(res.nationalCode);
          // console.log(res.telNumber);
          this.userMobile = res.telNumber;

          // 保存用户地址 到缓存中
          wx.setStorage({
            key: "address",
            data: {
              userName: this.userName,
              userAddress: this.userAddress,
              userMobile: this.userMobile
            }
          });
        }
      });
    },
    // 修改选中状态
    changeChecked(index) {
      // 修改对应的 selected取反
      this.cartList[index].selected = !this.cartList[index].selected;
      // 判断是否全部选中 总个数 跟选中个数是否一致
      // vue的todoList
      // 可读性差 逼格高
      // this.isCheckAll = this.cartList.length==this.cartList.filter(v=>{
      //   // 当前这个元素是否要 取决于返回的 值
      //   // true 要
      //   // false 不要
      //   return v.selected;
      // }).length;
      let totalNum = this.cartList.length;
      let checkedNum = this.cartList.filter(v => {
        if (v.selected == true) {
          return true;
        } else {
          return false;
        }
      }).length;

      // 把布尔比较的结果 赋值给 isCheckAll
      // this.isCheckAll = totalNum == checkedNum;
      if (totalNum == checkedNum) {
        this.isCheckAll = true;
      } else {
        this.isCheckAll = false;
      }
    },
    // 全选反选
    checkAll() {
      // 点击时 isCheckAll取反
      this.isCheckAll = !this.isCheckAll;
      // 所有的元素的 选中状态 都跟isCheckAll
      this.cartList.forEach(v => {
        v.selected = this.isCheckAll;
      });
    },
    // 增加 递减个数
    sub(index) {
      // 如果为1 再减 0
      if (this.cartList[index].buyCount != 1) {
        this.cartList[index].buyCount--;
      } else {
        // 不能设置自定义图标 弃用
        // wx.showToast({
        //   title: "别点啦!!",
        //   icon: "success",
        //   duration: 1500,
        //   mask: false
        // });
        // 支持自定义图标的
        this.visible = !this.visible;
      }
      // 同步数据
      let cartData = wx.getStorageSync("cart");
      // 修改 id对应的那个商品的数据
      let goods_id = this.cartList[index].goods_id;
      cartData[goods_id] = this.cartList[index].buyCount;
      // 保存数据
      wx.setStorageSync("cart", cartData);
    },
    add(index) {
      this.cartList[index].buyCount++;
      // 同步数据
      let cartData = wx.getStorageSync("cart");
      // 修改 id对应的那个商品的数据
      let goods_id = this.cartList[index].goods_id;
      cartData[goods_id] = this.cartList[index].buyCount;
      // 保存数据
      wx.setStorageSync("cart", cartData);
    },
    // 支付订单
    payOrder() {
      // 验证是否登陆 storage中的 token来判断
      let token = wx.getStorageSync("token");
      if (!token) {
        // 没有登陆 先登录
        this.loginVisible = !this.loginVisible;
      } else {
        // 已经登陆
        // 准备提交的数据
        let order_price = this.totalPrice;
        let consignee_addr = this.userAddress;
        // 空数组
        let goods = [];
        this.cartList.forEach(v => {
          if (v.selected == true) {
            goods.push({
              goods_id: v.goods_id,
              goods_number: v.buyCount,
              goods_price: v.goods_price
            });
          }
        });
        // 提交订单即可
        let order_number = "";
        tool
          .thenAjax({
            url: "api/public/v1/my/orders/create",
            method: "post",
            data: {
              order_price,
              consignee_addr,
              goods
            },
            header: {
              Authorization: token
            }
          })
          .then(res => {
            // console.log(res);
            order_number = res.data.message.order_number;
            // 订单创建成功之后 就可以发起支付了
            return tool.thenAjax({
              url: "api/public/v1/my/orders/req_unifiedorder",
              data: {
                order_number
              },
              method: "post",
              header: {
                Authorization: token
              }
            });
          })
          .then(res => {
            // 获取发起支付返回的 各种支付信息
            console.log(res);
            // 这些是我们发起支付 需要传递给 微信平台的各项信息
            // 接下来 直接调用 微信的 支付api即可
            wx.requestPayment({
              timeStamp: res.data.message.wxorder.timeStamp, //时间戳从1970年1月1日00:00:00至今的秒数,即当前的时间,
              nonceStr: res.data.message.wxorder.nonceStr, //随机字符串，长度为32个字符以下,
              package: res.data.message.wxorder.package, //统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=*,
              signType: res.data.message.wxorder.signType, //签名算法，暂支持 MD5,
              paySign: res.data.message.wxorder.paySign, //签名,具体签名方案参见小程序支付接口文档,
              success: res => {
                console.log(res);
                // 根据提示信息 判断是否支付成功
              },
              fail: () => {},
              complete: () => {}
            });
          });
      }
    }
  },
  // 计算属性
  computed: {
    // 总价格
    totalPrice() {
      // 被选中的 价格*购买数量 即可
      let price = 0;
      this.cartList.forEach(v => {
        if (v.selected == true) {
          price += v.goods_price * v.buyCount;
        }
      });
      return price;
    },
    // 总数
    totalCount() {
      let count = 0;
      this.cartList.forEach(v => {
        if (v.selected == true) {
          count += v.buyCount;
        }
      });
      // 返回总个数
      return count;
    }
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
  // 如果可以使用本地图片 那么很容易就把2m空间用满了
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
// 购物车数据列表
.list-box {
  padding-top: 20rpx;
  background-color: yellowgreen;
  .title {
    height: 88rpx;
    border-bottom: 1rpx solid gray;
    line-height: 88rpx;
    padding-left: 32rpx;
    background-color: white;
    font-size: 32rpx;
    .iconfont {
    }
  }
}
// 购物车每一个商品的布局
.items {
  background-color: white;
  .item {
    height: 208rpx;
    display: flex;
    align-items: center;
    .left {
      width: 90rpx;
      text-align: center;
    }
    .right {
      flex: 1;
      // padding-top: 24rpx;
      // padding-bottom: 24rpx;
      padding-right: 20rpx;
      border-bottom: 1rpx solid gray;
      display: flex;
      align-items: center;
      overflow: hidden;
      height: 208rpx;
      .img {
        width: 160rpx;
        height: 160rpx;
      }
      .right-content {
        flex: 1;
        margin-left: 24rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 208rpx;
        .right-title {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          font-size: 32rpx;
        }
        .control {
          display: flex;
          justify-content: space-around;
          .price {
            color: #eb4450;
            font-size: 24rpx;
            .price-num {
              font-size: 32rpx;
            }
          }
          .num-control {
            .btn {
              display: inline-block;
              width: 52rpx;
              height: 42rpx;
              text-align: center;
              line-height: 42rpx;
              border: 1rpx solid #000;
              box-sizing: border-box;
            }
            .add {
            }
            .buy-num {
              display: inline-block;
              font-size: 22rpx;
              text-align: center;
              width: 80rpx;
              height: 42rpx;
            }
          }
        }
      }
    }
  }
}
// 底部的付款
.pay-box {
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: white;
  height: 98rpx;
  display: flex;
  align-items: center;
  padding-left: 25rpx;
  justify-content: space-between;
  width: 100%;
  .radio {
    // margin: 0 25rpx;
  }
  .info {
    font-size: 26rpx;
  }
  .price-box {
    display: flex;
    flex-direction: column;
    .top {
      font-size: 26rpx;
      .span {
        color: #eb4450;
        font-size: 22rpx;
        .price {
          font-soze: 26rpx;
        }
      }
    }
    .bottom {
      color: #ccc;
      font-size: 22rpx;
    }
  }
  .button {
    width: 230rpx;
    height: 100%;
    border-radius: 0;
    background-color: #eb4450;
    color: white;
    margin: 0;
  }
}
// 弹框中图片的样式
.toast-wrapper {
  .toast-img-wrapper {
    .toast-img {
      width: 320rpx;
      height: 320rpx;
    }
  }
}
// 弹框提示
.toast-icon.iconfont.icon-xiao {
  color: hotpink;
  text-shadow: 0 0 100rpx skyblue;
  // 实际开发中 不建议用 太暴力了 行内样式都盖不住
  // font-size:400rpx !important;
  font-size: 400rpx;
  font-weight: 700;
}
</style>
