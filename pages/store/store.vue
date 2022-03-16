<template>
	<view>
<!-- 		<div class="tab">
			<div v-for="(item, i) in typeList" :key="i" style="text-align: center;border-radius: 3px;" :class="{active: index===i}" @click="chose(i)">{{item.title}}</div>
		</div> -->
		<div class="container">
			<uni-swipe-action>
				<uni-swipe-action-item v-for="(item,index) in videoList" :key="index" :right-options="options"  @click="bindClick($event, item)" @change="swipeChange($event, index)">
					<div class="item">
						<div class="img">
							<img :src="imgUrl+item.Cover" alt="">
						</div>
						<div style="margin-left: 20px;width: 60%">
							<p class="title">{{item.Titel}}</p>
							<p style="margin-right: 30px;margin-top:5px" >{{item.Price}}元</p>
							<div class="buy">
								<div style="padding: 5px 20px;color: #fff;background: #F0AD4E;border-radius: 20px;font-size: 32rpx" @click="copy(item)">
									复制淘宝链接
								</div>
							</div>
						</div>
					</div>
				</uni-swipe-action-item>
			</uni-swipe-action>
	<!-- 		<div v-for="(item, i) in videoList" class="item" :key="i">

			</div> -->
		</div>
	</view>
</template>

<script>
	import uniSwipeAction from "../../uni_modules/uni-swipe-action/components/uni-swipe-action/uni-swipe-action.vue"
	export default {
		components:{
			'uni-swipe-action': uniSwipeAction
		},
		data() {
			return {
				options:[
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				],
				index: 0,
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
				imgUrl: 'https://www.epoia.cn/Image/',
				videoList: [],
				url: 'https://www.epoia.cn',
				videoType: 0,
				page: {
					page: 1,
					row: 20,
					total: 0
				},
				search: '',
				memberId: ''
			};
		},
		onLoad() {
			
		},
		onShow() {
			var _this = this
			uni.getStorage({
				key: 'memberId',
				success(res) {
					console.log(12313)
					_this.memberId = res.data
					_this.getList()
				},
				fail() {
					console.log(45646456)
					uni.showToast({
						title: "请登录后查看",
						icon: "none"
					})
				}
			})

		},
		methods:{
			swipeChange() {
				
			},
			bindClick(e,s) {
				uni.showModal({
					title: '是否确认删除',
					success() {
						
					},
					fail() {
						
					}
				})
			},
			chose(e) {
				this.page.page = 1
				this.page.row = 20
				this.index = e
				this.videoType = e
				this.getList()
			},
			copy(e){
				uni.setClipboardData({
					data: e.Link,
					success() {
						uni.showToast({
							title: '复制成功'
						})
					},
					fail() {
						uni.showToast({
							title: '复制失败，请重试',
							icon: 'error'
						})
					}
				})
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
					memberId: this.memberId,
					search: this.search,
				}
				var _this = this
				uni.request({
					url: this.url + '/Home/GetShopping',
					method: 'GET',
					data: data,
					success(res) {
						if(res.data.Success) {
							_this.videoList = res.data.Data
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
		padding: 0 20rpx;
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
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		height: 37px;
		font-size: 14px
	}
	.buy{
		display: flex;
		margin-top: 10px
	}
	.tab{
		width: calc( 100% - 20px ) ;
		background: #fff;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		position: fixed;
		z-index: 1000;
		left: 50%;
		transform: translateX(-50%);
		&>div{
			width: calc( 100% / 3 );
			padding: 10px 0
		}
	}
	.active{
		background: #F0AD4E;
		color: #fff
	}
</style>
