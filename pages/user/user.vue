<template>
	<view>
		<div class="container">
			<div class="info">
				<div style="width: 160rpx;">
					<div class="headImg">
						<img :src="avatarUrl" v-if="avatarUrl">
					</div>
				<div style="display: flex;justify-content: center;">
						<p v-if="nickname" style="text-overflow:ellipsis;overflow:hidden;
    white-space:nowrap;">{{nickname}}</p>
						<!-- <open-data type="userNickName" v-else style="text-align: center;" lang="zh_CN"></open-data> -->
				</div>
				</div>
				<div class="share" v-if="token" @click="share">
					<button style="display: block;width: 100%;height: 100%;border:none;outline: none;background: rgb(96,203,65);color: #fff;font-size: 16px;line-height: 34px;" open-type="share">分享</button>
				</div>
				<div class="login" v-else @click="login">
					登录
				</div>
			</div>
			<div class="collect">
				<div class="type">
					<div @click="chose(0)" :class="{selected: type === 0}">喜欢</div>
					<div @click="chose(1)" :class="{selected: type === 1}">收藏</div>
				</div>
			</div>
			<div class="list" v-if="memberId">
				<div v-for="(item, i) in list" :key="i" @click="watchVideo(item)" style="margin-bottom: 10px;position: relative;overflow: hidden;">
					<img :src="imgUrl+item.Cover">
					<p style="position: absolute;bottom: 0;width: 100%;height: 28px;background: rgba(3, 3, 3, 0.6);color:#fff;z-index:1000;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;padding: 0 5px;font-size: 14px">{{item.Titel}}</p>
				</div>
			</div>
			<div v-else style="display: flex;justify-content: center;margin-top: 60px">
				 <icon type="warn" color="#999" size="26"/>
				<p style="margin-left: 20rpx;">请登录后查看</p>
			</div>
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 0,
				list: [],
				token: null,
				avatarUrl: '',
				nickname: '',
				memberId: '',
				url: 'https://www.epoia.cn',
				imgUrl: 'https://www.epoia.cn/Image/'
			};
		},
		created() {
			var _this = this
			uni.getStorage({
				key: "token",
				success(res) {
					if (res.data) {
						_this.token = res.data
						_this.avatarUrl = uni.getStorageSync('avatarUrl')
						_this.nickname = uni.getStorageSync('nickname')
						
						_this.memberId = uni.getStorageSync('memberId')
						_this.getList()
					}
				}
			})
		},
		methods: {
			share(e){
				uni.share({
					provider: 'weixin',
					type: 5,
					title: 'wow小程序商城',
					scene: 'WXSceneSession',
					imageUrl: 'https://www.epoia.cn/Image/logo.png',
					miniProgram: {
						id: 'gh_2f1eb84c5632',
						path:'/pages/index/index',
						type: 2
					},
					summary: '分享',
					success: function (res) {
						console.log("success:" + JSON.stringify(res));
					},
					fail: function (err) {
						console.log("fail:" + JSON.stringify(err));
					}
				})
			},
			watchVideo(e) {
				uni.navigateTo({
					url: '../view/view?path='+e.Path+'&id='+e.Id,
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			getList() {
				var _this = this
				uni.request({
					url: this.url + '/Home/GetMemberInfo',
					data: {
						memberId:this.memberId,
						type: this.type
					},
					success(res) {
						_this.list = res.data.Data
					}
				})
			},
			login() {
				var _this = this
				uni.showModal({
				    title: '温馨提示',
				    content: '是否确认登录',
				    success: function (res1) {
				        if (res1.confirm) {
				            uni.getUserProfile({
				            	desc:'Wexin',
				            	success:(res2)=>{
				            		//console.log(res);
				            		_this.userInfo = res2.userInfo;
									uni.login({
										provider: 'weixin',
										success: function (loginRes) {
											let data = {
												code: loginRes.code,
												nickname:_this.userInfo.nickName,
												avatarUrl: _this.userInfo.avatarUrl
											}
										   uni.request({
										   	url: 'https://www.epoia.cn/Auth/WeiXinLogin',
										   	method: 'POST',
										   	data: data,
											success(res3) {
												uni.setStorage({
													key: 'token',
													data: res3.data.Data.wxKey,
													success() {
														_this.token = res3.data.Data.wxKey
														_this.avatarUrl = res3.data.Data.avatarUrl
														_this.nickname = res3.data.Data.nickname
														uni.setStorage({
															key: 'avatarUrl',
															data: res3.data.Data.avatarUrl,
															success() {
																
															}
														})
														uni.setStorage({
															key: 'nickname',
															data: res3.data.Data.nickname,
															success() {
																
															}
														})
													}
												})
												uni.setStorage({
													key: 'memberId',
													data:res3.data.Data.memberId,
													success(res) {
														_this.memberId = res3.data.Data.memberId
														_this.getList()
													}
												})
												
											},
											fail(res3) {
												console.log(12313, res3)
												uni.showModal({
													showCancel: false,
													title: res3.data.Message,
													confirmText: '关 闭',
													success(res4) {
														
													}
												})
											}
										   })
									    }
									})
				            	},
				            	fail:(res2)=>{
				            		console.log(res2)
				            	}
				            });
				        } else if (res1.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			chose(e) {
				if(!this.memberId) {
					uni.showToast({
						title: '请登录',
						icon: "none"
					})
				} else{
					this.type = e
					this.getList()
				}
			}
		}
	}
</script>

<style lang="scss">
	.container{
		padding: 20rpx;
	}
	.headImg{
		width: 160rpx;
		height: 160rpx;
		border-radius: 20rpx;
		overflow: hidden;
		border: 1px solid #ccc;
		img{
			width: 100%;
			height: 100%;
		}
	}
	.info{
		background: #fff;
		border-radius: 10rpx;
		padding: 40rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.share{
		width: 400rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		background: rgb(96,203,65);
		border-radius: 60px;
		color: #fff;
		overflow: hidden;
	}
	.login{
		width: 400rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		background: rgb(96,203,65);
		border-radius: 60px;
		color: #fff
	}
	.collect{
		margin-top: 20rpx;
		background: #fff;
	}
	.type{
		display: flex;
		justify-content: space-between;
		&>div{
			width: 50%;
			text-align: center;
			padding: 20rpx 0
		}
	}
	.selected{
		color: rgb(213,104,48);
		border-bottom: 2px solid rgb(213,104,48);
	}
	.list{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		&>div{
			width: 49%;
			height: 400rpx;
			&>img{
				width:100%;
				height: 100%;
				margin-top: 20rpx
			}
		}
	}

</style>
