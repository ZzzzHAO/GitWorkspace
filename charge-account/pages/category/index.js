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
    isVisible: false, //btn显隐控制标志位
    categoryList: categoryList, //消费类别List
    category: '', //已选消费类别
    amount: 0 //记账金额
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
  //转发信息
  onShareAppMessage: function (res) {
    return {
      title: '快来记账吧，养成记账好习惯！',
      path: '/pages/amount/index',
      imageUrl: '../../image/schnauzer.jpg'
    }
  },
  /**
   * 用户选择消费类型
   */
  checkCategory: function (e) {
    const id = e.target.dataset.id;
    const categories = this.data.categoryList;
    categories.forEach(function (item) {
      if (item.id === id) {
        item.checked = true;
      } else {
        item.checked = false;
      }
    })
    this.setData({
      categoryList: categories, //更新categories 渲染选中效果
      category: id,
      isVisible: true
    })
  },
  //记录提交并跳转
  submit: function (e) {
    const costRecord = {
      amount: this.data.amount,
      category: this.data.category
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
  },
  goRemark: function () {
    wx.navigateTo({
      url: '../remark/index?amount=' + this.data.amount + '&category=' + this.data.category
    })
  }
})