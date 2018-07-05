// 初始化AV
require('utils/init.js');
var Bmob = require('utils/bmob.js');

App({
	onLaunch: function () {
		var that = this;
		that.login();
		// 设备信息
		wx.getSystemInfo({
			success: function(res) {
				that.screenWidth = res.windowWidth;
				that.screenHeight = res.windowHeight;
				that.pixelRatio = res.pixelRatio;
			}
		});
	},
	auth: function () {
		// 管理员认证
		if (!wx.getStorageSync('isAdmin')) {
			wx.switchTab({
				url: '../../shop/index/index'
			});
		}	
	},
	login: function() {
		// 用户登录
		var user =	new Bmob.User;
		if (Bmob.User.current()) {
			return;
		}
		wx.login({
			success: function (res) {
				user.loginWithWeapp(res.code).then(function (user) {
					var openid = user.get("authData").weapp.openid;
					wx.setStorageSync('openid', openid)
					wx.setStorageSync('isAdmin', user.get('isAdmin'));
					var u = Bmob.Object.extend("_User");
					var query = new Bmob.Query(u);
					query.get(user.id, {
						success: function (result) {
							wx.setStorageSync('own', result.get("uid"));
						},
						error: function (result, error) {
							console.log("查询失败");
						}
					});
			//保存用户其他信息，比如昵称头像之类的
			wx.getUserInfo({
				success: function (result) {

					var userInfo = result.userInfo;
					var nickName = userInfo.nickName;
					var avatarUrl = userInfo.avatarUrl;

					var u = Bmob.Object.extend("_User");
					var query = new Bmob.Query(u);
				// 这个 id 是要修改条目的 id，你在生成这个存储并成功时可以获取到，请看前面的文档
				query.get(user.id, {
					success: function (result) {
					// 自动绑定之前的账号
					result.set('userInfo', {
						nickname: nickName,
						avatar: avatarUrl
					});
					// result.set('nickName', nickName);
					// result.set("userPic", avatarUrl);
					// result.set("openid", openid);
					result.save();

				}
			});

			}
		});
		}, function (err) {
			console.log(err, 'errr');
		});
			}
		});
	},
	loadSeller: function (cb) {
		var query = new Bmob.Query('Seller');
		query.find().then(function (sellerObjects) {
			var seller = sellerObjects[0];
			cb(seller);
		});
	},
	payment: function (order) {
		// 微信支付
		var openId = Bmob.User.current().get('authData').weapp.openid;
		//传参数金额，名称，描述,openid
		Bmob.Pay.wechatPay(order.get('total'), '好食', '订餐', openId).then(function (resp) {
			console.log('resp');
			console.log(resp);
			//服务端返回成功
			var timeStamp = resp.timestamp,
			nonceStr = resp.noncestr,
			packages = resp.package,
			orderId = resp.out_trade_no,//订单号，如需保存请建表保存。
			sign = resp.sign;
			//打印订单号
			console.log(orderId);
			//发起支付
			wx.requestPayment({
				'timeStamp': timeStamp,
				'nonceStr': nonceStr,
				'package': packages,
				'signType': 'MD5',
				'paySign': sign,
				'success': function (res) {
					//付款成功,这里可以写你的业务代码
					console.log(res);
					// 写入订单号，更新订单状态
					order.set('sn', orderId);
					order.set('status', 1);
					order.save().then(function () {
						wx.showModal({
							title: '支付成功',
							showCancel: false,
							success: function () {
								// 跳转订单详情页
								wx.navigateTo({
									url: '/order/detail/detail?objectId=' + order.id
								});
							}
						});
					}, function (res) {
						console.log(res);
						wx.showModal({
							title: '更新订单失败'
						});
					});
				},
				'fail': function (res) {
					wx.showModal({
						title: '支付取消',
						showCancel: false,
						success: function () {
							wx.navigateTo({
								url: '/order/detail/detail?objectId=' + order.id
							});
						}
					});
				}
			})
		}, function (err) {
			console.log('服务端返回失败');
			console.log(err.message);
			console.log(err);
		});
	}
})
