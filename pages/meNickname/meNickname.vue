<template>
	<view class="page page-fill">
		<form
		@submit="formSubmitNickname">
			<view class="page-block" style="margin-top: 20rpx;">
				<input type="text" name="nickname"
				class="input"
				placeholder="请输入昵称"
				:value="globalUser.nickname"
				placeholder-class="graywords"
				maxlength="10"/>
			</view>
			<button type="primary" form-type="submit" class="submitBtn">修改</button>
		</form>
		
	</view>
</template>

<script>
	import  common from '../../common/common.js';
	export default {
		data() {
			return {
				globalUser: {}
			}
		},
		onLoad(){
			this.globalUser = this.getGlobalUser('global-user');
		},
		methods: {
			formSubmitNickname(e){
				var me = this;
				var nickname = e.detail.value.nickname;
				// 修改接口
				uni.request({
					url: common.serverURL + "/user/modifyUserinfo",
					data: {
						"userId": me.globalUser.id,
						"nickname": nickname
					},
					header: {
						"headerUserId": me.globalUser.id,
						"headerUserToken": me.globalUser.userUniqueToken
					},
					method: "POST",
					success(res) {
						
						if ( res.data.status != 200) {
							// 获得最新的用户数据
							// var userInfo = res.data.data;
							// 修改昵称
							me.globalUser.nickname = nickname;
							console.log(me.globalUser);
							uni.setStorageSync("global-user", me.globalUser);
							uni.navigateBack({
								delta: 1
							});
						} else if (resData.status == 502 || resData.status == 500) {
							uni.showToast({
								title: res.data.msg,
								image: "../../static/icos/error.png",
								duration: 2000
							});
						}
					}
				})
			}
		}
	}
</script>

<style>
/* 页面铺满屏幕 */
.page-fill {
	width:100%;
	height: 100%;
	position: absolute;
}

.graywords {
	color: #EAEAEA;
}

.input {
	height: 80upx;
	line-height: 80upx;
	width: 500upx;
	margin-left: 40upx;
}

.submitBtn {
	width: 95%;
	margin-top: 40upx;
}
</style>
