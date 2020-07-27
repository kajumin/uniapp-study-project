<template>
	<view class="body">
		<form @submit="formSubmit">
			<view class="face-wapper">
				<image src="../../static/icos/default-face.png" class="face"></image>
			</view>
			
			<view class="info-wapper">
				<label class="words-lbl">账号</label>
				<input name="username" type="text" value="" class="input" placeholder="请输入用户名" placeholder-class="graywords"/>
			</view>
			
			<view class="info-wapper" style="margin-top: 40upx;">
				<label class="words-lbl">密码</label>
				<input name="password" type="text" value="" password="true" class="input" placeholder="请输入密码" placeholder-class="graywords"/>
			</view>
			
			<button type="primary" form-type="submit" style="margin-top: 60upx;width: 90%;">注册/登录</button>
		</form>
		
		<!-- 第三方登录H5不支持，所以隐藏掉 -->
		<!-- #ifndef H5 -->
			<view class="third-wapper">
				
				<view class="third-line">
					<view class="single-line">
						<view class="line"></view>
					</view>
					
					<view class="third-words">第三方账号登录</view>
					
					<view class="single-line">
						<view class="line"></view>
					</view>
				</view>
				
				<view class="third-icos-wapper">
					<!-- 5+app 用qq/微信/微博 登录 小程序用微信小程序登录 h5不支持 -->
					<!-- #ifdef APP-PLUS -->
						<image src="../../static/icos/weixin.png" data-logintype="weixin" @click="appOAuthLogin" class="third-ico"></image>
						<image src="../../static/icos/QQ.png" data-logintype="qq" @click="appOAuthLogin" class="third-ico" style="margin-left: 80upx;"></image>
						<image src="../../static/icos/weibo.png" data-logintype="sinaweibo" @click="appOAuthLogin" class="third-ico" style="margin-left: 80upx;"></image>
					<!-- #endif -->
					<!-- #ifdef MP-WEIXIN -->
						<button open-type='getUserInfo' @getuserinfo="wxLogin" class="third-btn-ico">
						</button>
					<!-- #endif -->
				</view>
			</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import common from '../../common/common.js';
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			appOAuthLogin(e) {
				var me = this;
				// 获取用户的登录类型
				var logintype = e.currentTarget.dataset.logintype;
				// 注意要使用appid  测试可以随便填写
				// 授权登录
				uni.login({
					provider: logintype,
					success: function(loginRes){
						// 授权登录以后  获取用户的信息
						console.log(loginRes);
						uni.getUserInfo({
							provider: logintype,
							success: function(info){
								// 被授权(微信,qq,微博)用户的信息
								// console.log(JSON.parse(info));
								var userInfo = info.userInfo; //获取用户信息
								var face = '';
								var nickname = '';
								var openIdOrUid = '';
								// 拿到后台具体需要的用户信息face nickname  openIdOrUid
								if(logintype == 'weixin'){
									face = userInfo.avatarUrl;
									nickname = userInfo.nickname;
									openIdOrUid = userInfo.openid;
								}else if(logintype = 'qq') {
									face = userInfo.figureurl_qq_2;
									nickname = userInfo.nickName;
									openIdOrUid = userInfo.openid;
								}else if(logintype == 'sinaweibo'){
									face = userInfo.avator_large;
									nickname = userInfo.nickName;
									openIdOrUid = userInfo.id;
								}
								// 调用开发者后台
								uni.request({
									url: common.serverURL + "appUnionLogin/" + logintype,
									method: "POST",
									data: {
										"face": face,
										"nickname": nickname,
										"openIdOrUid": openIdOrUid
									},
									success: function(result){
										if(result.data.status != 200) {
											console.log(logintype,face,nickname,openIdOrUid);
											uni.setStorageSync('global-user', {"faceImage":"/static/icos/default-face.png","nickname": "weixin-user","id":'1903039NB05B4H94',"sex": 0,"birthday":"1996-02-03","userUniqueToken": "asdgeg"+ Math.ceil(Math.random()*1000)});
											// 页面跳转
											uni.switchTab({
												url: '../me/me'
											});
										}
									}
								})
								
							}
						});
					}
				});
			},
			wxLogin(e){
				// 微信小程序端的微信登录
				var me = this;
				// console.log(e);
				var userInfo = e.detail.userInfo;
				console.log(userInfo);
				// 实现微信登录
				uni.login({
					provider: 'weixin',
					success: function(result) {
						console.log(result);
						// 获得微信登录的code: 授权码
						var code = result.code;
						console.log(code);//04398J9c1ZwxRz0Ouzbc1Ky4ac198J96
						
						// 设置登录哪一个对应的微信小程序
						uni.request({
							url: common.serverURL + "stu/mpWXLogin/" + code,
							method: "post",
							data:{
								"avatarUrl": userInfo.avatarUrl,
								"nickName": userInfo.nickName,
								"whichMP": userInfo.whichMP
							},
							success: function(userResult) {
								console.log(userResult); //data: id:"1903039NB05B4H94"
								uni.setStorageSync('global-user', {"faceImage":"/static/icos/default-face.png","nickname": "weixin-user","id":'1903039NB05B4H94',"sex": 0,"birthday":"1996-02-03"});
								// 页面跳转
								uni.switchTab({
									url: '../me/me'
								});
							}
						})
					}
				});
			},
			formSubmit(e){
				var username = e.detail.value.username;
				var password = e.detail.value.password;
				console.log(username, password);
				
				uni.request({
					url: common.serverURL + 'user/registOrLogin',
					data: {
						"username": username,
						"password": password
					},
					method: "POST",
					success: function(res) {
						if(res.data.data != 200){
							console.log(res.data);
							
							try {
								if(username == 'bang' && password == '123456'){
									uni.setStorageSync('global-user', {"faceImage":"/static/icos/default-face.png","nickname": username,"id":'124sdaf8sdaf',"sex": 0,"birthday":"1996-02-03","userUniqueToken": "asdgeg"+ Math.ceil(Math.random()*1000)});
									// 页面跳转
									uni.switchTab({
										url: '../me/me'
									});
								}else {
									uni.showToast({
										title: "用户名或者密码错误",
										duration: 2000,
										image: "../../static/icos/error.png"
									});
								}
							    
							} catch (e) {
								console.log(e);
							}
							
						}
					}
				});
			}
		}
	}
</script>

<style>
	@import url('registLogin.css');
</style>
