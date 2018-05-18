import {
  wilddog
} from '../wilddog'
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//获取月份列表
const getMonthList = (beginDate, endDate) => {
  const monthList = [];
  const endY = endDate.getFullYear();
  const endM = endDate.getMonth() + 1;
  const endD = endDate.getDate();
  const beginY = beginDate.getFullYear();
  const beginM = beginDate.getMonth() + 1;
  const beginD = beginDate.getDate();
  for (let i = beginY; i <= endY; i++) {
    //开始年份和当年年份相同 直接从开始月份到当前月份
    if (beginY === endY) {
      for (let m = beginM; m <= endM; m++) {
        let monthObj = {
          year: i,
          month: m
        }
        monthList.push(monthObj);
      }
    } else {
      //循环变量年份和开始年份相同
      if (i === beginY) {
        for (let j = beginM; j <= 12; j++) {
          let monthObj = {
            year: i,
            month: j
          }
          monthList.push(monthObj);
        }
      }
      //循环变量年份即和开始年份不相同 又和当前年份不相同
      if (i !== beginY && i !== endY) {
        for (let k = 1; k <= 12; k++) {
          let monthObj = {
            year: i,
            month: k
          }
          monthList.push(monthObj);
        }
      }
      //循环变量年份和当前年份年份不相同
      if (i === endY) {
        for (let l = 1; l <= endM; l++) {
          let monthObj = {
            year: i,
            month: l
          }
          monthList.push(monthObj);
        }
      }
    }
  }
  return monthList;
}
//获取服务器时间戳
const getServerTime = (callback = function () {}) => {
  var serverTsRef = wilddog.sync().ref("/.info/serverTimeOffset");
  serverTsRef.once('value', function (snapshot) {
    // 获取时钟偏差
    var offset = snapshot.val();
    // 可进一步计算出云端时间
    var serverTime = (new Date).getTime() + offset;
    callback(serverTime)
  })
}

//野狗登录
const wilddogLogin = (callback = function () {}) => {
  wx.showLoading({
    title: '请稍候...',
    mask: true
  });
  wilddog.auth().signInWeapp(function (err, user) {
    if (user) {
      wx.hideLoading();
      //登录后获取用户数据
      _getUserData(user);
      //执行回调
      callback(user);
    } else {
      wx.hideLoading();
      wx.showToast({
        title: '网络不给力，请重试(501)'
      })
    }
  })
}
//获取用户数据
const _getUserData = (user) => {
  const app = getApp();
  const ref = wilddog.sync().ref('users/' + user.uid);
  if (!app.globalData.userInfo) {
    //用户数据存入全局变量
    app.globalData.userInfo = user;
  }
  ref.on('value', (snapshot) => {
    const data = snapshot.val() || {};
    app.globalData.userData = data;
    console.log(data);
  })
}
//设置用户数据
const setUserData = (key, value, callback = function () {}) => {
  const app = getApp();
  const uid = app.globalData.userInfo.uid;
  if (uid) {
    const ref = wilddog.sync().ref('users/' + uid + '/' + key);
    ref.set(value, function (error) {
      if (error === null) {
        callback()
      } else {
        wx.showToast({
          title: '系统错误，请重试（001）',
          mask: true
        })
      }
    })
  } else {
    //重新登录野狗 获取user
    wilddogLogin()
    wx.showToast({
      title: '系统错误，请重试（002）',
      mask: true
    })
  }
}

module.exports = {
  formatTime: formatTime,
  getMonthList: getMonthList,
  getServerTime: getServerTime,
  wilddogLogin: wilddogLogin,
  setUserData: setUserData
}