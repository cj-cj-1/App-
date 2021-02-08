<template>
	<view class="addfriend">
		<view class="back">
			<image src="../../static/image/return.png"  mode="" @click="backHandler"></image>
		</view>
		<view class="main">
			<view class="photo">
				<image :src="getImageUrl(imgurl)"  mode=""></image>
			</view>
			<view class="name">{{friendName}}</view>
			<textarea v-model="getContent" placeholder="" />
			<view class="btn">
				<view class="btnitem" @click="backHandler">取消</view>
				<view class="btnitem" @click="confirmHandler">发送</view>
			</view>
		</view>
	</view>
</template>

<script>
	import getUserid from '@/util/js/getUserid.js'
	import {getImageUrl} from '@/util/js/format.js'
	export default {
		data() {
			return {
				username: '',
				userid: '',
				imgurl:'',
				friendName: '',
			}
		},
		methods: {
			backHandler(){
				uni.redirectTo({
					url:'/pages/search/search'
				})
			},
			async getUserName(){
				let userid = this.userid
				let result = await this.$myHttp({
					url:'/detail/find-user',
					data: {userid}
				})
				if(result.data.status === 200){
					if(result.data.result[0]){
						this.username = result.data.result[0].username
					}	
				}
			},
			
			//按下确定按钮时发送好友申请请求
			async confirmHandler(){
				let userid = this.userid
				let content = this.getContent
				let friendid = this.friendid
				let result = await this.$myHttp({
					url: '/friend/apply-friend',
					data: {userid, content,friendid}
				})
				if(result.data.status === 200){
					// console.log("cg")
					// this.getContent = ''
					uni.showToast({
						title:'发送成功',
						icon:'none',
						duration:1500
					})
					// 确定后需要通知好友已经添加，也就是好友首页需要更新一下
					this.socket.emit('addfriend', this.friendid)
					// uni.redirectTo({
					// 	url:'/pages/search/search'
					// })
				}
			}
			

		},
		computed:{
			getContent(){
				return '我是' + this.username + '~'
			},
			//获得完整图片地址
			getImageUrl(){
				return function(url){
					return getImageUrl(url)
				}
			}
		},
		onShow() {
			this.userid = getUserid()
			if(this.userid){
				// this.getUserinfo()
				this.getUserName()
			}
		},
		onLoad(option) {
			this.friendid = option.friendid
			this.imgurl = option.imgurl
			this.friendName = option.username
		}
	}
</script>

<style lang="scss" scoped>
	.addfriend{
		padding-top: var(--status-bar-height);
		position: absolute;
		left: 0;
		right: 0;
		top:0;
		bottom: 0;
		background-color: rgba($color: #ffe431, $alpha: 0.7);
		.back{
			height: 350rpx;
			image{
				width: 50rpx;
				height: 50rpx;
				padding:20rpx 0 0 60rpx;
			}
		}
		.main{
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			position: relative;
			border-top-left-radius: 40rpx;
			border-top-right-radius: 40rpx;
			background-color: #fff;
			padding: 0 60rpx;
			height: calc(100% - 350rpx - var(--status-bar-height));
			.photo{
				position: absolute;
				left: 0;
				right: 0;
				margin: 0 auto;
				width: 200rpx;
				height: 200rpx;
				image{
					width: 200rpx;
					height: 200rpx;
					border-radius: 50%;
					padding: 0;
					top: -100rpx;
					box-shadow: 10rpx 10rpx 10rpx rgba(0,0,0,.5);
					/*考虑浏览器兼容性*/
					-moz-box-shadow: 10rpx 10rpx 10rpx rgba(0,0,0,.5);
					-webkit-box-shadow: 10rpx 10rpx 10rpx rgba(0,0,0,.5);
				}
			}
			.name{
				padding-top: 120rpx;
				padding-bottom: 20rpx;
				text-align: center;
				font-size: 26px;
			}
			textarea{
				background-color: #f3f4f6;
				width: 100%;
				box-sizing: border-box;
				padding: 10rpx;
				flex:1;
			}
			.btn{
				display: flex;
				justify-content: space-around;
				align-items: center;
				.btnitem{
					width: 46%;
					height: 80rpx;
					line-height: 80rpx;
					text-align: center;
					margin: 80rpx 0;
					background-color:rgba($color: #ffe431, $alpha: 0.8);
				}
			}
		}
		
	}
</style>
