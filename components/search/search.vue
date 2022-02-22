<template>
	<view class="container">
		<div class="headImg">
			<open-data type="userAvatarUrl"></open-data>
		</div>
		<div class="searchInpt">
			<icon type="search" size="16"></icon>
			<input type="text" class="input" placeholder="请输入关键字" confirm-type="search" @confirm="search()">
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		created() {
		},
		methods: {
			search() {
				console.log(111)
			} 
		}
	}
</script>

<style lang="scss">
	.container{
		display: flex;
		padding: 10px 10px;
		align-items: center;
		background: #fff;
		border-radius: 5px;
	}
	.headImg{
		width: 90rpx;
		height:90rpx;
		border-radius: 50%;
		border:1px solid #ccc;
		margin-right:10px;
		overflow: hidden;
	}
	.searchInpt{
		background: #eee;
		height: 30px;
		border-radius: 20px;
		display: flex;
		padding-left:10px;
		align-items: center;
		input{
			margin-left:10px;
			font-size: 12px;
		}
	}
</style>
