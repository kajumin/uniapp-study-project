<template>
	<view class="page">
		<!-- 视频播放 -->
		<view class="play">
			<video 
			:src="trailerInfo.trailer"
			:poster="trailerInfo.cover"
			class="movie"
			id="myTrailer"
			controls></video>
		</view>
		<!-- 影片基本信息 -->
		<view class="movie-info">
			<navigator :url="'../cover/cover?cover='+ trailerInfo.cover">
				<image 
				:src="trailerInfo.cover"
				class="cover"
				></image>
			</navigator>
			
			<view class="movie-desc">
				<view class="movie-title">{{trailerInfo.name}}</view>
				<view class="movie-basic-info">{{trailerInfo.basicInfo}}</view>
				<view class="movie-basic-info">{{trailerInfo.originalName}}</view>
				<view class="movie-basic-info">{{trailerInfo.totalTime}}</view>
				<view class="movie-basic-info">{{trailerInfo.releaseDate}}</view>
				<view class="score-block">
					<view class="big-score">
						<view class="score-words">综合评分:</view>
						<view class="movie-score">{{trailerInfo.score}}</view>
					</view>
					<view class="score-stars">
						<block v-if="trailerInfo.score >= 0">
							<trailerStars :innerScore="trailerInfo.score" showNum="0"></trailerStars>
						</block>
						<view class="prise-counts">{{trailerInfo.prisedCounts}} 人</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="line-wrapper">
			<view class="line"></view>
		</view>
		<!-- 剧情介绍 -->
		<view class="plots-block">
			<view class="plots-title">
				剧情介绍
			</view>
			<view class="plots-desc">
				{{trailerInfo.plotDesc}}
			</view>
		</view>
		
		<!-- 演职人员 -->
		<view class="scroll-block">
			<view class="plots-title">演职人员</view>
			<scroll-view class="scroll-list" scroll-x="true">
				<view v-for="(director,index) in directorArr" class="actor-wapper">
					<image 
					:src="director.photo"
					:key="director.id"
					mode="aspectFill"
					class="single-actor"
					@click="lookStaffs"
					:data-staffIndex="index"
					></image>
					<view class="actor-name">{{director.name}}</view>
					<view class="actor-role">{{director.actName}}</view>
				</view>
				<view v-for="(actor,index) in actorArr" class="actor-wapper">
					<image 
					:src="actor.photo"
					:key="actor.id"
					mode="aspectFill"
					class="single-actor"
					@click="lookStaffs"
					:data-staffIndex="index + directorArr.length"
					></image>
					<view class="actor-name">{{actor.name}}</view>
					<view class="actor-role">{{actor.actName}}</view>
				</view>
			</scroll-view>
		</view>
		
		<!-- 剧照 -->
		<view class="scroll-block">
			<view class="plots-title">剧照</view>
			<scroll-view class="scroll-list" scroll-x="true">
				<image 
				v-for="(img,index) in plotPicsArr"
				:src="img"
				:key="img.id"
				:data-imageIndex="index"
				mode="aspectFill"
				class="plot-image"
				@click="lookMe"
				></image>
			</scroll-view>
		</view>
		
	</view>
</template>

