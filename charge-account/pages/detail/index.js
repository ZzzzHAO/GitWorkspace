// pages/detail/index.js

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    costList: [],
    srollHeight:'600'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success:  (res) =>{
        var height = res.screenHeight;
        this.setData({
          srollHeight: height
        });
      }
    })
    this.setData({
      costList: app.globalData.selectedMonthData
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 默认每个选项都是关闭状态
    this.data.costList.forEach(todoItem => {
      todoItem.isOpen = false
    });
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
  handleSliderLeftStart: function (e) {
    console.log('开始左滑', e.target.dataset.index)
    this.data.costList.forEach(todoItem => {
      // 除了当前项，其它打开项的菜单都关闭，确保每次只有一个项可以左滑显示删除
      if (todoItem.index !== e.target.dataset.index && todoItem.isOpen) {
        todoItem.isOpen = false
      }
    });
    this.setData({
      costList: this.data.costList
    })
  },
  handleChange: function (isOpen) {
    console.log('显示/关闭了菜单:', isOpen);
  },

  handleDelete: function (e) {
    console.log('点击删除了', e)
    let list = this.data.costList;
    let index = e.target.dataset.index;
    list.splice(index, 1);
    this.setData({
      costList: list
    })
  },
})