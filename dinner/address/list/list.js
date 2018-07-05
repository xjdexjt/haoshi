

var Bmob = require('../../utils/bmob.js');
var WxNotificationCenter = require('../../utils/WxNotificationCenter.js');

var that;

Page({
	data: {
		visual: 'hidden'
	},
	onLoad: function (options) {
		that = this;
		if (options.isSwitchAddress) {
			that.setData({
				isSwitchAddress: true
			});
		}
	},
	onShow: function () {
		that.getAddress();	
	},
	add: function () {
		wx.navigateTo({
			url: '../add/add'
		});
	},
	getAddress: function () {
		var query = new Bmob.Query('Address');
		query.equalTo('user', Bmob.User.current());
		query.limit(Number.MAX_VALUE);
		query.find().then(function (results) {
			that.setData({
				addressList: results,
				visual: results.length ? 'hidden' : 'show'
			});
		});
	},
	edit: function (e) {
		var index = e.currentTarget.dataset.index;
		var objectId = that.data.addressList[index].id;
		wx.navigateTo({
			url: '../add/add?objectId=' + objectId
		})
	},
	selectAddress: function (e) {
		if (!that.data.isSwitchAddress) {
			return;
		}
		var index = e.currentTarget.dataset.index;
		WxNotificationCenter.postNotificationName("addressSelectedNotification", that.data.addressList[index].id);
		wx.navigateBack();
	}
})