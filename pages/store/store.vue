<template>
	<view>
		<div class="container">
			<div v-for="(item, i) in goods" class="item" :key="i">
				<div class="img">
					<img src="../../static/cover.png" alt="">
				</div>
				<div>
					<p class="title">{{item.title}}</p>
					<div class="buy">
						<p style="margin-right: 30px">{{item.price}}</p>
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
