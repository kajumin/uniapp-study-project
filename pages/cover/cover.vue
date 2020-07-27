<template>
	<view class="black"> 
		<image 
		:src="cover" mode="widthFix" 
		class="cover"
		@longpress="operator"
		></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				cover: ''
			}
		},
		onLoad(params){
			//通过api修改导航栏样式
			uni.setNavigationBarColor({
				frontColor: "#ffffff",
				backgroundColor: "#000"
			});
			
			this.cover = params.cover;
		},
		methods: {
			operator(){
				var me = this;
				uni.showActionSheet({
					itemList: ["保存图片到本地"],
					success: (res)=>{
						// debugger;
						// res = {tapIndex: 1, errMsg: "showActionS"}
						if(res.tapIndex === 0) {
							uni.showLoading({
								title: "图片保存中"
							})
							uni.downloadFile({
								url: me.cover,
								success: function(result) {
									// 拿到临时路径
									console.log(result);
									var tempPath = result.templatePath;
									// blob:http://localhost:8080/78442226-5f67-4c0f-a2a7-387a98c6d5c1
									uni.saveImageToPhotosAlbum({
										filePath: tempPath,
										success: function(){
											uni.showToast({
												title: "保存成功",
												duration: 2000
											});
										},
										complete:function(){
											uni.hideLoading();
										}
									});
									
								}
							});
						}
					}
				});
			}
		}
	}
</script>

<style>
page{
	height: 100%;
}
uni-page-body {
	height: 100%;
}
.black {
	background-color: #000000;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	/* position: fixed; */
}
.cover {
	align-self: center;
}
</style>
