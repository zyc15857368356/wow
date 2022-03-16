<script>
	let userInfo = {}
	function login() {
		uni.showModal({
		    title: '温馨提示',
		    content: '是否确认登录',
		    success: function (res1) {
		        if (res1.confirm) {
		            uni.getUserProfile({
		            	desc:'Wexin',
		            	success:(res2)=>{
		            		//console.log(res);
		            		userInfo = res2.userInfo;
							uni.login({
								provider: 'weixin',
								success: function (loginRes) {
									let data = {
										code: loginRes.code,
										nickname:userInfo.nickName,
										avatarUrl: userInfo.avatarUrl
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
												// _this.token = res3.data.Data.wxKey
												// _this.avatarUrl = res3.data.Data.avatarUrl
												// _this.nickname = res3.data.Data.nickname
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
												// _this.memberId = res3.data.Data.memberId
												// _this.getList()
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
	}
	export default {
		onLaunch: function() {
			if (!uni.getStorageSync('token')) {
				login()
			}
		},
		onShow: function() {

		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	page{
		height: 100%;
		background: #eee;
	}
</style>
