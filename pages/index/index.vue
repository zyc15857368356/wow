<template>
	<view class="container">
		<search></search>
		<div class="box">
			<div class="types">
				<div v-for="(item, i) in typeList" :key="i">
					<p class="typeTitle" :class="{selected: item.select}" @click="chose(i)">{{item.title}}</p>
				</div>
			</div>
		</div>
		<div class="body">
			<div style="border-radius: 5px;overflow: hidden;">
				<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" indicator-color="rgba(255, 255, 255, 0.5)" indicator-active-color="#fff">
					<swiper-item v-for="(item, i) in swiperList" :key="i">
						<img :src="fileUrl+item.Cover">
						<p class="swiperTitle">{{item.Titel}}</p>
					</swiper-item>
				</swiper>
			</div>
			<div class="videos">
				<div class="item" v-for="(item, i) in videoList" :key="i" @click="watchVideo(item)">
					<img src="../../static/cover.png" style="width: 100%;height: 100px;display: block;">
					<p>{{item.Titel}}</p>
					<!-- <p class="tag">{{item.tag}}</p> -->
				</div>
			</div>
		</div>
	</view>
</template>

<script>
	import search from "../../components/search/search.vue"
	export default {
		components: {
			search
		},
		data() {
			return {
				url: 'http://124.71.148.15:8004',
				fileUrl: 'http://124.71.148.15:8004/Data',
				indicatorDots: true,
				autoplay: true,
				title: 'Hello',
				page: {
					page: 1,
					row: 20,
					total: 0
				},
				videoType: 0,
				search: '',
				typeList: [
					{
						title: '直播',
						select: true
					},
					{
						title: '热门',
						select: false
					},
					{
						title: '科技',
						select: false
					},
					{
						title: '游戏',
						select: false
					},
					{
						title: '游戏',
						select: false
					},
					{
						title: '游戏',
						select: false
					},
					{
						title: '游戏',
						select: false
					},
					{
						title: '游戏',
						select: false
					},
					{
						title: '游戏',
						select: false
					},
					{
						title: '游戏',
						select: false
					},
					{
						title: '游戏',
						select: false
					},
				],
				swiperList: [],
				videoList: []
			}
		},
		onLoad() {
			this.getList()
		},
		methods: {
			getList() {
				let data = {
					pageIndex: this.page.page,
					pageSize: this.page.row,
					search: this.search,
					videoType: this.videoType
				}
				var _this = this
				uni.request({
					url: this.url + '/Home/GetVideoList',
					method: 'GET',
					data: data,
					success(res) {
						if(res.data.Success) {
							_this.videoList = res.data.Data.list
							_this.swiperList = res.data.Data.recomd
						} else {
							uni.showToast({
								title: res.data.Message,
								icon:'none',
								duration: 2000
							});
						}
					},
					fail(res) {
						uni.showToast({
							title: res.data.Message,
							icon:'none',
							duration: 2000
						});
					}
				})
			},
			watchVideo(e) {
				uni.navigateTo({
					url: '../view/view?path='+e.Path+'&id='+e.Id,
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			chose(e){
				for(let  i = 0; i < this.typeList.length; i++) {
					this.typeList[i].select = false
				}
				this.typeList[e].select = true
			}
		}
	}
</script>

<style lang="scss">
	.box{
		height: 35px;
		overflow: hidden;
		padding: 0 10px;
		background: #fff;
	}
	.types{
		display: flex;
		overflow-x: scroll;
		padding-bottom: 25px;
		&>div{
			.typeTitle{
				width: 40px;
				padding: 5px 10px
			}
		}
	}
	.selected{
		color: #FFC0CB
	}
	.body{
		padding: 10px;
	}
	.container{
		padding: 10px;
	}
	.swiper{
		position: relative;
	}
	wx-swiper .wx-swiper-dot {
		position: relative;
		left: unset;
		right: -200rpx;
	}
	.swiperTitle{
	  position: absolute;
	  bottom: 0rpx;
	  padding-left: 10px;
	  color: #fff;
	  width: 100%;
	  height: 30px;
	  padding-top: 10px;
	  background-image: linear-gradient(to top, rgba(0, 0, 0, .3), rgba(0, 0, 0, 0));
	}
	.videos{
		display:flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}
	.videos>.item{
		margin: 20rpx 0;
		width: 49%;
		background: #fff;
		border-radius: 5px;
		padding-bottom: 10px;
		p{
			font-size: 32rpx;
			padding: 10px;
			line-height: 44rpx;
		}
		.tag{
			color: rgb(249,201,62);
			font-size: 32rpx;
			padding: 0 10px;
			margin-top: 40rpx
		}
	}
</style>
