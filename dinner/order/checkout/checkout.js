/**
 *
 * 配套视频教程请移步微信->小程序->灵动云课堂
 * 关注订阅号【huangxiujie85】，第一时间收到教程推送
 *
 * @link http://blog.it577.net
 * @author 黄秀杰
 */

// checkout.js
var Bmob = require('../../utils/bmob.js');
var WxNotificationCenter = require('../../utils/WxNotificationCenter.js');

var that;

Page({
	data: {
		personCountIndex: 0
	},
	onLoad: function (options) {
		that = this;
		that.loadAddress();
		// 注册通知
        WxNotificationCenter.addNotification("addressSelectedNotification", that.getSelectedAddress, that);
        WxNotificationCenter.addNotification("remarkNotification", that.getRemark, that);
        // 购物车获取参数
        that.setData({
        	carts: JSON.parse(options.carts)
        });
        // 读取商家信息
        getApp().loadSeller(function (seller) {
        	that.setData({
        		seller: seller
        	});
        });
        that.setData({
        	amount: parseFloat(options.amount),
        	quantity: parseInt(options.quantity),
        	express_fee: parseInt(options.express_fee),
        	total: parseFloat(options.amount) + parseInt(options.express_fee)
        });
        that.initpersonCountArray();
	},
	selectAddress: function () {
		wx.navigateTo({
			url: '../../address/list/list?isSwitchAddress=true'
		});
	},
	getSelectedAddress: function (addressId) {
		console.log(addressId);
		// 回调查询地址对象
		var query = new Bmob.Query("Address");
		query.get(addressId).then(function (address) {
			that.setData({
				address: address
			});
		});
	},
	loadAddress: function () {
		var that = this;
		var query = new Bmob.Query('Address');
		query.equalTo('user', Bmob.User.current());
		query.descending('updatedAt');
		query.limit(1);
		query.find().then(function (addressObjects) {
			// 查到用户已有收货地址
			if (addressObjects.length > 0) {
				that.setData({
					address: addressObjects[0]
				});
			}
		});
	},
	initpersonCountArray: function () {
		// 初始化用户数
		var personCountArray = [];
		var length = 10;
		for (var i = 1; i <= length; i++) {
			personCountArray.push(i + '人');
		}
		personCountArray.push(length + '人以上');
		that.setData({
			personCountArray: personCountArray
		});
	},
	getRemark: function (remark) {
		console.log(remark)
		that.setData({
			remark: remark
		});
	},
	naviToRemark: function () {
		wx.navigateTo({
			url: '../remark/remark?remark=' + (that.data.remark || '')
		});	
	},
	bindPickerChange: function(e) {
		// 监听picker事件
		this.setData({
			personCountIndex: e.detail.value
		})
	},
	payment: function () {
		// 创建订单
		var order = new Bmob.Object('Order');
		order.set('user', Bmob.User.current());
		order.set('address', that.data.address);
		order.set('express_fee', that.data.express_fee);
		order.set('title', that.data.carts[0].title);
		order.set('quantity', that.data.quantity);
		order.set('amount', that.data.amount);
		order.set('total', that.data.total);
		order.set('status', 0);
		order.set('detail', that.data.carts);
		order.save().then(function (orderCreated) {
			// 保存成功，调用支付
			getApp().payment(orderCreated);
		}, function (res) {
			console.log(res)
			wx.showModal({
				title: '订单创建失败',
				showCancel: false
			})
		});

	}
})