<template>
	<view class="container">
		<div class="container1">
			<div>
				<div class="headImg" v-if="avatarUrl">
					<img :src="avatarUrl" style="width: 100%;height: 100%">
				</div>
				<div class="searchInpt">
					<icon type="search" size="16"></icon>
					<input type="text" class="input" v-model="search" placeholder="请输入关键字" confirm-type="search"
						@confirm="getList()">
					<icon type="cancel" size="16" color="#333" style="transform: translateX(-10px);z-index: 1000;"
						v-if="search" @click="reset"></icon>
				</div>
			</div>
			<div class="box" style="padding: 0 5px;border-radius: 0;border-bottom-left-radius: 5px;border-bottom-right-radius: 5px;">
				<div class="types" style="padding: 0 0px;">
					<div v-for="(item, i) in typeList" :key="i" @click="selectType(item)" style="padding: 0 10px;">
						<p class="typeTitle" :class="{selected: item.select}" @click="chose(i)" style="font-size: 32rpx;min-width: 64px;"
						>{{item.Name}}</p>
					</div>
				</div>
			</div>
		</div>
		<div style="margin-top: 85px">
			<scroll-view style="height: calc( 100vh - 105px )" :scroll-top="scrollTop" scroll-y="true" class="scroll-Y"
				@scrolltoupper="upper" @scrolltolower="lower" @scroll="scroll">
				<div class="body">
					<div style="border-radius: 3px;overflow: hidden;">
						<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay"
						style="height: 200px"
							indicator-color="rgba(255, 255, 255, 0.5)" indicator-active-color="#fff">
							<swiper-item v-for="(item, i) in swiperList" :key="i" @click="watchVideo(item)">
								<img :src="imgUrl+item.Cover" style="width: 100%">
								<div class="swiperTitle" style="width: 100%">
									<p style="width: 70%;height: 30px;line-height: 30px;">{{item.Titel}}</p>
								</div>
							</swiper-item>
						</swiper>
					</div>
					<div class="videos">
						<div class="item" v-for="(item, i) in videoList" :key="i" @click="watchVideo(item)" style="overflow: hidden;">
							<div style="position: relative;height: 105px">
								<img :src="imgUrl+item.Cover" style="width: 100%;height:105px;display: block;">
								<div class="curtain" style="width: 100%;position: absolute;bottom: 0%;left: 0;height: 28px;z-index: 100;display: flex;justify-content: space-between;padding: 0 5px;box-sizing: border-box;">
									<div style="display: flex;align-items: center;">
										<img style="width: 15px;height: 15px" src="../../static/play.png">
										<p style="color: #fff;padding: 0;margin-left: 5px;font-weight: 100;">{{item.Volume}}</p>
									</div>
									<p style="font-size: 24rpx;color:#fff;padding: 0;font-weight: 100;line-height: 28px;">{{item.Duration | timeFilter}}</p>
								</div>
							</div>
							<p
								style="overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;min-height: 33px;margin-top: 20rpx;font-size: 28rpx;">
								{{item.Titel}}
							</p>
							<p style="font-size: 24rpx;color: #999;margin-top: 10px">{{item.Name}}</p>
						</div>
					</div>
				</div>
			</scroll-view>
		</div>

	</view>
</template>

