// pages/category/index.js
import {
  addCostRecord
} from '../../api/index'
import categoryList from '../../tools/dictionary'
//获取应用实例
const app = getApp(); //app实例
let amount = 0; //记账金额
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isVisible: false,
    categories: categoryList,
    category: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    amount = options.amount;
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
  /**
   * 用户选择消费类型
   */
  checkCategory: function (e) {
    const id = e.target.dataset.id;
    const categories = this.data.categories;
    categories.forEach(function (item) {
      if (item.id === id) {
        item.checked = true;
      } else {
        item.checked = false;
      }
    })
    this.setData({
      categories: categories, //更新categories 渲染选中效果
      category: id,
      isVisible: true
    })
  },
  //记录提交并跳转
  submit: function (e) {
    const costRecord = {
      amount: amount,
      category: this.data.category
    }
    addCostRecord(costRecord, () => {
      wx.showToast({
        title: '记账成功！',
        mask: true
      })
      setTimeout(() => {
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2]; //上一个页面（父页面）
        prevPage.setData({
          amount: '',
          isDisabled: true
        }) // 清空首页金额
        wx.redirectTo({
          url: '../statistics/index'
        })
      }, 1500)
    })
  }
})