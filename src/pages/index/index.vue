<template>
  <div>
    <div class="header">
      <!-- 搜索栏 -->
      <icon type="search" size="16"></icon>
      <input type="text" placeholder="搜索">
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang='less'>
  .header{
    padding: 20rpx 16rpx;
    position: relative;
    background-color: #FF2D4A;
    icon{
      position: absolute;
      top:34rpx;
      left:50%;
      transform: translateX(-200%);
      z-index: 998;
    }
    input{
      height: 60rpx;
      border-radius: 10rpx;
      background-color: white;
      width:100%;
      color:#bbb;
      text-align: center;
      font-size:24rpx;
    }
  }
</style>
