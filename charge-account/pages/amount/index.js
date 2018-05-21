//index.js
import {
  wilddog
} from '../../wilddog'
import{
  wilddogLogin
} from '../../utils/util'
//获取应用实例
const app = getApp()

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
        this.setData({
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            hasUserInfo: true
          })
        }
      })
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
        content: '获取用户信息失败，请重试(001)',
        showCancel:false
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
    if (e.detail.value > 0) {
      this.setData({
        amount: e.detail.value,
        isDisabled: false
      })
    }
  },
  //页面跳转
  goNext: function (e) {
    wx.navigateTo({
      url: '../category/index?amount=' + this.data.amount
    })
  },
  goStatistics: function (e) {
    wx.navigateTo({
      url: '../statistics/index'
    })
  },
})