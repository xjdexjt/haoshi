
### 安装说明

1、导入db文件夹中的数据到Bmob，导入方法是手工建表，然后选择导入cvs，(http://blog.it577.net/archives/32/)，**注意**：对于Pointer类型的字段要通过手工建立，Bmob目前暂不支持Pointer字段导入，对于其他类型字段在导出时参照下方类型手工更正，否则默认导入类型为String。关于Bmob的入门使用，请参见：[http://blog.it577.net/archives/32/]
2、修改小程序源码文件/utils/init.js中的Bmob Appid信息
3、Bmob后台修改小程序Appid与支付信息，具体操作图解，请参见：[http://blog.it577.net/archives/103/](http://blog.it577.net/archives/103/)

### 买家下单流程
1、店铺首页兼商品列表
2、购物车
3、收货地址列表与编辑
4、订单列表与详情
5、支付

### 前端特技
1、购物车动画
2、地址选择器，集成腾讯地图sdk

# 建表

### 1.商家表 Seller

字段名 | 类型 | 注释
--------  | ------ | --------
title | String | 店名 
logo_url | String | 头像
telephone | String | 联系电话
address | String  | 地址
notice | String | 公告
business_start | String | 开始营业时间
business_end | String | 结束营业时间
express_fee | Number | 配送费
min_amount | Number | 起送金额

### 2.分类表 Category
字段名 | 类型 | 注释
--------  | ------ | --------
title | String | 店名 
priority | Number | 优先级（越小越前）

### 3.菜品表 Food

字段名 | 类型 | 注释
--------  | ------ | --------
title | String | 店名 
thumb_url | String | 主图
summary | String | 简述
price | Number | 价格
category | Pointer | Cateogry分类表
priority | Number | 优先级（越小越前）

### 4.地址表 Address

字段名 | 类型 | 注释
--------  | ------ | --------
realname | String | 姓名
gender | Number | 1先生 0女士
mobile | String | 手机
area | String | 区域
detail | String | 详细地址
user | Pointer | 关联用户

### 5.订单表 Order

字段名 | 类型 | 注释
--------  | ------ | --------
user | Pointer | 下单人
title | String | 摘要
quantity | Number | 购买数量
address | Pointer | 地址
express_fee | Number | 配送费
amount | Number | 餐费
total | Number | 总计
status | Number | 状态（0，待付款；1，已付款；2，派送中；-1，已取消）
detail | Array | 清单
sn | String | 订单号

### 6.用户表

字段名 | 类型 | 注释
--------  | ------ | --------
isAdmin | Bool | true代表此用户为管理员
userInfo | Object | 用户昵称头像等
authData | Object | Bｍob维护的用户openid等信息
