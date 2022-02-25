<template>
	<view>
		<div class="container">
			<div class="info">
				<div style="width: 160rpx;">
					<div class="headImg">
						<img :src="avatarUrl" v-if="avatarUrl">
						<open-data type="userAvatarUrl" v-else lang="zh_CN"></open-data>
					</div>
				<div style="display: flex;justify-content: center;">
						<p v-if="nickname">{{nickname}}</p>
						<open-data type="userNickName" v-else style="text-align: center;" lang="zh_CN"></open-data>
				</div>
				</div>
				<div class="share" v-if="token">
					分享
				</div>
				<div class="login" v-else @click="login">
					登录
				</div>
			</div>
			<div class="collect">
				<div class="type">
					<div @click="chose(1)" :class="{selected: type === 1}">喜欢</div>
					<div @click="chose(2)" :class="{selected: type === 2}">关注</div>
				</div>
			</div>
			<div class="list">
				<div v-for="(item, i) in list" :key="i">
					<img src="../../static/cover.png">
				</div>
			</div>
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 1,
				list: [
					{
						
					},
					{
						
					}
				],
				token: null,
				avatarUrl: '',
				nickname: ''
			};
		},
		created() {

		},
		methods: {
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
													success() {
														
													}
												})
											},
											fail(res3) {
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
				this.type = e
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
		color: #fff
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
