<template>
	<view class="page page-fill">
		
		<view class="pending-wapper">
			<image id="face" :src="tempFace" class="pending-face" mode="scaleToFill"></image>
		</view>
		
		<view class="notice">
			<view class="notice-words">
				* 请从相册中选择等比宽高的图片噢~
			</view>
		</view>
		
		<view class="footer-opertor">
			<view class="opertor-words" @click="changePendingFace">
				重新选择
			</view>
			<view class="opertor-words" @click="upload">
				确认上传
			</view>
		</view>
		
	</view>
</template>

<script>
	import common from '../../common/common.js';
	export default {
		data() {
			return {
				tempFace: ""
			};
		},
		onLoad(params) {
			console.log(params.tempPath)
			this.tempFace = params.tempPath;
		},
		methods: {
			// 重新选择头像
			changePendingFace() {
				var me = this;
				uni.chooseImage({
					count: 1,
					sizeType: ["compressed"],
					sourceType: ["album"],
					success(res) {
						// 获得临时路径
						me.tempFace = res.tempFilePaths[0];
					}
				})
			},
			upload() {
				var me = this;
				var globalUser = this.getGlobalUser('global-user');
				
				uni.showLoading({
					mask: true,
					title: "上传中，请稍后"
				});
				
				uni.uploadFile({
					url: common.serverURL + "/user/uploadFace?userId=" + globalUser.id,
					filePath: me.tempFace,
					name: "file",
					header: {
						"headerUserId": globalUser.id,
						"headerUserToken": globalUser.userUniqueToken
					},
					success(res) {
						// debugger;
						var resDataStr = res.data;
						// console.log(typeof(resDataStr));
						var resData = JSON.parse(resDataStr);
						// console.log(typeof(resData));
						if (resData.status != 200) {
							// 获得最新的用户数据
							uni.setStorageSync("global-user", {"faceImage":"/static/tabBarIco/me.png","nickname": globalUser.nickName,"id":'124sdaf8sdaf',"sex": 0,"birthday":"1996-02-03","userUniqueToken": "asdgeg"+ Math.ceil(Math.random()*1000)});
							uni.navigateBack({
								delta: 1
							});
						} else if (resData.status == 502 || resData.status == 500) {
							uni.showToast({
								title: res.data.msg,
								image: "../../static/icos/error.png",
								duration: 2000
							})
						}
					},
					complete() {
						uni.hideLoading();
					}
				});
				
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
	background: black;
}

.pending-wapper {
	display: flex;
	flex-direction: row;
	justify-content: center;
	
	margin-top: 40upx;
}
.pending-face {
	width: 600upx;
	height: 600upx;
}

.notice {
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
}

.notice-words {
	color: gray;
	font-size: 13px;
	margin-top: 30upx;
	width: 600upx;
}

/* 底部操作 start */
.footer-opertor {
	position: fixed;
	bottom: 0;
	
	border-top: #515050 solid 1px;
	width: 100%;
	
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	
	padding: 30upx;
}
.opertor-words {
	color: #e8e5e5;
	font-size: 16px;
	width: 200upx;
}
/* 底部操作 end */
</style>
