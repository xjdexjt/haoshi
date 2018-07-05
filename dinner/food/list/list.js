/*
 *
 * 配套视频教程请移步微信->小程序->灵动云课堂
 * 关注订阅号【huangxiujie85】，第一时间收到教程推送
 *
 * @link http://blog.it577.net
 * @author 黄秀杰
 */

var Bmob = require('../../utils/bmob.js');
var that;
Page({
	onLoad: function () {
		that = this;
		// 管理员认证
		getApp().auth();
	},
	onShow: function () {
		that.loadFood();
	},
	loadFood: function () {
		var query = new Bmob.Query('Food');
		query.include('category');
		query.ascending('priority');
		query.limit(Number.Max_VALUE);
		query.find().then(function (foodObjects) {
			// console.log(foodObjects);
			that.setData({
				foodObjects: foodObjects
			});
		});
	},
	add: function () {
		// 跳转添加页面
		wx.navigateTo({
			url: '../add/add'
		});
	},
	showDetail: function (e) {
		var index = e.currentTarget.dataset.index;
		var objectId = that.data.foodObjects[index].id;
		wx.navigateTo({
			url: '../add/add?objectId=' + objectId
		});
		// console.log(objectId);
	}
})