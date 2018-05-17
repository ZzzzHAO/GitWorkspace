//index.js
import {
  wilddog
} from '../../wilddog'
//获取应用实例
const app = getApp()

Page({
  data: {
    amount: '',
    isDisabled: true
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {

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
    if (e.detail.userInfo) {
      wx.showLoading();
      this.wilddogLogin(()=> {
        wx.hideLoading();
        wx.navigateTo({
          url: '../category/index?amount=' + this.data.amount
        })
      })
    } else {
      wx.showModal({
        title: '获取用户信息失败，请重试(001)'
      })
    }
  },
  goStatistics: function (e) {
    wx.navigateTo({
      url: '../statistics/index'
    })
  },
  wilddogLogin: function (callback) {
    wilddog.auth().signInWeapp(function (err, user) {
      if (user) {
        app.globalData.userInfo = user; //全局缓存用户信息
        callback();
      } else {
        wx.hideLoading();
        wx.showModal({
          title: '获取用户信息失败，请重试(002)'
        })
      }
    })
  }
})