let order=[]
let openId=""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    currentType: "0JbCURxphZwbpgjLAaHimcLlcY19SNRT30HgdZ0B3KQ5S20r",
    showCart: false,
    sumNum: 0,
    sumMon: 0,
    noOrder: true,
    menu: [],
    goods:[],
    shoppinggoods:[],
    loginShow: false,
    num:0
  },
  onLoginsuccess() {
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
      if (this.data.noOrder) return false;
      const detailArray = [];
      const jsonC = this.data.goods;
      for (let i = 2; i < jsonC.length; i++) {
        for (let j in jsonC[i].data) {
          if (jsonC[i].data[j].num) {
            detailArray.push({
              id: jsonC[i].data[j].id,
              menu_name: jsonC[i].data[j].menu_name,
              num: jsonC[i].data[j].num,
              price: jsonC[i].data[j].price
            });
          }
        }
      }
      const orderResult = {
        sumMon: this.data.sumMon,
        detail: detailArray
      }
      wx.setStorage({
        key: "orderResult",
        data: orderResult
      })
      wx.navigateTo({
        url: '../balance/balance'
      })
    })
  },
  onShareAppMessage() {
    return {
      title: "点餐小程序",
      path: "./pages/order/order"
    }
  },
  bindChange(e) {
    this.setData({ currentTab: e.detail.current });
  },
  swichNav(e) {
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  chooseType(e) {
    console.log(e)
    this.setData({
      currentType: e.target.dataset.foodtype
    })
    wx.cloud.callFunction({
      name: "blog",
      data: {
        type_id: this.data.currentType,
        $url: "tea-name"
      },
    }).then((res) => {
      this.setData({
        goods: res.result.data,
      })
    })
  },
  seeDetailCart() {
    if (this.data.noOrder) return false;

    this.setData({
      showCart: !this.data.showCart
    })
  },
  addFoodNum(e) {
    console.log(e)
    let addFoodNum = e.target.dataset.num + 1,
      idx = parseInt(e.target.dataset.idx),
      jdx = parseInt(e.target.dataset.jdx),
      foodName = e.target.dataset.foodName,
      price = parseInt(e.target.dataset.price),
      sumNum = this.data.sumNum + 1,
      isOrder = this.data.noOrder, 
      jsonA = this.data.goods;
      console.log(jsonA)
      
    this.data.goods[jdx].num = addFoodNum;
    if (sumNum > 0) {
      isOrder = false;
    }

    let sumPrice = parseFloat(this.data.sumMon) + parseFloat(price);
    sumPrice = parseFloat(sumPrice.toFixed(2));

    this.setData({
      goods: jsonA,
      sumNum: sumNum,
      noOrder: isOrder,
      sumMon: sumPrice
    });
    order.push(this.data.goods[jdx])
    var arr = [];
    for (var i = 0; i < order.length; i++) { 
      if (arr.indexOf(order[i]) == -1) {
        arr.push(order[i]);
      }
    }
    wx.setStorage({
      key: 'order',
      data: arr,
    })
    wx.getStorage({
      key: 'order',
      success: (res) => {
        this.setData({
          shoppinggoods: res.data
        })
      },
    })
  },
  reduceFoodNum(event) {
    let redFoodNum = event.target.dataset.num - 1,
      foodName = event.target.dataset.foodName,
      idx = parseInt(event.target.dataset.idx),
      jdx = parseInt(event.target.dataset.jdx),
      price = parseFloat(event.target.dataset.price),
      sumNum = parseFloat(this.data.sumNum) - 1,
      isOrder = this.data.noOrder,
      jsonB = this.data.goods;
    this.data.goods[jdx].num = redFoodNum;
  
    if (sumNum <= 0) {
      isOrder = true;
      this.setData({
        showCart: false
      })
    }

    let sumPrice = this.data.sumMon - price;
    sumPrice = parseFloat(sumPrice.toFixed(2));

    this.setData({
      goods: jsonB,
      sumNum: sumNum,
      noOrder: isOrder,
      sumMon: sumPrice
    })
    order.push(this.data.goods[jdx])
    var arr = [];
    for (var i = 0; i < order.length; i++) {
      if (arr.indexOf(order[i]) == -1) {
        arr.push(order[i]);
      }
    }
    wx.setStorage({
      key: 'order',
      data: arr,
    })
    wx.getStorage({
      key: 'order',
      success: (res) => {
        this.setData({
          shoppinggoods: res.data
        })
      },
    })
  },
  hiddenLayer() {
    this.setData({
      showCart: false
    })
  },
  clearCart() {
    wx.showModal({
      content: '清空购物车？',
      success: res => {
        if (res.confirm) {
          let jsonC = this.data.menu;
          for (let i in jsonC) {
            for (let j in jsonC[i].data) {
              jsonC[i].data[j].num = 0;
            }
          }
          this.setData({
            menu: jsonC,
            sumNum: 0,
            sumMon: 0,
            noOrder: true,
            showCart: false
          })
        }
      }
    })

  },
  placeOrder() {
    if(openId){
      if (this.data.noOrder) return false;
      const detailArray = [];
      const jsonC = wx.getStorageSync("order")
      console.log(jsonC)
      for (let i = 0; i < jsonC.length; i++) {
          if (jsonC[i].num) {
            detailArray.push({
              id: jsonC[i].id,
              menu_name: jsonC[i].menu_name,
              num: jsonC[i].num,
              price: jsonC[i].price
            });
          }
      }
      const orderResult = {
        sumMon: this.data.sumMon,
        detail: detailArray
      }
      wx.setStorage({
        key: "orderResult",
        data: orderResult
      })
    wx.navigateTo({
      url: '../balance/balance'
    })
    }else{
      this.setData({
        loginShow:true
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'openId',
      success: (res) => {
        openId = res.data
      },
    })
    
    if (options.tid) {
      wx.setStorage({
        key: "place",
        data: options.tid
      })
    } else {
      wx.removeStorage({
        key: 'place',
        success: function (res) {
          console.log(res.data)
        }
      })
    }

    this.setData({
      currentTab: options.currentTab
    })
    wx.getSystemInfo({
      success: res => {
        this.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    wx.cloud.callFunction({
      name: "blog",
      data: {
        $url: "tea-type"
      },
    }).then((res) => {
      const typeArray = [];
      let result = res.result.data
      for (let object of result) {
        typeArray.push({
          id: object._id,
          type_name: object.type_name
        });
      }
      this.setData({
        currentType: typeArray[0].id,
        menu: typeArray
      })
    })
    wx.cloud.callFunction({
      name: "blog",
      data: {
        type_id:this.data.currentType,
        $url: "tea-name"
      },
    }).then((res) => {
      this.setData({
        goods: res.result.data,
      })
      console.log(res.result.data)
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

  }
})