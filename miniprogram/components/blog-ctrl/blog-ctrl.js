let userInfo={}
let db=wx.cloud.database()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    blogId: String,
    blog: Object,
  },
  externalClasses: ['iconfont', 'icon-pinglun', 'icon-fenxiang'],
  /**
   * 组件的初始数据
   */
  data: {
    modalShow:false,
    loginShow:false,
    content: '',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment(){
      wx.getSetting({
        success:(res)=>{
          if (res.authSetting['scope.userInfo']){
            wx.getUserInfo({
              success: (res) => {
                userInfo = res.userInfo
                // 显示评论弹出层
                this.setData({
                  modalShow: true,
                })
              }
            })
          }else{
            this.setData({
              loginShow: true,
            })
          }
        }
      })
    },
    onLoginsuccess(e){
      userInfo = e.detail
      // 授权框消失，评论框显示
      wx.cloud.callFunction({
        name: "login",
        data: {}
      }).then((res) => {
        wx.setStorage({
          key: 'openId',
          data: res.result.openId,
        })
      })
      this.setData({
        loginShow: false,
      }, () => {
        this.setData({
          modalShow: true,
        })
      })
    },
    // 提交数据
    onSend(e){
      let formId = e.detail.formId
      let content = e.detail.value.content
      if (content.trim() == '') {
        wx.showModal({
          title: '评论内容不能为空',
          content: '',
        })
        return
      }
      wx.showLoading({
        title: '评论中',
        mask: true,
      })
      db.collection('blog-comment').add({
        data: {
          content,
          createTime: db.serverDate(),
          blogId: this.properties.blogId,
          nickName: userInfo.nickName,
          avatarUrl: userInfo.avatarUrl
        }
      }).then((res)=>{
        wx.hideLoading()
        wx.showToast({
          title: '评论成功',
        })
        this.setData({
          modalShow: false,
          content: '',
        })
        // 父元素刷新评论页面
        this.triggerEvent('refreshCommentList')
      })
      // 推送模板消息
      wx.requestSubscribeMessage({
        tmplIds: ['ghEn9ZqdOH8tTeUBgvno2yo5uHlGUOuYKGx_JxvmYgM'],
        success: (res) => {
          wx.cloud.callFunction({
            name: 'sendMessage',
            data: {
              content,
              formId,
              blogId: this.properties.blogId
            }
          }).then((res) => {
            console.log(res)
          })
        }
      })
    },
  }
})