<script>
	import { formatSeconds } from '../../util/index.js'
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
				typeList: [],
				swiperList: [],
				videoList: []
			}
		},
		onLoad() {

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
			this.getTypeList()
		},
		filters:{
			timeFilter(newVal) {
				return formatSeconds(newVal)
			}
		},
		methods: {
			reset() {
				this.search = ''
				this.getList()
			},
			selectType(e) {
				this.page.page = 1
				this.page.row = 20
				this.search = ''
				this.id = e.Id
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
						if (res.data.Success) {
							_this.videoList.push.apply(_this.videoList, res.data.Data.list);
						} else {
							uni.showToast({
								title: res.data.Message,
								icon: 'none',
								duration: 2000
							});
						}
					},
					fail(res) {
						uni.showToast({
							title: res.data.Message,
							icon: 'none',
							duration: 2000
						});
					}
				})
			},
			upper() {
				this.page.page = 1
				this.getList()
			},
			getTypeList() {
				var _this = this
				uni.request({
					url: this.url + '/Home/GetVideoType',
					method: 'GET',
					data: {},
					success(res) {
						if (res.data.Success) {
							_this.typeList = res.data.Data
							_this.typeList.forEach(item => {
								item.select = false
							})
							_this.typeList[0].select = true
							_this.videoType = _this.typeList[0].Id
							_this.getList()
						}
					},
					fail(res) {
						uni.showToast({
							title: res.data.Message,
							icon: 'none'
						})
					}
				})
			},
			getList() {
				let data = {
					pageIndex: this.page.page,
					pageSize: this.page.row,
					search: this.search,
					videoTypeId: this.videoType
				}
				var _this = this
				uni.request({
					url: this.url + '/Home/GetVideoList',
					method: 'GET',
					data: data,
					success(res) {
						if (res.data.Success) {
							_this.videoList = res.data.Data.list
							_this.swiperList = res.data.Data.recomd
						} else {
							uni.showToast({
								title: res.data.Message,
								icon: 'none',
								duration: 2000
							});
						}
					},
					fail(res) {
						uni.showToast({
							title: res.data.Message,
							icon: 'none',
							duration: 2000
						});
					}
				})
			},
			watchVideo(e) {
				console.log(e)
				uni.navigateTo({
					url: '../view/view?path=' + e.Path + '&id=' + e.Id + '&type=' + this.videoType,
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			chose(e) {
				for (let i = 0; i < this.typeList.length; i++) {
					this.typeList[i].select = false
				}
				this.typeList[e].select = true
				this.videoType = this.typeList[e].Id
				this.getList()
			}
		}
	}
</script>

<style lang="scss">
	.box {
		height: 40px;
		overflow: hidden;
		padding: 0 5px;
		background: #fff;

	}

	.types {
		display: flex;
		overflow-x: scroll;
		height: 45px;
		transform: translateY(6px);

		&>div {
			.typeTitle {
				padding: 5px 0px;
				color:#666
			}
		}
	}

	.selected {
		color: #EB8E18!important;
		font-weight:bold;
		border-bottom: 5px solid #EB8E18;
	}

	.body {
		padding: 10px 5px;
	}

	.container {
		padding: 5px;
	}

	.swiper {
		position: relative;
	}

	wx-swiper .wx-swiper-dot {
		position: relative;
		left: unset;
		right: -200rpx;
	}

	.swiperTitle {
		position: absolute;
		bottom: 0rpx;
		padding-left: 10px;
		color: #fff;
		width: 100%;
		height: 30px;
		padding-top: 10px;
		background-image: linear-gradient(to top, rgba(0, 0, 0, .6), rgba(0, 0, 0, 0));
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 30rpx;
	}

	.videos {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.videos>.item {
		margin: 20rpx 0 0;
		width: 49%;
		background: #fff;
		border-radius: 3px;
		padding-bottom: 10rpx;
		p {
			font-size: 24rpx;
			padding: 0px 10px;
			line-height: 40rpx;
		}

		.tag {
			color: rgb(249, 201, 62);
			font-size: 32rpx;
			padding: 0 10px;
			margin-top: 40rpx
		}
	}

	.container1 {
		width: calc(100% - 10px);
		position: fixed;

	}

	.container1>div {
		display: flex;
		padding: 5px 10px 0;
		align-items: center;
		background: #fff;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;	
	}

	.headImg {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		border: 1px solid #ccc;
		margin-right: 10px;
		overflow: hidden;
	}

	.searchInpt {
		background: #eee;
		height: 32px;
		border-radius: 20px;
		display: flex;
		padding-left: 10px;
		align-items: center;
		width: 200px;
		input {
			margin-left: 10px;
			font-size: 12px;
			color: transparentize($color: #000000, $amount: 0);
		}
	}
	.curtain{
		background-image: linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0, 0));
	}
</style>
