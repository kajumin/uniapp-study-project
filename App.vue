<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	.page {
		/* position: absolute; */
		width: 100%;
		height: 100%;
		background-color: #F7F7F7;
	}
	.page-block {
		background-color: #FFFFFF;
	}	
	.line-wrapper {
		padding: 0 20rpx;
	}
	.line {
		height: 1px;
		background-color: #dbdbda;
	}
</style>