<script>
	import trailerStars from '../../components/trailerStars.vue'
	import data from '../../data/data.js'
	import common from '../../common/common.js'
	export default {
		data() {
			return {
				trailerInfo: {},
				plotPicsArr: [],
				directorArr: [],
				actorArr: [] 
			}
		},
		onReady(){
			// 页面初次加载完成  获得视频上下文
			this.videoContent = uni.createVideoContext("myTrailer");
		},
		onHide(){
			this.videoContent.pause();
		},
		onShow(){
			console.log('播放视频')
			if(this.videoContent){
				this.videoContent.play();
			}	
		},
		onNavigationBarButtonTap(e){
			var me = this;
			var index = e.index;
			console.log(index);
			if(index == 0){
				// 分享
				uni.share({
				    provider: "weixin",
				    scene: "WXSceneSession",
				    type: 0,
				    href: "http://localhost:8080/#/pages/movie/movie?trailerId=" + me.trailerInfo.id,
				    title: "NEXT超英预告: <<"+ me.trailerInfo.name + ">>",
				    summary: "NEXT超英预告: <<"+ me.trailerInfo.name + ">>",
				    imageUrl: me.trailerInfo.cover,
				    success: function (res) {
				        console.log("success:" + JSON.stringify(res));
				    },
				    fail: function (err) {
				        console.log("fail:" + JSON.stringify(err));
				    }
				});
			}
		},
		onShareAppMessage(res){
		
			return {
			      title: this.trailerInfo.name,
			      path: '/pages/movie/movie?trailerId=' + this.trailerInfo.id
			}
		},
		onLoad(params){
			
			//通过api修改导航栏样式
			uni.setNavigationBarColor({
				frontColor: "#ffffff",
				backgroundColor: "#000"
			});
			// debugger;
			var trailerId = parseInt(params.trailerId);
			// console.log(trailerId)
			// console.log(data.trailerList)
			
			let serverURL = common.serverURL;
			
			uni.showLoading({
				mask: true
			});
			uni.showNavigationBarLoading();//开启导航栏才有效果
			// 预告片信息
			uni.request({
				url: serverURL +'/search/trailer/'+ trailerId,
				method: "POST",
				success: (res) => {
					// console.log(res);
					// console.log(res.data);
					if(res.data.state !== 200){
						// debugger;
						this.trailerInfo = data.trailerList.find(function(item,index){
							// console.log(index) // 0 1
							return item.id == trailerId;
						});
						console.log(this.trailerInfo)
						// console.log(this.trailerInfo.plotPics)
						this.plotPicsArr = JSON.parse(this.trailerInfo.plotPics);
						console.log(this.plotPicsArr);	
						console.log(this.trailerInfo);	
					}
				},
				error: (err) =>{
					console.log(err)
				},
				complete:()=>{
					console.log('请求完成')
					setTimeout(function(){
						uni.hideLoading();
					}, 1000);
					uni.hideNavigationBarLoading();
					
				},
			});
			// 导演
			uni.request({
				url: serverURL +'/search/staff/'+ trailerId + '/1',
				method: "POST",
				success: (res) => {
					// console.log(res);
					// console.log(res.data);
					if(res.data.state !== 200){
						// debugger;
						this.directorArr.push(data.directorList.find(function(item,index){
							// console.log(index) // 0 1
							return item.staffId == trailerId  && item.role == 1;
						}));
						console.log(this.directorArr);	
					}
				},
				error: (err) =>{
					console.log(err)
				},
				complete:()=>{
					console.log('请求完成')
					setTimeout(function(){
						uni.hideLoading();
					}, 1000);
					uni.hideNavigationBarLoading();
					
				},
			});
			// 演员
			uni.request({
				url: serverURL +'/search/staff/'+ trailerId + '/1',
				method: "POST",
				success: (res) => {
					// console.log(res);
					// console.log(res.data);
					if(res.data.state !== 200){
						// debugger;
						
						this.actorArr = data.actorList.filter(function(item,index){
							// console.log(index) // 0 1
							return item.staffId == trailerId && item.role == 2;
						});
						console.log(this.actorArr);	
					}
				},
				error: (err) =>{
					console.log(err)
				},
				complete:()=>{
					console.log('请求完成')
					setTimeout(function(){
						uni.hideLoading();
					}, 1000);
					uni.hideNavigationBarLoading();
					
				},
			});
			
		},
		methods: {
			lookMe(e) {
				var imageindex = parseInt(e.currentTarget.dataset.imageindex);
				console.log(imageindex);
				console.log(this.plotPicsArr);
				uni.previewImage({
					current: this.plotPicsArr[imageindex],
					urls: this.plotPicsArr
				});
			},
			lookStaffs(e) {
				var staffindex = parseInt(e.currentTarget.dataset.staffindex);
				console.log(staffindex);
				var totalList = this.directorArr.concat(this.actorArr);
				var urls = [];
				totalList.forEach((item,index)=>{
					urls.push(item.photo)
				});
				console.log(urls)
				uni.previewImage({
					current: urls[staffindex],
					urls: urls
				});
			}
		},
		components:{
			trailerStars
		}
	}
</script>

<style>
	@import url("movie.css");
</style>
