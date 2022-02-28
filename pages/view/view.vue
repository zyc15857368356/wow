<template>
	<view class="container"  @touchmove.catch="handletouchmove" @touchstart="handletouchstart" @touchend="handletouchend">
<!-- 		<div class="videoTop">
			<video :src="fileUrl+video.Path" style="width: 100%" autoplay controls show-play-btn auto-pause-if-navigate></video>
		</div> -->
		<div class="video" :style="{top: domY ? domY + 'px': '50%'}">
			<video :src="fileUrl+video.Path" style="width: 100%" autoplay controls show-play-btn auto-pause-if-navigate></video>
		</div>
<!-- 		<div class="videoBottom">
			<video :src="fileUrl+video.Path" style="width: 100%" autoplay controls show-play-btn auto-pause-if-navigate></video>
		</div> -->
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
				<img :src="shopping? '../../static/carSelect.png':'../../static/car.png'">
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
				shopping: false,
				path: '',
				id: null,
				token: null,
				memberId: null,
				video: {},
				startX: 0,
				startY: 0,
				next: {},
				prev: {},
				domY: null,
				domStartY: null,
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
			debounce(fn,wait){
				var timer = null;
				return () => {
					if(timer !== null){
						clearTimeout(timer);
					}
					timer = setTimeout(fn,wait);
				}
			},
			handletouchend(e) {
				console.log(this.domY)
				if (this.domY < 20) {
					console.log(12313)
					this.domY = -200
					
					return
				}
				if (this.domY > 520) {
					console.log(45646)
					this.domY = 700
					return
				}
				if (this.domY > 80 || this.domY < 420) {
					console.log(78979)
					this.domY = this.domStartY
					return
				}
			},
			handletouchstart(e) {
				e.preventDefault();
				this.startX = e.touches[0].pageX;
				this.startY = e.touches[0].pageY;
				let video = uni.createSelectorQuery().in(this).select("#video")
				setTimeout(() => {
					video.boundingClientRect(data => {
						this.domY = data.top + (data.height / 2)
						this.domStartY = data.top + (data.height / 2)
					}).exec()
				}, 100)
			},
			handletouchmove(e) {
				// e.preventDefault();
				this.domY = this.domStartY
				let video = uni.createSelectorQuery().in(this).select("#video")
				let moveEndX = e.changedTouches[0].pageX;
				let moveEndY = e.changedTouches[0].pageY;
				let X = moveEndX - this.startX;
				let Y = moveEndY - this.startY;
				if ( Math.abs(Y) > Math.abs(X) && Y > 0) {
					// console.log("down")
					this.domY += Y
					// console.log(this.domY)
				} else if ( Math.abs(Y) > Math.abs(X) && Y < 0 ) {
					// console.log("up");
					this.domY += Y
					// console.log(this.domY)
				}
				// console.log(this.domY)
			},
			handle(X, Y) {

			},
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
							_this.video = res.data.Data.model
							_this.like = res.data.Data.thumbs
							_this.collect = res.data.Data.collections
							_this.shopping = res.data.Data.shopping
							_this.next = res.data.Data.nextmodel
							_this.prev = res.data.Data.prevmodel
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
							Type: 3
						},
						success(res) {
							if (res.data.Success) {
								_this.shopping = !_this.shopping
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
		transform: translateY(-50%);
		transition: top 0.3s;
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
	.videoTop{
		top: -300px;
		width: 100%;
		position: absolute;
		left: 0;
		transform: translateY(-50%);
		transition: top 0.3s;
	}
	.videoBottom{
		top: 900px;
		width: 100%;
		position: absolute;
		left: 0;
		transform: translateY(-50%);
		transition: top 0.3s;
	}
</style>
