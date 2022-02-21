<template>
	<view class="container">
		<div class="video">
			<video :src="fileUrl+path" style="width: 100%" autoplay controls show-play-btn auto-pause-if-navigate></video>
		</div>
		<div class="handle">
			<div @click="addLike">
				<img :src="like? '../../static/heartSelected.png' : '../../static/heart.png'">
				<p>喜欢</p>
			</div>
			<div @click="addCollect">
				<img :src="collect?'../../static/collectSelect.png': '../../static/collect.png'">
				<p>收藏</p>
			</div>
			<div @click="addBuy">
				<img :src="car? '../../static/carSelect.png':'../../static/car.png'">
				<p>买它</p>
			</div>
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				url: 'http://124.71.148.15:8004',
				fileUrl: 'http://124.71.148.15:8004/Data/',
				autoplay: true,
				like: false,
				collect: false,
				car: false,
				path: '',
				id: null,
				token: null
			}
		},
		onLoad(option) {
			this.path = option.path
			this.id = option.id
			var _this = this
			uni.getStorage({
				key: "token",
				success(res) {
					_this.token = res.data
				}
			})
		},
		methods: {
			addLike() {
				if (!this.token) {
					uni.showToast({
						title: '请先完成登录后再试',
						icon: 'none'
					})
				} else {
					uni.request({
						url: this.url + '/Home/AddVideoInfo'
					})
				}
				this.like = !this.like
			},
			addCollect() {
				if (!this.token) {
					uni.showToast({
						title: '请先完成登录后再试',
						icon: 'none'
					})
				}
				this.collect = !this.collect
			},
			addBuy() {
				if (!this.token) {
					uni.showToast({
						title: '请先完成登录后再试',
						icon: 'none'
					})
				}
				this.car = !this.car
			}
		}
	}
</script>


<style lang="scss">
	page{
		background: rgba(0,0,0, .8);
		overflow: hidden;
	}
	.container{
		height: 100%;
		position: relative;
	}
	.video{
		width: 100%;
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
	}
	.handle{
		position: absolute;
		bottom: 10px;
		right: 0;
		&>div{
			p{
				color: #fff;
				font-size: 32rpx;
			}
			img{
				display: block;
				width: 60rpx;
				height: 60rpx;
			}
		}
	}
</style>
