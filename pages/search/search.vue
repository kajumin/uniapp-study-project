<template>
	<view class="page-block">
		<view class="search-block">
			<view class="search-ico-wapper"> 
				<image src="../../static/icos/search.png" class="search-ico"></image>
			</view>
			<input text="text" 
			class="search-text" 
			placeholder="搜索预告" 
			maxlength="10"
			confirm-type="search"
			@confirm="serverMe"
			/>
		</view>
		
		<view class="page-block movie-list">
			<view class="movie-wapper" v-for="(trailer,index) in trailerList" :key="index">
				<image 
				:src="trailer.cover"
				:data-trailerId="trailer.id"
				@click="showTrailer"
				 class="post"></image>
			</view>	
		</view>
		
		
	</view>
</template>

<script>
	import common from '../../common/common.js'
	import data from '../../data/data.js'
	export default {
		data() {
			return {
				trailerList: [],
				keywords: "",
				page: 1,
				totalpages: 1,
				tempList: []
			}
		},
		onLoad(){
			this.pagedTrailerList('',1,15);
			// let serverURL = common.serverURL;
			// uni.showLoading({
			// 	mask: true,
			// 	title: "请稍后!"
			// });
			// uni.showNavigationBarLoading();//开启导航栏才有效果
			// // 查询猜你喜欢
			// uni.request({
			// 	url: serverURL +'search/list',
			// 	method: "POST",
			// 	success: (res) => {
			// 		// console.log(res);
			// 		console.log(res.data);
			// 		if(res.data.state !== 200){
			// 			// debugger;
			// 			this.trailerList = data.trailerList.slice(0,15);
			// 			console.log(this.trailerList)
						
			// 		}
			// 	},
			// 	error: (err) =>{
			// 		console.log(err)
			// 	},
			// 	complete:()=>{
			// 		console.log('请求完成')
			// 		setTimeout(function(){
			// 			uni.hideLoading();
			// 		}, 1000);
			// 		uni.hideNavigationBarLoading();
					
			// 	}
			// });
			
		},
		onReachBottom(){
			this.page++;
			// this.keywords;
			if(this.page > this.totalpages){
				return;
			}
			this.pagedTrailerList(this.keywords,this.page,15);
		},
		methods: {
			showTrailer(e) {
				var trailerId = e.currentTarget.dataset.trailerid;
				uni.navigateTo({
					url: "../movie/movie?trailerId="+ trailerId
				});
					
				
			},
			pagedTrailerList(keywords,page,pageSize){
				let serverURL = common.serverURL;
				uni.showLoading({
					mask: true,
					title: "请稍后!"
				});
				uni.showNavigationBarLoading();//开启导航栏才有效果
				// 查询猜你喜欢
				uni.request({
					url: serverURL +'search/list?keywords='+keywords+'&page='+page+'&pageSize='+pageSize,
					method: "POST",
					success: (res) => {
						// console.log(res);
						console.log(res.data);
						if(res.data.state !== 200){
							// debugger;
							console.log(keywords,page,pageSize)
							if(keywords == '' || keywords == undefined) {
								//追加内容到已有列表中
								this.trailerList = this.trailerList.concat(data.trailerList.slice(page-1,pageSize));
								this.totalpages = data.trailerList.length / 9;
							}else{
								var filterList = data.trailerList.filter((item,index) => {
									return item.name.includes(keywords);
								});
								this.totalpages = this.filterList.length / 9;
								//追加内容到已有列表中
								this.trailerList = this.trailerList.concat(filterList).slice(page-1,pageSize);
								console.log(this.trailerList);
							}
							console.log(this.totalpages)
							
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
						
					}
				});
			},
			serverMe(e) {
				this.keywords = e.detail.value;
				this.trailerList = [];
				this.pagedTrailerList(this.keywords,1,15);
			}
		}
	}
</script>

<style>
	@import url("search.css");
</style>
