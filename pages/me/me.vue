<template>
	<view class="page page-fill">
		<view class="header">
			<view v-if="userIsLogin" class="login-block">
				<image :src="userInfo.faceImage" class="face"></image>
			</view>
			<view v-else>
				<image src="http://122.152.205.72:88/group1/M00/00/05/CpoxxFw_-5-AFyVyAABLIH8xBTw233.png" class="face"></image>
			</view>
			
			<view class="info-wapper"  v-if="userIsLogin">
				<view class="nickname">
					{{userInfo.nickname}}
				</view>
				<view class="nav-info">{{userInfo.id}}</view>
			</view>
			<view v-else>
				<navigator url="../registLogin/registLogin">
					<view class="nickname regist-login">
						注册/登录
					</view>
				</navigator>
			</view>
			<view class="set-wapper" v-if="userIsLogin">
				<navigator url="../meInfo/meInfo">
					<image src="../../static/icos/settings.png" class="settings"></image>	
				</navigator>
			</view>
			
		</view>
	</view>	
</template>

<script>
	export default {
		data() {
			return {
				userIsLogin: false,
				userInfo: {}
			}
		},
		onShow(){
			try {
			    this.userInfo = this.getGlobalUser('global-user');
				console.log(this.userInfo);
			    if (this.userInfo != null) {
					this.userIsLogin = true;
			        console.log(this.userInfo);
			    }else {
					this.userIsLogin = false;
				}
			} catch (e) {
			    // error
			}
		},
		onLoad(){
			
		},
		methods: {
			
		}
	}
</script>

<style>
	@import url('me.css');
</style>
