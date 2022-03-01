<template>
	<view class="container">
		<div class="container1">
			<div>
				<div class="headImg" v-if="avatarUrl">
					<img :src="avatarUrl"  style="width: 100%;height: 100%">
				</div>
				<div class="searchInpt">
					<icon type="search" size="16"></icon>
					<input type="text" class="input" v-model="search" placeholder="请输入关键字" confirm-type="search" @confirm="getList()">
					<icon type="cancel" size="16" color="#333" style="transform: translateX(-10px);z-index: 1000;" v-if="search" @click="reset"></icon>
				</div>
			</div>
			<div class="box" style="padding: 0 10px;">
				<div class="types" style="padding: 0 10px">
					<div v-for="(item, i) in typeList" :key="i" @click="selectType(item)" style="padding: 0 10px">
						<p class="typeTitle" :class="{selected: item.select}" @click="chose(i)">{{item.title}}</p>
					</div>
				</div>
			</div>
		</div>
		<div style="margin-top: 100px">
			<scroll-view style="height: calc( 100vh - 130px )" :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltoupper="upper" @scrolltolower="lower"
				@scroll="scroll">
				<div class="body">
				<div style="border-radius: 5px;overflow: hidden;">
					<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" indicator-color="rgba(255, 255, 255, 0.5)" indicator-active-color="#fff">
						<swiper-item v-for="(item, i) in swiperList" :key="i" @click="watchVideo(item)">
							<img :src="imgUrl+item.Cover" style="width: 100%">
							<p class="swiperTitle" style="width: 76%">{{item.Titel}}</p>
						</swiper-item>
					</swiper>
				</div>
				<div class="videos">
					<div class="item" v-for="(item, i) in videoList" :key="i" @click="watchVideo(item)">
						<img :src="imgUrl+item.Cover" style="width: 100%;height: 100px;display: block;">
						<p style="overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">{{item.Titel}}</p>
					</div>
				</div>
			</div>
			</scroll-view>
		</div>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				avatarUrl: '',
				url: 'https://www.epoia.cn',
				fileUrl: 'https://www.epoia.cn/Data',
				imgUrl: 'https://www.epoia.cn/Image/',
				videoUrl: 'https://www.epoia.cn/Data/Video/',
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
						title: '科技',
						select: true,
						value: 0
					},
					{
						title: '服饰',
						select: false,
						value: 1
					},
					{
						title: '美食',
						select: false,
						value: 2
					},
				],
				swiperList: [],
				videoList: []
			}
		},
		onLoad() {
			this.getList()
		},
		onShow() {
			var _that = this
			uni.getStorage({
				key: 'avatarUrl',
				success(res) {
					_that.avatarUrl = res.data
				}
			})
		},
		created() {

		},
		methods: {
			reset() {
				this.search = ''
			},
			selectType(e) {
				this.page.page = 1
				this.page.row = 20
				this.search = ''
				this.videoType = e.value
				this.getList()
			},
			scroll() {
				
			},
			lower() {
				this.page.page += 1
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
							_this.videoList.push.apply(_this.videoList, res.data.Data.list);
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
			upper() {
				this.page.page = 1
				this.getList()
			},
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
							_this.search = ''
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
	  overflow:hidden;
	  text-overflow:ellipsis;
	  white-space:nowrap
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
			padding: 3px 10px;
			line-height: 44rpx;
		}
		.tag{
			color: rgb(249,201,62);
			font-size: 32rpx;
			padding: 0 10px;
			margin-top: 40rpx
		}
	}
	.container1{
		width: calc( 100% - 20px ) ;
		position: fixed;

	}
	.container1>div{
		display: flex;
		padding: 10px 10px;
		align-items: center;
		background: #fff;
		border-radius: 5px;

	}
	.headImg{
		width: 90rpx;
		height:90rpx;
		border-radius: 50%;
		border:1px solid #ccc;
		margin-right:10px;
		overflow: hidden;
	}
	.searchInpt{
		background: #eee;
		height: 30px;
		border-radius: 20px;
		display: flex;
		padding-left:10px;
		align-items: center;
		input{
			margin-left:10px;
			font-size: 12px;
		}
	}
</style>
