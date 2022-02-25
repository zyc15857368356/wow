<template>
	<view class="container">
		<div class="video">
			<video :src="fileUrl+video.Path" style="width: 100%" autoplay controls show-play-btn auto-pause-if-navigate></video>
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
				url: 'https://www.epoia.cn',
				fileUrl: 'https://www.epoia.cn/Video/',
				autoplay: true,
				like: false,
				collect: false,
				car: false,
				path: '',
				id: null,
				token: null,
				memberId: null,
				video: {}
			}
		},
		onLoad(option) {
			this.path = option.path
			this.id = option.id
		},
		
		onShow() {
			var that = this
			uni.getStorage({
				key: "token",
				success(res) {
					that.token = res.data
				}
			})
			uni.getStorage({
				key: "memberId",
				success(res) {
					that.memberId = res.data
				}
			})
			this.getVideoInfo()
		},
		methods: {
			getVideoInfo() {
				new Promise((resolve, reject) => {
					let mId = ''
					uni.getStorage({
						key: "memberId",
						success(res) {
							mId = res.data
							resolve(mId)
						},
						fail() {
							uni.showToast({
								title: "请登录",
								icon: "none"
							})
						}
					})
				}).then(response => {
					var _this = this
					uni.request({
						url: this.url + '/Home/GetVideoInfo',
						methods: 'GET',
						data:{
							id: this.id,
							memberId: response
						},
						success(res) {
							_this.video = res.data.Data.model[0]
							_this.like = res.data.Data.thumbs
							_this.collect = res.data.Data.collections
							console.log(_this.video)
						}
					})
				})
			},
			addLike() {
				var _this = this
				if (!this.memberId) {
					uni.showToast({
						title: '请先完成登录后再试',
						icon: 'none'
					})
				} else {
					uni.request({
						url: this.url + '/Home/AddVideoInfo',
						method: 'POST',
						data: {
							MemberId: this.memberId,
							VideoId: this.id,
							Type: 0
						},
						success(res) {
							if (res.data.Success) {
								_this.like = !_this.like
							} else {
								uni.showToast({
									title:res.data.Message,
									icon: "none"
								})
							}
						}
					})
				}
			},
			addCollect() {
				var _this = this
				console.log(this.memberId)
				if (!this.memberId) {
					uni.showToast({
						title: '请先完成登录后再试',
						icon: 'none'
					})
				} else {
					uni.request({
						url: this.url + '/Home/AddVideoInfo',
						method: 'POST',
						data: {
							MemberId: this.memberId,
							VideoId: this.id,
							Type: 1
						},
						success(res) {
							if (res.data.Success) {
								_this.collect = !_this.collect
							} else {
								uni.showToast({
									title:res.data.Message,
									icon: "none"
								})
							}
						}
					})
				}
			},
			addBuy() {
				var _this = this
				if (!this.memberId) {
					uni.showToast({
						title: '请先完成登录后再试',
						icon: 'none'
					})
				} else {
					uni.request({
						url: this.url + '/Home/AddVideoInfo',
						method: 'POST',
						data: {
							MemberId: this.memberId,
							VideoId: this.id,
							Type: 2
						},
						success(res) {
							if (res.data.Success) {
								_this.car = !_this.car
							} else {
								uni.showToast({
									title:res.data.Message,
									icon: "none"
								})
							}
						}
					})
				}
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
		bottom: 21px;
		right: 17px;
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
