<template>
	<view class="applyfriend">
		<view class="top">
			<view class="title">
				好友请求
			</view>
		</view>
		<view class="main" v-for="(item, index) in applyFriendList" :key="index">
			<image :src="getImageUrl(item.imgurl)" mode=""></image>
			<view class="btn">
				<view class="reject" @click="rejectHandler(item.friendid, index)">
					拒绝
				</view>
				<view class="confirm" @click="confirmHandler(item.friendid, index)">
					同意
				</view>
			</view>
			<view class="username">
				{{item.username}}
			</view>
			<view class="time">
				{{formatTime(item.lasttime)}}
			</view>
			<view class="message">
				<view class="msg">
					留言：{{item.lastMsg}}
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import getUserid from '@/util/js/getUserid.js'
	import {formatDate, getImageUrl} from '@/util/js/format.js'
	export default {
		data() {
			return {
				userid:'',
				applyFriendList: [], //申请好友的列表
			}
		},
		methods: {
			async getApplyFriend(){
				let userid = this.userid
				let result = await this.$myHttp({
					url:'/friend/get-apply-friend',
					data:{userid}
				})
				if(result.data.status === 200){
					this.applyFriendList = result.data.result
					// console.log(result)
				}
				// 如果有新的朋友，则需要显示tabbar右上角的红点和数字
				this.tabBarRedDotHandler()
			},
			receiveSocket(){
				// console.log("hhhh")
				this.socket.on("addfriend", (friendid)=>{
					// console.log("app",friendid)
					if(this.userid == friendid){
						this.getApplyFriend()
					}
				})
			},
			tabBarRedDotHandler(){
				if(this.applyFriendList.length > 0){
					let applyFriendListLength = this.applyFriendList.length > 99 ? "..." :String(this.applyFriendList.length)
					uni.showTabBarRedDot({
						index:1
					})
					uni.setTabBarBadge({
						index:1,
						text:applyFriendListLength
					})
				}else{
					uni.hideTabBarRedDot({
						index:1
					})
				}
			},
			async rejectHandler(friendid, index){
				let userid = this.userid
				let result = await this.$myHttp({
					url:'/friend/reject',
					data:{userid, friendid}
				})
				if(result.data.status === 200){
					this.applyFriendList.splice(index, 1)
					// 如果有新的朋友，则需要显示tabbar右上角的红点和数字
					this.tabBarRedDotHandler()
				}
			},
			async confirmHandler(friendid, index){
				let userid = this.userid
				let result = await this.$myHttp({
					url:'/friend/agree',
					data:{userid, friendid}
				})
				if(result.data.status === 200){
					// console.log("cg")
					this.applyFriendList.splice(index, 1)
					// 确定后需要通知好友已经添加，也就是好友首页需要更新一下
					this.socket.emit('applyfriend', userid, friendid)
					// 如果有新的朋友，则需要显示tabbar右上角的红点和数字
					this.tabBarRedDotHandler()
					
				}
			}
		},
		computed:{
			formatTime(){
				return function(time){
					return formatDate(new Date(time))
				}
			},
			getImageUrl(){
				return function(url){
					return getImageUrl(url)
				}
			}
		},
		onShow() {
			//获取用户id
			this.userid = getUserid()
			if(this.userid){
				this.getApplyFriend()
			}
		},
		onLoad() {
			this.receiveSocket()
		}
	}
</script>

<style lang="scss" scoped>
	.applyfriend{
		padding-top: var(--status-bar-height);
	}
	.top{
		height: 88rpx;
		border-bottom: 1rpx solid #eee;
		.title{
			text-align: center;
			font-size: $uni-font-size-lg;
			line-height: 88rpx;
		}
	}
	.main{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-evenly;
		height: 300rpx;
		position: relative;
		border: 1rpx solid #eee;
		margin: 90rpx 30rpx 0;
		padding: 20rpx 30rpx;
		border-radius: 20rpx;
		box-shadow:5px 8px 8px 5px #eee;
		image{
			position: absolute;
			width: 150rpx;
			height: 150rpx;
			border-radius: 50%;
			top:-75rpx;
			left: 0;
			right: 0;
			margin: auto;
		}
		.btn{
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 20rpx 0;
			width: 100%;
			height: 60rpx;
			line-height: 60rpx;
			.reject{
				padding: 0 30rpx;
				background-color: #feecec;
				color: #ff007f;
				border-radius: 35rpx;
				
			}
			.confirm{
				padding: 0 30rpx;
				background-color: #ffe036;
				border-radius: 35rpx;
			}
		}
		.username{
			font-size: $uni-font-size-lg;
		}
		.time{
			font-size: $uni-font-size-sm;
			color: $uni-text-color-grey;
			margin-bottom: 30rpx;
		}
		//多行文本居中
		.message{
			display: table;
			border-radius: 8rpx;
			text-align: center;
			min-height: 100rpx;
			padding: 10rpx;
			width: 100%;
			background-color: #f0f2f4;
			.msg{
				display: table-cell;
				vertical-align: middle;
				
				
			}
		}
	}
</style>
