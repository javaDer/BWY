//index.js
//获取应用实例
var app = getApp()
var amapFile = require('../../libs/amap-wx.js');
Page({
  data: {
    //地图的宽高
    mapHeight: '80vh',
    mapWidth: '100%',
    mapTop: '0',
    markers: [],
    focus:'true',
    longitude: '102.625076',
    latitude: '37.957707',
    address: '',
    defaultSize: 'default',
    primarySize: 'default',
    warnSize: 'default',
    disabled: false,
    plain: false,
    loading: false,
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    controls: [
      //地图中心位置按钮
      {
        id: 14,
        position: {
          left: 177.5 * wx.getStorageSync("kScreenW"),
          top: 261.5 * wx.getStorageSync("kScreenH"),
          width: 20 * wx.getStorageSync("kScreenW"),
          height: 40 * wx.getStorageSync("kScreenW")
        },
        iconPath: '../../images/conter.png',
        clickable: false,
      }]
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this
    this.mapCtx = wx.createMapContext("myMap");
    // wx.getLocation({
    //   type: 'wgs84',
    //   success: function (res) {
    //     var latitude = res.latitude
    //     var longitude = res.longitude
    //     var speed = res.speed
    //     var accuracy = res.accuracy
    //     that.setData({
    //       'latitude': latitude,
    //       'longitude': longitude

    //     })
    //   }
    // })
  },
  regionchange: function (e) {
    var that = this
    that.mapCtx.getCenterLocation({
      success: function (res) {
        //调试发现地图在滑动屏幕开始和结束的时候都会走这个方法,需要判断位置是否真的变化来判断是否刷新单车列表
        //经纬度保留6位小数
        var longitudeFix = res.longitude.toFixed(6)
        var latitudeFix = res.latitude.toFixed(6)
        if (e.type == "begin") {
          console.log('位置相同,不执行刷新操作')
        } else {
          console.log("位置变化了")
          wx.request({
            url: 'http://restapi.amap.com/v3/geocode/regeo?key=b74ed3c1e72ac8eed6b1d9717265ce53&location=' + longitudeFix + "," + latitudeFix, //仅为示例，并非真实的接口地址
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              that.setData({
                'address': res.data.regeocode.formatted_address
              })
              console.log(res.data.regeocode.formatted_address)
            }
          })
          console.log(longitudeFix + "," + latitudeFix)
          that.setData({
            'getBikeListParams.longitude': longitudeFix,
            'getBikeListParams.latitude': latitudeFix
          })
          //刷新单车列表
        }
      }
    })
  },
})
