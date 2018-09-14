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
    <div class="history-box">
      <div class="control">
        <span>历史搜索</span>
        <span @click="clear" class="iconfont icon-shanchu"></span>
      </div>
      <ul class="items">
        <li v-for="(item, index) in history" :key="index" class="item">{{item}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data:function(){
    return{
      search:'',
      // 搜索历史记录
      history:[]
    }
  },
  // 初始化的时候 读取缓存 看看是否保存了数据 
  // 一次就好
  onLoad(){
    wx.getStorage({
      key: 'history',
      // success 成功
      success: res => {
        // console.log(res);
        this.history = res.data;
      },
      // 失败触发
      fail:res=>{
        console.log(res);
      }
    });
  },
  // 方法
  methods:{
    // 搜索
    submit(event){
      // 获取数据
      // 调用接口
      // 去重
      let index =this.history.indexOf(this.search);
      if(index!=-1){
        this.history.splice(index,1);
      }
      // 缓存数据
      this.history.push(this.search);
      wx.setStorage({
        key: 'history',
        data: this.history
      });
    },
    cancel(){
      // 清空
      this.search = '';
    },
    // 清空历史纪录
    clear(){
      // 数据
      this.history = [];
      // 缓存
      wx.setStorage({
        key: 'history',
        data: this.history
      });
    }
  }
};
</script>

<style lang='less'>
page{
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
    left:35rpx;
    position: absolute;
    top:40rpx;
    z-index: 998;
  }
  .input {
    flex: 1;
    font-size:26rpx;
    color:#808080;
    margin-right: 20rpx;
    background-color: white;
    padding-left: 70rpx;
    border-radius: 6rpx;
    height: 60rpx;
  }
  .button {
    width:160rpx;
    border: 1px solid #BFBFBF;
    font-size:30rpx;
    line-height: 60rpx;
    height: 60rpx;
  }
}
// 历史记录
.history-box{
  .control{
    height: 80rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size:32rpx;
    padding: 0 20rpx;
    .iconfont{
      width: 30rpx;
      height: 30rpx;
      color:#CCCCCC;
    }
  }
  .items{
    display: flex;
    flex-wrap: wrap;
    padding-left: 16rpx;
    .item{
      height: 64rpx;
      background-color: #DDDDDD;
      font-size:26rpx;
      line-height: 64rpx;
      padding: 0 20rpx;
      margin-right: 30rpx;
      margin-top: 16rpx;
    }
  }
}
</style>
