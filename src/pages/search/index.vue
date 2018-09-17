<template>
  <div>
    <!-- 顶部的搜索框 -->
    <div class="search-box">
      <icon type="search" class="search" size="20">
      </icon>
      <input class="input" v-model="search" @confirm="submit" type="text" placeholder="请输入你想要的商品">
      <input class="button" type="button" @click="cancel" value="清空">
    </div>
    <!-- 历史记录 -->
    <div v-show="goods.length==0" class="history-box">
      <div class="control">
        <span>历史搜索</span>
        <span @click="clear" class="iconfont icon-shanchu"></span>
      </div>
      <ul class="items">
        <li @longpress="delOne(index)" @click="searchItem(item)" v-for="(item, index) in history" :key="index" class="item">{{item}}</li>
      </ul>
    </div>
    <!-- 结果盒子 -->
    <div class="result-box" v-show="goods.length!=0">
      <!-- 顶部的筛选功能 -->
      <div class="filter">
        <div @click="changeFilter(0)" class="item" :class="{active:filterIndex==0}">综合</div>
        <div @click="changeFilter(1)" class="item" :class="{active:filterIndex==1}">销量</div>
        <div @click="changeFilter(2)" class="item" :class="{active:filterIndex==2}">价格
          <div class="arrow-box">
            <span class="iconfont icon-jiantoushang" :class="{active:orderPrice==true}"></span>
            <span class="iconfont icon-jiantouxia" :class="{active:orderPrice==false}"></span>
          </div>
        </div>
      </div>
      <!-- 列表 -->
      <ul class="items">
        <!-- 循环计算属性 -->
        <li class="item" v-for="(item, index) in orderArr" :key="index">
          <div class="left">
            <img class="image" :src="item.goods_small_logo" alt="">
          </div>
          <div class="right">
            <div class="title">{{item.goods_name}}</div>
            <div class="price">¥
              <span class="money">{{item.goods_price}}</span>.00</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
