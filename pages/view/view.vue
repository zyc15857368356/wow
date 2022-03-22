<template>
	<view class="container uni-padding-wrap">
		<div class="page-section swiper">
			<swiper class="swiper" @change="changefun" @animationfinish="animationfinishfun" :current="0"
				:vertical="true" :circular="true" :disable-touch="isLandScape">
				<swiper-item v-for="(item, i) in PayVideo" :key="i" :id="'id' + i">
					<view class="swiper-item">
						<video :custom-cache="false" loop="true"
							:class="{vdieoHen: isLandScape,contain: item.Width < item.Height}" class="video"
							:id="'id'+i" :enable-play-gesture="true" :enable-progress-gesture="true" :controls="true"
							:src="fileUrl+ item.Path" :show-center-play-btn="false">
							<!-- object-fit="cover" -->
						</video>
					</view>
				</swiper-item>
			</swiper>
		</div>
		<!-- 		<div class="video" id="video" :style="{top: domY ? domY + 'px': '50%'}">
			<video :src="fileUrl+video.Path" style="width: 100%" autoplay controls show-play-btn
				auto-pause-if-navigate></video>cover
		</div> -->
		<div class="handle" v-if="!isLandScape">
			<div @click="addLike">
				<img :src="like? '../../static/heartSelected.png' : '../../static/heart.png'">
				<p>{{model.Thumbcou | numberFliter}}</p>
			</div>
			<div @click="addCollect">
				<img :src="collect?'../../static/collectSelect.png': '../../static/collect.png'">
				<p>{{model.Collectioncou | numberFliter}}</p>
			</div>
			<div @click="addBuy">
				<img :src="shopping? '../../static/carSelect.png':'../../static/car.png'">
				<p>{{model.Shopcou | numberFliter}}</p>
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
				isLandScape: false,
				videoType: null
			}
		},
		props: {
			ind: {
				type: Number,
				default: 0
			},
		},
		onResize() {
			let _this = this
			uni.getSystemInfo({
				success: function(res) {
					if (res.windowWidth > res.windowHeight) {
						// 横屏
						_this.isLandScape = true
					} else {
						// 竖屏
						_this.isLandScape = false
					}
				}
			})
		},
		onLoad(option) {
			this.path = option.path
			this.id = option.id
			this.videoType = option.type
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

		},
		onUnload() {

		},
		onShow() {

			this.getVideoInfo()
		},
		filters: {
			numberFliter(newVal) {
				if (newVal > 9999) { //大于9999显示x.xx万
					return newVal = (Math.floor(newVal / 1000) / 10) + 'W';
				} else if (newVal < 9999) {
					return newVal;
				}
			}
		},
		mounted() {
			// uni.onWindowResize( res => {
			// 	console.log(res.deviceOrientation)
			// })
			// //#ifdef MP-WEIXIN
			// let orit = plus.navigator.getOrientation();
			// if ((orit == 0) || (orit == 180)) {
			// 	//竖屏做的操作
			// 	console.log(111)
			// } else {
			// 	//横屏做的操作
			// 	console.log(2222)
			// }
			// //#endif
		},
		methods: {
			getBehavior() {
				var _this = this
				uni.request({
					url: this.url + '/Home/GetVideoInfo',
					methods: 'GET',
					data: {
						id: this.PayVideo[this.index_].Id,
						memberId: _this.memberId,
						videoTypeId: _this.videoType
					},
					success(res) {
						_this.like = res.data.Data.thumbs
						_this.collect = res.data.Data.collections
						_this.shopping = res.data.Data.shopping
						_this.model = res.data.Data.model
					}
				})
			},
			changefun(e) {
				// this.is_active = false
				let current = e.detail.current
				let {
					len,
					PayVideo,
					active,
					_arr,
					t,
					index_
				} = this
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
				let current = e.detail.current
				// this.is_active = true
				// PayVideo[current]['istrue'] = true
				let video = this.fileUrl + this.PayVideo[current].Path
				this.PayVideo = PayVideo
				let videoContext = uni.createVideoContext('id' + (index_ - 1))
				videoContext.pause()
				videoContext = uni.createVideoContext('id' + current)
				videoContext.seek(0)
				videoContext.play()
				this.index_ = current
				// this.getVideoInfo()
				this.getBehavior()
				if (PayVideo.length == len) {
					return
				}
				// this.PayVideo.push(_arr[active])
				// this.active += 1
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
							memberId: _this.memberId,
							videoTypeId: _this.videoType
						},
						success(res) {
							console.log(res.data.Data)
							if (res.data.Data.data.length > 0) {
								_this.prev = res.data.Data.prevmodel
								_this.next = res.data.Data.nextmodel
								_this.model = res.data.Data.model
								_this.like = res.data.Data.thumbs
								_this.PayVideo = res.data.Data.data
								_this.collect = res.data.Data.collections
								_this.shopping = res.data.Data.shopping
								let ind = 0
								for (let i = 0; i < _this.PayVideo.length; i++) {
									if (_this.model.Id === _this.PayVideo[i].Id) {
										ind = i
									}
								}
								_this.index = ind
								const video = _this.PayVideo
								const len = video.length
								let _arr = []
								let b_arr = []
								let s_arr = []
								if (video.length > 1) {
									video.forEach((res, index) => {
										if (ind <= index) {
											b_arr.push(res)
										} else {
											s_arr.push(res)
										}
									})

									_arr = b_arr.concat(s_arr.reverse())
								} else {
									_arr = video
								}
								_arr = _arr.map(res => {
									res['istrue'] = false
									return res
								})
								_arr[ind]['istrue'] = true
								// const PayVideo = [
								// 	_arr[len - 1], _arr[0], _arr[1]
								// ]
								_this.PayVideo = _arr
								_this._arr = _arr
								// _this.len = le
								let videoContext = uni.createVideoContext('id0')
								videoContext.play()
							}
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
								_this.getVideoInfo()
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
								_this.getVideoInfo()
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
								_this.getVideoInfo()
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

	.vdieoHen {
		height: 100%;
	}

	.handle {
		position: absolute;
		bottom: 21px;
		right: 17px;

		&>div {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin: 10px 0;

			p {
				color: #fff;
				font-size: 32rpx;
				text-align: center;

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
		width: 100%;
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

	.contain {
		width: 100% !important;
		height: 100% !important
	}
</style>
