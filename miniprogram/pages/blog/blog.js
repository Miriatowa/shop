const db=wx.cloud.database()
// 搜索的关键字
let keyword = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalShow:false,
    blogList: []
  },
  onPublish(){
    wx.getSetting({
      success:(res)=>{
        if (res.authSetting['scope.userInfo']){
          wx.getUserInfo({
            success:(res)=>{
            this.onLoginSuccess({
              detail:res.userInfo
            })
            }
          })
       }else{
         this.setData({
           modalShow:true
         })
       }
      }
    })
  },
  onLoginSuccess(e){
    const detail = e.detail
    wx.navigateTo({
      url: `../blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
    })
  },
  onLoginFail(){

  },
  onSearch(e) {
    this.setData({
      blogList: []
    })
    keyword = e.detail.keyword
    this.loadBlogList(0)
  },
  loadBlogList(start = 0) {
    wx.showLoading({
      title: '拼命加载中',
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        keyword,
        start,
        count: 10,
        $url: 'list',
      }
    }).then((res) => {
      this.setData({
        blogList: this.data.blogList.concat(res.result)
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },
  goComment(e) {
    wx.navigateTo({
      url: `../../pages/blog-comment/blog-comment?blogId=${e.target.dataset.blogid}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadBlogList()
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
  onShareAppMessage: function (e) {
    let blogObj = e.target.dataset.blog
    return {
      title: blogObj.content,
      path: `/pages/blog-comment/blog-comment?blogId=${blogObj._id}`,
    }
  }
})