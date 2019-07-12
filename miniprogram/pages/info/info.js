// pages/info/info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieinfo: [],
    value: 3, //星级
    content: '', //评价的文字,
    images:[]
  },

  onChangeValue(event) {
    this.setData({
      value: event.detail
    });
  },
  onChangeContent: function(event) {
    this.setData({
      content: event.detail
    });
  },
  // 上传图片
  uploadImg: function () {
    wx.chooseImage({
      // count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths;
        // 默认输出的图片地址为数组，而上传图片路径为字符串，需要转换
        console.log(tempFilePaths);
        wx.cloud.uploadFile({
          cloudPath: new Date().getTime() + '.png', // 上传至云端的路径
          filePath: tempFilePaths[0], // 小程序临时文件路径
          success: res => {
            // 返回文件 ID
            console.log(res.fileID)
            // 存储在数据库
            db.collection('images').add({
              data: {
                flieId: res.fileID
              }
            }).then(res => {
              // console.log(res);
              this.downImg();

            }).catch(err => {
              console.error(err);
            })
          },
          fail: console.error
        })
      }
    })
  },
  getImg: function () {
    // 获取当前用户的opneid
    wx.cloud.callFunction({
      name: 'login'
    }).then(res => {
      const openId = res.result.openid;
      // 查询当前用户上传的图片
      db.collection('images').where({
        _openid: openId
      }).get().then(res2 => {
        const flieId = res2.data[0].flieId;

        this.setData({
          images: res2.data
        })

      })
    }).catch(err => {
      console.error(err);
    })

  },
  // 下载文件
  downImg: function (event) {
    wx.cloud.downloadFile({
      fileID: event.target.dataset.flieid,//dataset相当于jq的data("flieId");
      success(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        // if (res.statusCode === 200) {
        //     filePath: res.tempFilePath//下载成功后的临时路径
        // }
        // 保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            // 成功后弹窗提醒
            wx.showToast({
              title: '保存成功',
            })
          }
        })
      }
    })
  },
  // 提交
  submit() {
    console.log(this.data.content);
    console.log(this.data.value);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    // console.log(options);
    wx.cloud.callFunction({
      name: "movieinfo",
      data: {
        movieid: options.movieid
      }
    }).then(res => {
      console.log(res);
      this.setData({
        // concat 拼接数据 this.data.movieList的数据与res.result).subjects
        movieinfo: JSON.parse(res.result)
      })
      // wx.hideLoading();
    }).catch(err => {
      console.error(err);
      // wx.hideLoading();

    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})