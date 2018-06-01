// pages/remark/index.js
import {
  addCostRecord
} from '../../api/index'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amount: 0,
    category: 1,
    remark: '',
    charLength: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      amount: options.amount,
      category: options.category
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
  onShow: function () {},

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
  //输入长度监听
  remarkInput: function (e) {
    if (e.detail.value) {
      const val = e.detail.value.trim();
      this.setData({
        charLength: e.detail.value.length,
        remark: val
      })
    } else {
      this.setData({
        charLength: 0
      })
    }
  },
  //记录提交并跳转
  submit: function (e) {
    const costRecord = {
      amount: this.data.amount,
      category: parseInt(this.data.category),
      remark: this.data.remark
    }
    addCostRecord(costRecord, () => {
      let pages = getCurrentPages();
      let homePage = pages[pages.length - 3]; //上一个页面（父页面）
      homePage.setData({
        amount: '', // 清空首页金额
        isDisabled: true //禁用首页按钮
      })
      wx.showModal({
        content: '记账成功！',
        mask: true,
        cancelText: '再记一笔',
        confirmText: '完成',
        confirmColor: '#56abe4',
        success: function (res) {
          if (res.confirm) {
            app.globalData.goStatistics = true; //全局标记 记账完成 去统计页
            wx.navigateBack({
              delta: 2
            })
          } else if (res.cancel) {
            wx.navigateBack({
              delta: 2
            })
          }
        }
      })
    })
  }
})