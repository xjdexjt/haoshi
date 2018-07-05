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
// 最大行数
var max_row_height = 5;
// 行高
var cart_offset = 90;
// 底部栏偏移量
var food_row_height = 49;
Page({
	data: {
		categoryStates: [],
		cartData: {},
		cartObjects: [],
		maskVisual: 'hidden',
		amount: 0
	},
	onLoad: function () {
		that = this;
		// wx.navigateTo({
		// 	url: '../../order/checkout/checkout'
		// });
		getApp().loadSeller(function (seller) {
			that.setData({
				seller: seller,
				express_fee: seller.get('express_fee')
			});
		});
		that.loadCategory();
		that.loadFood();
	},
	loadCategory: function () {
		var query = new Bmob.Query('Category');
		query.ascending('priority');
		query.limit(Number.MAX_VALUE);
		query.find().then(function (categoryObjects) {
			// console.log(categoryObjects);
			var categoryStates = [];
			for (var i = 0; i < categoryObjects.length; i++) {
				categoryStates.push(false);
			}
			// categoryStates[0] = true;
			that.setData({
				categoryObjects: categoryObjects,
				categoryStates: categoryStates
			});
		});
	},
	loadFood: function (category) {
		var query = new Bmob.Query('Food');
		if (category != undefined) {
			query.equalTo('category', category);
		}
		query.ascending('priority');
		query.limit(Number.MAX_VALUE);
		query.find().then(function (foodObjects) {
			that.setData({
				foodObjects: foodObjects
			});
		});
	},
	switchCategory: function (e) {
		// 获取分类id并切换分类
		var index = e.currentTarget.dataset.index;
		var categoryId = that.data.categoryObjects[index].id;
		// console.log(categoryId);
		var category = Bmob.Object.createWithoutData('Category', categoryId);
		// 更改分类项高亮状态
		var categoryStates = that.data.categoryStates;
		categoryStates = categoryStates.map(function (item, i) {
			if (index == i) {
				item = true;
			} else {
				item = false;
			}
			return item;
		});
		that.setData({
			category: category,
			categoryStates: categoryStates
		});
		that.loadFood(category);
	},
	checkout: function () {
		// 将对象序列化
		var cartObjects = [];
		that.data.cartObjects.forEach(function (item, index) {
			var cart = {
				title: item.food.toJSON().title,
				price: item.food.toJSON().price,
				quantity: item.quantity
			};
			cartObjects.push(cart);
		});

		wx.navigateTo({
			url: '../../order/checkout/checkout?quantity=' + that.data.quantity + '&amount=' + that.data.amount +'&express_fee=' + that.data.express_fee + '&carts=' + JSON.stringify(cartObjects)
		});
	},
	add: function (e) {
		// 所点商品id
		var foodId = e.currentTarget.dataset.foodId;
		// console.log(foodId);
		// 读取目前购物车数据
		var cartData = that.data.cartData;
		// 获取当前商品数量
		var foodCount = cartData[foodId] ? cartData[foodId] : 0;
		// 自增1后存回
		cartData[foodId] = ++foodCount;
		// 设值到data数据中
		that.setData({
			cartData: cartData
		});
		// 转换成购物车数据为数组
		that.cartToArray(foodId);
	},
	subtract: function (e) {
		// 所点商品id
		var foodId = e.currentTarget.dataset.foodId;
		// 读取目前购物车数据
		var cartData = that.data.cartData;
		// 获取当前商品数量
		var foodCount = cartData[foodId];
		// 自减1
		--foodCount;
		// 减到零了就直接移除
		if (foodCount == 0) {
			delete cartData[foodId]
		} else {
			cartData[foodId] = foodCount;
		}
		// 设值到data数据中
		that.setData({
			cartData: cartData
		});
		// 转换成购物车数据为数组
		that.cartToArray(foodId);
	},
	cartToArray: function (foodId) {
		// 需要判断购物车数据中是否已经包含了原商品，从而决定新添加还是仅修改它的数量
		var cartData = that.data.cartData;
		var cartObjects = that.data.cartObjects;
        var query = new Bmob.Query('Food');
        // 查询对象
        query.get(foodId).then(function (food) {
        	// 从数组找到该商品，并修改它的数量
        	for (var i = 0; i < cartObjects.length; i++) {
        		if (cartObjects[i].food.id == foodId) {
        			// 如果是undefined，那么就是通过点减号被删完了
        			if (cartData[foodId] == undefined) {
        				cartObjects.splice(i, 1);
        			} else {
	        			cartObjects[i].quantity = cartData[foodId];
        			}
        			that.setData({
        				cartObjects: cartObjects
        			});
        			// 成功找到直接返回，不再执行添加
        			that.amount();
        			return ;
        		}
        	}
        	// 添加商品到数组
            var cart = {};
            cart.food = food;
            cart.quantity = cartData[foodId];
        	cartObjects.push(cart);
        	that.setData({
        		cartObjects: cartObjects
        	});
        	// 因为请求网络是异步的，因此汇总在此，上同
        	that.amount();
        });
	},
	cascadeToggle: function () {
		//切换购物车开与关
		// console.log(that.data.maskVisual);
		if (that.data.maskVisual == 'show') {
			that.cascadeDismiss();
		} else {
			that.cascadePopup();
		}
	},
	cascadePopup: function () {
		// 购物车打开动画
		var animation = wx.createAnimation({
			duration: 300,
			timingFunction: 'ease-in-out',
		});
		that.animation = animation;
		// scrollHeight为商品列表本身的高度
		var scrollHeight = (that.data.cartObjects.length <= max_row_height ? that.data.cartObjects.length : max_row_height) * food_row_height;
		// cartHeight为整个购物车的高度，也就是包含了标题栏与底部栏的高度
		var cartHeight = scrollHeight + cart_offset;
		animation.translateY(- cartHeight).step();
		that.setData({
			animationData: that.animation.export(),
			maskVisual: 'show',
			scrollHeight: scrollHeight,
			cartHeight: cartHeight
		});
		// 遮罩渐变动画
		var animationMask = wx.createAnimation({
			duration: 150,
			timingFunction: 'linear',
		});
		that.animationMask = animationMask;
		animationMask.opacity(0.8).step();
		that.setData({
			animationMask: that.animationMask.export(),
		});
	},
	cascadeDismiss: function () {
		// 购物车关闭动画
		that.animation.translateY(that.data.cartHeight).step();
		that.setData({
			animationData: that.animation.export()
		});
		// 遮罩渐变动画
		that.animationMask.opacity(0).step();
		that.setData({
			animationMask: that.animationMask.export(),
		});
		// 隐藏遮罩层
		that.setData({
			maskVisual: 'hidden'
		});
	},
	amount: function() {
		var cartObjects = that.data.cartObjects;
		var amount = 0;
		var quantity = 0;
		cartObjects.forEach(function (item, index) {
			amount += item.quantity * item.food.get('price');
			quantity += item.quantity;
		});
		that.setData({
			amount: amount,
			quantity: quantity
		});
	}
})