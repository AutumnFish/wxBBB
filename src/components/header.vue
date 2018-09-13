<template>
  <div>
    <div class="header">
      <icon type="search" size="16"></icon>
      <input @click="toSearch" type="text" placeholder="搜索">
    </div>
  </div>
</template>

<script>
export default {
  methods:{
    toSearch(){
      // console.log('去搜索页');
      wx.navigateTo({
        // 绝对路径
        url: '/pages/search/main'
      });
    }
  }
};
</script>

<style lang="less">
page {
  padding-top: 100rpx;
}
.header {
  padding: 20rpx 16rpx;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 998;
  width: 100%;
  box-sizing: border-box;
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
</style>
