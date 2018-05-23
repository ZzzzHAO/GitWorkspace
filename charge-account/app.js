//app.js
import {
  wilddog
} from './lib/wilddog'
import {
  wilddogLogin
} from './api/index'
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              //野狗登录
              wilddogLogin();

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    //重写Number toFixed方法 修复精度问题
    Number.prototype.toFixed = function (n) {
      var power = Math.pow(10, n);
      var fixed = (Math.round(this * power) / power).toString();
      if (n == 0) return fixed;
      if (fixed.indexOf('.') < 0) fixed += '.';
      var padding = n + 1 - (fixed.length - fixed.indexOf('.'));
      for (var i = 0; i < padding; i++) fixed += '0';
      return fixed;
    };
  },
  globalData: {
    userInfo: null, //用户信息
    selectedMonthData: [] //缓存选中月份记账记录
  }
})