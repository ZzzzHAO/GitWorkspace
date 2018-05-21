// pages/category/index.js
import {
  wilddog
} from '../../wilddog'

import {
  getServerTime,
  setUserData,
  getUserData
} from '../../utils/util'
import categoryList from '../../utils/dictionary'
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isVisible: false,
    amount: '',
    items: categoryList,
    category: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      amount: options.amount
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 用户选择消费类型
   */
  check: function (e) {
    const id = e.target.dataset.id;
    const items = this.data.items;
    items.forEach(function (item) {
      if (item.id === id) {
        item.checked = true;
      } else {
        item.checked = false;
      }
    })
    this.setData({
      items: items,
      category: id,
      isVisible: true
    })
  },
  //记录提交并跳转
  goNext: function (e) {
    getUserData((userData) => {
      getServerTime((serverTime) => {
        const date = new Date(serverTime);
        const startTime = userData.startTime;
        const costList = userData.costList || [];
        if (!startTime) {
          setUserData('startTime', serverTime);
        }
        costList.push({
          amount: this.data.amount,
          category: this.data.category,
          timeStamp: serverTime,
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          date: date.getDate()
        })
        setUserData('costList', costList, () => {
          wx.reLaunch({
            url: '../statistics/index'
          })
        });
      });
    })
  }
})