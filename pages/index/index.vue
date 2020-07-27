<template>
	<view class="page">
		<!-- 轮播图 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" class="carousel">
		    <swiper-item v-for="carousel in carouselList" :key="carousel.id">
		        <image :src="carousel.src" class="carousel"></image>
		    </swiper-item>   
		</swiper>
		<!-- 热门超英 -->
		<view class="page-block super-hot">
			<view class="hot-title-wrapper">
				<image src="../../static/icos/hot.png" class="hot-icon"></image>
				<view class="hot-title">
					热门超英
				</view>
			</view>
		</view>
		
		<scroll-view scroll-x="true" class="page-block hot">
		    <view class="single-poster" v-for="superHero in hotSuperHeroList" :key="superHero.id">
				<view class="poster-wrapper">
					<image :src="superHero.src" class="post"></image>
					<view class="movie-name">
						{{superHero.name}}
					</view>
					<trailerStars :innerScore="superHero.score" :showNum="1"></trailerStars>
				</view>
			</view>
			
		</scroll-view>
		
		<view class="page-block super-hot">
			<view class="hot-title-wrapper">
				<image src="../../static/icos/interest.png" class="hot-icon"></image>
				<view class="hot-title">
					热门预告
				</view>
			</view>
		</view>
		
		<view class="hot-movies page-block">
			<video
				v-for="trailer in hotTrailerList"
				:key="trailer.id"
				:id="trailer.id + ''"
				:data-playIndex="trailer.id"
				@play="meIsPlaying"
				:src="trailer.trailer"
				:poster="trailer.poster"
				class="hot-movie-single"
			></video>
		</view>
		
		<!-- 猜你喜欢 -->
		<view class="page-block super-hot">
			<view class="hot-title-wrapper">
				<image src="../../static/icos/guess-u-like.png" class="hot-icon"></image>
				<view class="hot-title">
					猜你喜欢
				</view>
			</view>
		</view>
		<view class="guess-u-like page-block">
			<view class="single-like-movie" v-for="(guess,index) in gessULikeList" :key="guess.id">
				<image :src="guess.cover" class="like-movie"></image>
				<view class="movie-desc">
					<view class="movie-title">{{guess.name}}</view>
					<block v-if="guess.score >= 0">
						<trailerStars :innerScore="guess.score" showNum="0"></trailerStars>
					</block>
					<view class="movie-info">
						{{guess.baseInfo}}
					</view>
					<view class="movie-info">
						{{guess.releaseInfo}} 
					</view>
				</view>
				<view class="movie-oper" :data-guessIndex="index" @click="praiseMe">
					<image src="../../static/icos/praise.png" class="praise-icon"></image>
					<view class="praise-me">点赞</view>
					<view class="praise-me animation-opacity" 
					:animation="animationData" 
					>+1</view>
				</view>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	import common from '../../common/common.js'
	import data from '../../data/data.js'
	import trailerStars from '../../components/trailerStars.vue'
	export default {
		data() {
			return {
				carouselList:[],
				hotSuperHeroList:[],
				hotTrailerList: [],
				animationData: {},
				animationDataArr: [{},{},{},{},{}],
				animation: {},
				gessULikeList: []
			}
		},
		onLoad() {
			// var _self = this; //使用箭头函数不需要了
			// console.log(this.carouselList)
			// console.log(this.hotSuperHeroList)
			// console.log(this.hotTrailerList)
			// 轮播图
			uni.request({
			    url: common.serverURL +'index/carousel/list',
				method: "POST",
			    success: (res) => {
			        // console.log(res);
			        // console.log(res.data);
					if(res.data.state !== 200){
						// this.carouselList = res.data.data;
						this.carouselList = data.carouselList;
						// console.log(this.carouselList)
						
					}
			    },
				error: (err) =>{
					console.log(err)
				}
			});
			// 查询热门超英
			uni.request({
			    url: common.serverURL +'index/movie/hot?type=superhero',
				method: "POST",
			    success: (res) => {
			        // console.log(res);
			        // console.log(res.data);
					if(res.data.state !== 200){

						this.hotSuperHeroList = data.hotSuperHeroList;
						console.log(this.hotSuperHeroList)
						
					}
			    },
				error: (err) =>{
					console.log(err)
				}
			});
			
			// 查询热门预告
			uni.request({
			    url: common.serverURL +'index/movie/hot?type=trailer&qq=404107262',
				method: "POST",
			    success: (res) => {
			        // console.log(res);
			        // console.log(res.data);
					if(res.data.state !== 200){

						this.hotTrailerList = data.hotTrailerList;
						console.log(this.hotTrailerList)
						
					}
			    },
				error: (err) =>{
					console.log(err)
				}
			});
			this.refresh();
			// 在页面创建的时候,创建一个临时动画对象
			this.animation = uni.createAnimation({
				transformOrigin: "50% 50%",
				duration: 1000,
				timingFunction: "ease",
				delay: 0
			});
		},
		onUnload(){
			// 卸载的时候清除动画数据
			this.animationData = {};
			this.animationDataArr = [{},{},{},{},{}];
		},
		onPullDownRefresh(){
			this.refresh();
		},
		onShow(){
			// console.log('显示出来了')
		},
		onHide(){
			this.viedeoContent.pause();
		},
		methods: {
			meIsPlaying(e){
				// 播放视频暂停其他在播放的视频
				var me = this;
				if(e) {
					// debugger;
					var playIndex = e.currentTarget.dataset.playindex;
					// console.log(e.currentTarget);
					var id = e.currentTarget.id;
					// console.log(id);
					this.viedeoContent = uni.createVideoContext(id);
					// this.viedeoContent.play();
				}
				this.hotTrailerList.forEach(function(item,index){
					if(item.id != playIndex){
						uni.createVideoContext(item.id+'').pause();
					}
				});
			},
			refresh(){
				console.log('下拉刷新')
				let serverURL = common.serverURL;
				uni.showLoading({
					mask: true
				});
				uni.showNavigationBarLoading();//开启导航栏才有效果
				// 查询猜你喜欢
				uni.request({
				    url: serverURL +'/index/guessULike?qq=404107262',
					method: "POST",
				    success: (res) => {
				        // console.log(res);
				        // console.log(res.data);
						if(res.data.state !== 200){
				
							this.gessULikeList = data.gessULikeList;
							console.log(this.gessULikeList)
							
						}
				    },
					error: (err) =>{
						console.log(err)
					},
					complete:()=>{
						console.log('请求完成')
						uni.stopPullDownRefresh();
						setTimeout(function(){
							uni.hideLoading();
						}, 1000);
						uni.hideNavigationBarLoading();
						
					}
				});
			},
			praiseMe(e) {
				// console.log('点赞');
				var gIndex = parseInt(e.currentTarget.dataset.guessindex);
				// console.log(gIndex);
				
				this.animation.translateY(-80).opacity(1).step({duration: 1000});
				this.animationData = this.animation.export(); //没有使用数组时
				// this.animationData = this.animation;
				// this.animationDataArr[gIndex] = this.animationData.export();
				
				console.log(this.animation)
				console.log(this.animationData)
				console.log(this.animationDataArr)
				// 还原动画
				setTimeout(function(){
					this.animation.translateY(-50).opacity(0).step({duration:0});
					this.animationData = this.animation.export();
					// this.animationData = this.animation;
					// this.animationDataArr[gIndex] = this.animationData.export();
				}.bind(this),500);
				return;
			}
		},
		components: {
			trailerStars
		}
	}
</script>

<style>
	@import url("./index.css");
</style>
