<template>
	<view>
		<scroll-view style="height: 100vh" :scroll-top="scrollTop" scroll-y="true" class="scroll-Y" @scrolltoupper="upper" @scrolltolower="lower"
			@scroll="scroll">
		<div class="container">
			<div v-for="(item, i) in videoList" class="item" :key="i">
				<div class="img">
					<img :src="imgUrl+item.Cover" alt="">
				</div>
				<div style="margin-left: 20px">
					<p class="title">{{item.Titel}}</p>
					<p style="margin-right: 30px;margin-top:10px" >{{item.Price}}元</p>
					<div class="buy">
						<div style="padding: 5px 20px;color: #fff;background: #F0AD4E;border-radius: 20px;font-size: 32rpx">
							前往购买
						</div>
					</div>
				</div>
			</div>
		</div>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				imgUrl: 'https://www.epoia.cn/Image/',
				videoList: [],
				url: 'https://www.epoia.cn',
				videoType: 0,
				page: {
					page: 1,
					row: 20,
					total: 0
				},
				search: ''
			};
		},
		onLoad() {
			this.getList()
		},
		methods:{
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
		}
	}
</script>

<style lang="scss">
	.container{
		padding: 0 20rpx
	}
	.item{
		margin-top: 20rpx;
		border-radius: 20rpx;
		background: #fff;
		padding: 40rpx;
		display: flex;
	}
	.item> .img{
		width: 240rpx;
		height: 240rpx;
		overflow: hidden;
		img{
			display: block;
			width: 100%;
			height: 100%
		}
	}
	.title{
	}
	.buy{
		display: flex;
		margin-top: 20px
	}
</style>
