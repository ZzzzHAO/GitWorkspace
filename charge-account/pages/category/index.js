// pages/label/label.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isVisible: false,
    amount: '',
    items: [
      { id: 1, value: '饮食' },
      { id: 2, value: '网购' },
      { id: 3, value: '线下消费' },
      { id: 4, value: '房租' },
      { id: 5, value: '水费' },
      { id: 6, value: '电费' },
      { id: 7, value: '煤气' },
      { id: 8, value: '其他' },
    ],
    category:''
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
    items.forEach(function(item){
      if(item.id === id){
        item.checked = true;
      }else{
        item.checked = false;
      }
    })
    this.setData({
      items: items,
      category: id,
      isVisible:true
    })
  },
  goNext:function(e){
    wx.reLaunch({
      url: '../statistics/index'
    })
  }
})