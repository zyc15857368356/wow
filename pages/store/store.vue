<template>
	<view>
		<div class="container">
			<div v-for="(item, i) in videoList" class="item" :key="i">
				<div class="img">
					<img :src="fileUrl + item.Cover">
				</div>
				<div>
					<p class="title">{{item.Titel}}</p>
					<div class="buy">
						<p style="margin-right: 30px">{{item.Price}}</p>
						<div style="padding: 5px 20px;color: #fff;background: #F0AD4E;border-radius: 20px;font-size: 32rpx">前往购买</div>
					</div>
				</div>
			</div>
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page: {
					page: 1,
					row: 20,
					total: 0
				},
				url: 'http://124.71.148.15:8004',
				fileUrl: 'http://124.71.148.15:8004/Data',
				search: '',
				videoList:[],
				goods: [
					{
						imgUrl: '',
						title: 'asdaasd',
						price: 20
					},
					{
						imgUrl: '',
						title: 'asdasdasd',
						price: 20
					},
					{
						imgUrl: '',
						title: 'asdasdasd',
						price: 20
					},
				]
			};
		},
		created() {
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
		justify-content: space-between;
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
		height: 180rpx
	}
	.buy{
		display: flex;
	}
</style>
