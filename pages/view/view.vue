<template>
	<view class="container uni-padding-wrap">
		<div class="page-section swiper">
			<swiper class="swiper" @change="changefun" @animationfinish="animationfinishfun" :current="0"
				:vertical="true" :circular="true">
				<swiper-item v-for="(item, i) in PayVideo" :key="i" :id="'id' + i">
					<view class="swiper-item">
						<video :custom-cache="false" loop="true" class="video" :id="'id'+i" :enable-play-gesture="true"
							:enable-progress-gesture="true" :controls="false" :src="fileUrl+ item.Path"
							:show-center-play-btn="false">

						</video>
					</view>
				</swiper-item>
			</swiper>
		</div>
		<!-- 		<div class="video" id="video" :style="{top: domY ? domY + 'px': '50%'}">
			<video :src="fileUrl+video.Path" style="width: 100%" autoplay controls show-play-btn
				auto-pause-if-navigate></video>
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
				playIndex: 0,
				imgUrl: 'https://www.epoia.cn/Image/',
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
				video: [],
				startX: 0,
				startY: 0,
				next: {},
				prev: {},
				domY: null,
				active: 2,
				domStartY: null,
				startData: {
					clientX: '',
					clientY: ''
				},
				model: {},
				index_: 1,
				index: '1',
				is_active: true,
				PayVideo: [],
				current_i: 2,
				_arr: [],
				len: 0,
			}
		},
		props: {
			ind: {
				type: Number,
				default: 0
			},
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
		mounted() {},
		methods: {
			changefun(e) {
				this.is_active = false
				let current = e.detail.current
				let {
					len,
					PayVideo,
					active,
					_arr,
					t,
					index_
				} = this
				console.log(1231313, index_)
				let videoContext = uni.createVideoContext('id' + index_)
				videoContext.pause()
				this.PayVideo = PayVideo
			},
			animationfinishfun(e) {
				let {
					index_,
					len,
					PayVideo,
					active,
					t
				} = this
				let _arr = this._arr
				console.log(_arr)
				let current = e.detail.current
				this.is_active = true
				PayVideo[current]['istrue'] = true
				this.PayVideo = PayVideo
				let videoContext = uni.createVideoContext('id' + (index_-1))
				videoContext.pause()
				videoContext = uni.createVideoContext('id' + current)
				videoContext.seek(0)
				videoContext.play()
				this.index_ = current
				if (PayVideo.length == len) {
					return
				}
				this.PayVideo.push(_arr[active])
				this.active += 1
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
						data: {
							id: this.id,
							memberId: response
						},
						success(res) {
							_this.prev = res.data.Data.prevmodel
							_this.next = res.data.Data.nextmodel
							_this.model = res.data.Data.model
							_this.like = res.data.Data.thumbs
							_this.PayVideo = res.data.Data.data
							_this.collect = res.data.Data.collections
							_this.shopping = res.data.Data.shopping
							let ind = 1
							_this.index = ind
							const video = _this.PayVideo
							const len = video.length
							let b_arr = []
							let s_arr = []
							video.forEach((res, index) => {
								if (ind <= index) {
									b_arr.push(res)
								} else {
									s_arr.push(res)
								}
							})

							let _arr = b_arr.concat(s_arr.reverse())
							_arr = _arr.map(res => {
								res['istrue'] = false
								return res
							})
							_arr[0]['istrue'] = true
							const PayVideo = [
								_arr[len - 1], _arr[0], _arr[1]
							]
							_this.PayVideo = PayVideo
							console.log(_this.PayVideo)
							_this._arr = _arr
							_this.len = len
							_this.$nextTick(function() {
								let videoContext = uni.createVideoContext('id0')
								console.log(7489789, videoContext)
								videoContext.play()
							})
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
									title: res.data.Message,
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
									title: res.data.Message,
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
									title: res.data.Message,
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
	// page {
	// 	background: rgba(0, 0, 0, .8);
	// 	overflow: hidden;
	// }

	.container {
		height: 100%;
		position: relative;
	}

	.swiper {
		height: 100%;
	}

	.video {
		width: 100%;
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
	}

	.handle {
		position: absolute;
		bottom: 21px;
		right: 17px;

		&>div {
			p {
				color: #fff;
				font-size: 32rpx;
			}

			img {
				display: block;
				width: 60rpx;
				height: 60rpx;
			}
		}
	}

	.videoTop {
		top: -300px;
		width: 100%;
		position: absolute;
		left: 0;
		transform: translateY(-50%);
		transition: top 0.3s;
	}

	.videoBottom {
		top: 900px;
		width: 100%;
		position: absolute;
		left: 0;
		transform: translateY(-50%);
		transition: top 0.3s;
	}

	.swiper-item {
		position: relative;
		height: 100%;
		background: rgba(0, 0, 0, .8);
	}

	.cover {
		width: 100%;
		height: 225px;
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);

		&>img {
			width: 100%;
			display: block;
			height: 100%
		}
	}
</style>
