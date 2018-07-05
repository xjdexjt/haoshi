/**
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
		that.setData({
			user: Bmob.User.current()
		});
	},
	logout: function () {
		// 确认退出登录
		wx.showModal({
			title: '确定退出登录',
			success: function (res) {
				if (res.confirm) {
					// 退出操作
					Bmob.User.logOut();
					that.setData({
						user: Bmob.User.current()
					});
				}
			}
		});
	}
}) 