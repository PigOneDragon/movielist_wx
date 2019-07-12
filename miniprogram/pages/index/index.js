// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // movie数据容器
    movieList:[]
  },

  // 评价跳转
  gotoComment:function(event){
    wx.navigateTo({
      url: `../info/info?movieid=${event.target.dataset.movieid}`
    })

  },

// 调用数据
getMovieData:function(){
  wx.showLoading({
    title: '加载中',
  })
  // 加载完毕调用接口引入数据
  wx.cloud.callFunction({
    name: "movielist",
    data: {
      statr: this.data.movieList.length,
      count: 10
    }
  }).then(res => {
    // console.log(res);
    this.setData({
      // concat 拼接数据 this.data.movieList的数据与res.result).subjects
      movieList: this.data.movieList.concat(JSON.parse(res.result).subjects)
    }),
    wx.hideLoading();
  }).catch(err => {
    console.error(err);
    wx.hideLoading();

  })
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getMovieData();
    
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

    this.getMovieData();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})