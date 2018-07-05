/**
 *
 * 配套视频教程请移步微信->小程序->灵动云课堂
 * 关注订阅号【huangxiujie85】，第一时间收到教程推送
 *
 * @link http://blog.it577.net
 * @author 黄秀杰
 */

var Bmob = require('../../utils/bmob.js');
var WxNotificationCenter = require('../../utils/WxNotificationCenter.js');

var that;

Page({
	data: {
	},
	onLoad: function (options) {
		that = this;
		if (options.remark) {
			that.setData({
				remark: options.remark
			});
		}
	},
	setRemark: function (e) {
		var remark = e.detail.value.remark || '';
		// 推送通知
		WxNotificationCenter.postNotificationName("remarkNotification", remark);
		wx.navigateBack();
	}
})