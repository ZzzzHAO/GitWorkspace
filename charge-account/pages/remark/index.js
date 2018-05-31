// pages/remark/index.js
import {
  addCostRecord
} from '../../api/index'
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
    console.log(options);
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
  //输入长度监听
  remarkInput: function (e) {
    if (e.detail.value) {
      this.setData({
        charLength: e.detail.value.length,
        remark: e.detail.value
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
      wx.showToast({
        title: '记账成功！',
        mask: true
      })
      setTimeout(() => {
        // let pages = getCurrentPages();
        // let prevPage = pages[pages.length - 2]; //上一个页面（父页面）
        // prevPage.setData({
        //   amount: '', // 清空首页金额
        //   isDisabled: true //禁用首页按钮
        // })
        wx.reLaunch({
          url: '../statistics/index'
        })
      }, 1500)
    })
  }
})