// 导入工具函数
import tool from "../../utils/index";
export default {
  data: function() {
    return {
      search: "",
      // 搜索历史记录
      history: [],
      // 用来保存原始的数组
      defaultGoods: [],
      // 搜索结果用来进行排序的数组
      goods: [],
      // 筛选条件
      filterIndex: 0,
      // 价格排序的方式 正序 还是 倒序
      // true 正序
      // false 倒序
      orderPrice: true
    };
  },
  // 初始化的时候 读取缓存 看看是否保存了数据
  // 一次就好
  onLoad() {
    wx.getStorage({
      key: "history",
      // success 成功
      success: res => {
        // console.log(res);
        this.history = res.data;
      },
      // 失败触发
      fail: res => {
        console.log(res);
      }
    });
  },
  // 方法
  methods: {
    // 抽取的 查询数据函数
    getData() {
      // 调用接口 获取数据
      // 提示用户
      wx.showLoading({
        title: "加载中",
        mask: true
      });
      tool
        .thenAjax({
          url: `api/public/v1/goods/search?query=${this.search}`
        })
        .then(res => {
          // console.log(res);
          // 保存到data中
          this.goods = res.data.message.goods;
          // 保存一份原始值 这个数组 不在修改
          // 因为两个数组 都是复杂类型保存的其实是地址
          // 修改了 goods 之后 defaultGoods 跟着一起变
          // this.defaultGoods = res.data.message.goods;
          // 基本类型 数字 字符串 布尔
          this.defaultGoods = res.data.message.goods.concat([]);
          // 关闭load
          wx.hideLoading();
        });
    },
    // 搜索
    submit(event) {
      // 获取数据
      // 调用接口
      // 去重
      let index = this.history.indexOf(this.search);
      if (index != -1) {
        this.history.splice(index, 1);
      }
      // 缓存数据
      this.history.push(this.search);
      // 长度判断
      if (this.history.length > 10) {
        // 删除第一个
        this.history.shift();
        // this.history.splice(0,1);
      }
      wx.setStorage({
        key: "history",
        data: this.history
      });
      // 调用查询数据
      this.getData();
    },
    // 取消
    cancel() {
      // 清空
      this.search = "";
      // 清空搜索的 数据
      this.goods = [];
      this.defaultGoods = [];
    },
    // 清空历史纪录
    clear() {
      // 提示用户
      wx.showModal({
        title: "友情提示", //提示的标题,
        content: "是否清空", //提示的内容,
        showCancel: true, //是否显示取消按钮,
        cancelText: "取消", //取消按钮的文字，默认为取消，最多 4 个字符,
        cancelColor: "#f0f", //取消按钮的文字颜色,
        confirmText: "确定", //确定按钮的文字，默认为取消，最多 4 个字符,
        confirmColor: "#0094ff", //确定按钮的文字颜色,
        success: res => {
          // console.log(res);
          if (res.confirm) {
            console.log("用户点击确定");
            // 数据
            this.history = [];
            // 缓存
            wx.setStorage({
              key: "history",
              data: this.history
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });

      // 提示用户 弹出一个列表
      // wx.showActionSheet({
      //   itemList: ['你好','吃了','没','要不','我先吃'], //按钮的文字数组，数组长度最大为6个,
      //   itemColor: '#000000', //按钮的文字颜色,
      //   success: res => {}
      // });
    },
    // 长按删除一个
    delOne(index) {
      // console.log(index);
      // this.history.splice(index,1);
      wx.showModal({
        title: "提示", //提示的标题,
        content: "干掉他?", //提示的内容,
        showCancel: true, //是否显示取消按钮,
        cancelText: "取消", //取消按钮的文字，默认为取消，最多 4 个字符,
        cancelColor: "#000000", //取消按钮的文字颜色,
        confirmText: "确定", //确定按钮的文字，默认为取消，最多 4 个字符,
        confirmColor: "#3CC51F", //确定按钮的文字颜色,
        success: res => {
          if (res.confirm) {
            console.log("用户点击确定");
            this.history.splice(index, 1);
            // 数据常驻
            wx.setStorage({
              key: "history",
              data: this.history
            });
          } else if (res.cancel) {
            console.log("用户点击取消");
          }
        }
      });
      // 数据常驻
    },
    // 切换筛选条件
    changeFilter(index) {
      // 排序的依据
      this.filterIndex = index;
      // 如果是 价格排序
      this.orderPrice = !this.orderPrice;
    },
    // 搜索
    searchItem(item) {
      // console.log(item);
      // 设置搜索内容
      this.search = item;
      // 查询数据
      this.getData();
    }
  },
  // 计算属性
  computed: {
    orderArr() {
      // 根据 filterIndex进行排序即可
      // 如果filterIndex == 0 无需排序 直接默认即可
      if (this.filterIndex == 0) {
        // 直接返回
        // return this.goods;
        // 返回原始值
        return this.defaultGoods;
      } else if (this.filterIndex == 1) {
        // 如果是按照销量排序
        // 因为没有销量 按照 goods_id排序
        // sort 会循环数组 吧 每一个元素 挨个丢到 a,b中
        // a b 就是数组的每一个元素
        this.goods.sort((a, b) => {
          // console.log(a);
          // console.log(b);
          return a.goods_id - b.goods_id;
        });
        return this.goods;
      } else if (this.filterIndex == 2) {
        // 按照价格排序
        // 正序 倒序
        this.goods.sort((a, b) => {
          if (this.orderPrice == true) {
            return a.goods_price - b.goods_price;
          } else {
            return b.goods_price - a.goods_price;
          }
        });
        return this.goods;
      }
    }
  }
};
</script>

<style lang='less'>
page {
  padding-top: 0;
}
.search-box {
  position: relative;
  height: 120rpx;
  background-color: #eeeeee;
  display: flex;
  padding: 0 16rpx;
  align-items: center;
  .search {
    left: 35rpx;
    position: absolute;
    top: 40rpx;
    z-index: 998;
  }
  .input {
    flex: 1;
    font-size: 26rpx;
    color: #808080;
    margin-right: 20rpx;
    background-color: white;
    padding-left: 70rpx;
    border-radius: 6rpx;
    height: 60rpx;
  }
  .button {
    width: 160rpx;
    border: 1px solid #bfbfbf;
    font-size: 30rpx;
    line-height: 60rpx;
    height: 60rpx;
  }
}
// 历史记录
.history-box {
  .control {
    height: 80rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 32rpx;
    padding: 0 20rpx;
    .iconfont {
      width: 30rpx;
      height: 30rpx;
      color: #cccccc;
    }
  }
  .items {
    display: flex;
    flex-wrap: wrap;
    padding-left: 16rpx;
    .item {
      height: 64rpx;
      background-color: #dddddd;
      font-size: 26rpx;
      line-height: 64rpx;
      padding: 0 20rpx;
      margin-right: 30rpx;
      margin-top: 16rpx;
    }
  }
}
// 搜索结果盒子
.result-box {
  .filter {
    height: 100rpx;
    border-bottom: 1rpx solid #ccc;
    display: flex;
    align-items: center;
    .item {
      flex: 1;
      font-size: 28rpx;
      text-align: center;
      // 高亮的样式
      &.active {
        color: #ff2d4a;
      }
    }
    .item:last-child {
      display: flex;
      align-items: center;
      justify-content: center;
      .arrow-box {
        .iconfont {
          font-size: 26rpx;
          font-weight: 700;
          display: block;
          color: black;
          &.active {
            color: hotpink;
            text-shadow: 0 0 20rpx hotpink;
          }
        }
      }
    }
  }
  // 列表区域
  .items {
    padding-left: 20rpx;
    box-sizing: border-box;
    .item {
      display: flex;
      height: 260rpx;
      border-bottom: 1rpx solid #ddd;
      padding: 30rpx 0;
      .left {
        .image {
          width: 200rpx;
          height: 200rpx;
          display: block;
        }
      }
      .right {
        margin-left: 25rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .title {
          font-size: 32rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
        .price {
          color: #eb4450;
          font-size: 22rpx;
          .money {
            font-size: 36rpx;
          }
        }
      }
    }
  }
}
</style>
