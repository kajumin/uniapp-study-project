<template>
	<view class="movice-score-wrapper">
		<image 
		v-for="yellow in yellowScore"
		src="/static/icos/star-yellow.png" 
		class="star-icon"></image>
			
		<image 
		v-for="gray,index in grayScore"
		src="/static/icos/star-gray.png" 
		class="star-icon"></image>
		<view class="movice-score" v-if="showNum === 1">
			{{innerScore}}
		</view>
	</view>
</template>

<script>
	export default {
		name: "trailerStars",
		props: {
			innerScore: 0,
			showNum: 0
		},
		data() {
			return {
				yellowScore: 0,
				grayScore: 5
			}
		},
		created(){
			// console.log(this.innerScore)
			// console.log(this.yellowScore)
			// console.log(this.grayScore)
			var tempScore = 0;
			if(this.innerScore != null && this.innerScore != undefined && this.innerScore != ''){
				tempScore = this.innerScore;
			}
			this.yellowScore = parseInt(tempScore / 2);
			this.grayScore = 5 - this.yellowScore;
		},
		methods: {
			
		}
	}
</script>

<style>
.movice-score-wrapper {
	display: flex;
	flex-direction: row;
}
.star-icon {
	width: 20rpx;
	height: 20rpx;
	margin-top: 6rpx;
}
.movice-score {
	font-size: 12px;
	color: gray;
	margin-left: 8rpx;
}

</style>
