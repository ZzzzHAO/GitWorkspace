//index.js
import {
  wilddogLogin
} from '../../api/index'
//获取应用实例
const app = getApp(); //app实例
const reg = /^[0-9]+(.[0-9]{2})?$/; //匹配金额正则
Page({
  data: {
    amount: '',
    isDisabled: true,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.info('-----------------userInfoReadyCallback--------------------');
        this.setData({
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo;
          this.setData({
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow: function () {
    
  },
  //转发信息
  onShareAppMessage: function (res) {
    return {
      title: '快来记账吧，养成记账好习惯！',
      path: '/pages/amount/index',
      imageUrl:'../../image/schnauzer.jpg'
    }
  },
  //授权获取公共信息并且登录野狗
  auth: function (e) {
    if (e.detail.userInfo) {
      wilddogLogin((user) => {
        this.setData({
          hasUserInfo: true
        })
      })
    } else {
      wx.showModal({
        content: '获取用户信息失败，请重试',
        showCancel: false
      })
    }
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //金额输入函数
  amtInput: function (e) {
    if (e.detail.value) {
      this.setData({
        amount: e.detail.value,
        isDisabled: false
      })
    } else {
      this.setData({
        isDisabled: true
      })
    }
  },
  //页面跳转
  goNext: function (e) {
    let amt = this.data.amount;
    if (reg.test(amt)) {
      wx.navigateTo({
        url: '../category/index?amount=' + this.data.amount
      })
    } else {
      wx.showModal({
        content: '金额格式错误，请重新输入。（最多两位小数）',
        showCancel: false
      })
    }
  },
  goStatistics: function (e) {
    wx.navigateTo({
      url: '../statistics/index'
    })
  },
})