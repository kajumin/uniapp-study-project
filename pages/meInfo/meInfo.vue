<template>
	<view class="page page-fill">
		<view class="page-block info-list">
			<view class="item-wapper face-line-upbottom" @click="operator">
				<view class="info-words">头像</view>
				
				<view class="right-wapper">
					<image :src="globalUser.faceImage" class="face"></image>
					<view class="arrow-block">
						<image src="../../static/icos/left-gray-arrow.png" class="arrow-ico"></image>
					</view>
				</view>
			</view>
			
			<view class="line-top">
				<view 
				class="line"></view>
			</view>
			
			<!-- 昵称 -->
			<view class="item-wapper" 
			@click="modifyNick">
				<view class="info-words">昵称</view>
				
				<view class="right-wapper">
					<view class="gray-fields">
						{{globalUser.nickname}}
					</view>
					<view class="arrow-block">
						<image src="../../static/icos/left-gray-arrow.png" class="arrow-ico"></image>
					</view>
				</view>
			</view>
			
			<view class="line-top">
				<view class="line"></view>
			</view>
			
			<!-- 生日 -->
			<view class="item-wapper" @click="modifyBirthday">
				<view class="info-words">生日</view>
				
				<view class="right-wapper">
					<view class="gray-fields">
						{{globalUser.birthday}}
					</view>
					<view class="arrow-block">
						<image src="../../static/icos/left-gray-arrow.png" class="arrow-ico"></image>
					</view>
				</view>
			</view>
			
			<view class="line-top">
				<view class="line"></view>
			</view>
				
			<!-- 性别 -->
			<view class="item-wapper" @click="modifySex">
				<view class="info-words">性别</view>
				
				<view class="right-wapper">
					<view class="gray-fields">
						
						<view v-if="globalUser.sex == 1">
							男
						</view>
						<view v-else-if="globalUser.sex == 0">
							女
						</view>
						<view v-else>
							未选择
						</view>
						
					</view>
					<view class="arrow-block">
						<image src="../../static/icos/left-gray-arrow.png" class="arrow-ico"></image>
					</view>
				</view>
			</view>	
		</view> 
		
		<view class="footer-wapper">
			<view class="footer-words" @click="cleanStorage">
				清理缓存
			</view>
			<view class="footer-words" style="margin-top: 10upx;" @click="logout">
				退出登录
			</view>
		</view>
		
		
	</view>
</template>

<script>
	import common from '../../common/common.js';
	export default {
		data() {
			return {
				globalUser: {}
			}
		},
		onShow(){
			// this.globalUser = uni.getStorageSync('global-user');
			// 使用全局挂载
			this.globalUser = this.getGlobalUser('global-user');
		},
		methods: {
			modifyNick(){
				console.log('修改昵称');
				uni.navigateTo({
					url: '../meNickname/meNickname'
				});
			},
			modifyBirthday(){
				console.log('修改生日');
				uni.navigateTo({
					url: '../meBirthday/meBirthday'
				});
			},
			modifySex(){
				console.log('修改性别');
				uni.navigateTo({
					url: '../meSex/meSex'
				});
			},
			operator(){
				var me = this;
				uni.showActionSheet({
					itemList: ["查看我的头像","从相册选择上传"],
					success:function(res){
						if(res.tapIndex == 0){
							var faceArr = [];
							faceArr.push(me.globalUser.faceImage);
							uni.previewImage({
								urls: faceArr,
								current: faceArr[0]
							});
						}else if(res.tapIndex ==1) {
							uni.chooseImage({
								count: 1,
								sizeType: ["compressed"],
								sourceType: ["album"],
								success:function(res){
									var tempPath = res.tempFilePaths[0];
									// #ifdef H5
									uni.navigateTo({
										url: "../meFace/meFace?tempPath=" + tempPath
									});
									// #endif
									// #ifndef H5
									uni.navigateTo({
										url: "../faceCrop/faceCrop?tempPath=" + tempPath
									});
									// #endif
								}
							})
							
						}
					}
				})
			},
			cleanStorage(){
				uni.clearStorage();
				uni.showToast({
					title: "清除缓存成功",
					duration: 1000,
					mask: true
				});
			},
			logout(){
				
				uni.request({
					url: common.serverURL + '/user/logout?userId=' + this.getGlobalUser('global-user').id,
					method: "POST",
					success: (res) => {
						// 获取真实数据之前，务必判断状态是否为200
						if (res.data.status != 200) {
							// 如果服务器返回200，代表用户在服务端退出登录成功
							// console.log(common.serverURL,this.getGlobalUser('global-user').id);
							uni.removeStorageSync("global-user");
							uni.switchTab({
								url: "../me/me"
							});
						}
					}
				});
			}
		}
	}
</script>

<style>
	@import url('meInfo.css');
</style>
