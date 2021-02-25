<template>
	<view class="top">
		<image src="/static/image/return.png" mode="" @click="returnHandler"></image>
		<view class="title" v-if="isgroup==0">
			{{friendname}}
		</view>
		<view class="title" v-else>
			{{groupname}}
		</view>
		<image src="/static/image/more.png" mode="" class="detail" @click="detailHandler"></image>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		props:{
			friendname:{
				type:String
			},
			groupname:{
				type:String
			},
			isgroup:{
				type:String
			},
			groupid:{
				type:String
			},
			friendid:{
				type:String
			},
			userid:{
				type:String
			}
		},
		methods: {
			async returnHandler(){
				// 修改好友未读消息
				let userid = this.userid
				let friendid = this.friendid
				let result = await this.$myHttp({
					url: '/home/update-unread',
					data: {
						userid:userid,
						friendid:friendid
					}
				})
				uni.switchTab({
					url:'/pages/index/index',
				})
			},
			detailHandler(){
				let groupid = this.groupid
				let userid = this.userid
				let friendid = this.friendid
				if(this.isgroup == 0){
					uni.navigateTo({
						url:'/pages/frienddetail/frienddetail?userid='+ userid + '&friendid=' + friendid
					})
				}else{
					uni.navigateTo({
						url:'/pages/groupdetail/groupdetail?groupid=' + groupid + '&userid=' + userid
					})
				}
				
			}
		},
		mounted() {
			console.log(this.friendname)
		}
	}
</script>

<style lang="scss" scoped>
	.top{
		position: fixed;
		top: var(--status-bar-height);
		left: 0;
		right: 0;
		// padding-top: 
		display: flex;
		align-items: center;
		height: 88rpx;
		background-color: #f7f7f7;
		border-bottom: 1rpx solid #ddd;
		// background-color: #fff;
		image{
			width: 50rpx;
			height: 50rpx;
			padding-left: 30rpx;
		}
		.title{
			flex: 1;
			text-align: center;
			font-size: $uni-font-size-lg;
		}
		.detail{
			padding-left: 0;
			padding-right: 30rpx;
		}
		
	}
</style>