
function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

// 抽取自己的 ajax 使用 Promise
function thenAjax(opt){
  // 返回一个 promise对象即可
  return new Promise((resolve,reject)=>{
    // 进行异步的操作
    wx.request({
      url:'https://autumnfish.cn/wx/'+opt.url,
      // url:'https://www.zhengzhicheng.cn/'+opt.url,
      data:opt.data|| {},
      header:opt.header|| {'content-type':'application/json'},
      method:opt.method|| 'GET',
      dataType:opt.dataType|| 'json',
      responseType:opt.responseType|| 'text',
      success: resolve,
      fail: reject,
      complete: ()=>{}
    });
  })
}

export default {
  formatNumber,
  formatTime,
  thenAjax
}
