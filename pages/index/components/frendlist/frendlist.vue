<template>
	<view class="friend-list">
		<view class="left">
			<image :src="getImageUrl(obj.imgurl)" mode=""></image>
<!-- 			<image src="/static/touxiang/photo6.jpg" mode=""></image> -->
			<view class="" v-if="obj.unread">
				<!-- 显示未读消息数 -->
				<view class="unread" v-if="obj.shield==0">
					{{formatUnreadMsg}}
				</view>
				<!-- 消息免打扰 -->
				<view class="shield" v-else>
				</view>
			</view>
		</view>
		<view class="right">
			<view class="info">
				<view class="title">
					<text>{{obj.groupname ? obj.groupname : obj.markname ? obj.markname: obj.username}}</text>		
				</view>
				<view class="time">
					{{formatTime}}
				</view>
			</view>
			<view class="detail" v-if="obj.isgroup==1">
				<view class="" v-if="obj.lastMsg">
					{{obj.markname ? obj.markname: obj.username}}: {{formatLastMessage(obj.lastMsg, obj.type)}}
				</view>
			</view>
			<view class="detail" v-else>
				{{formatLastMessage(obj.lastMsg, obj.type)}}
			</view>
		</view>
		
	</view>
</template>

<script>
	import {formatDate} from '@/util/js/format.js'
	import {getImageUrl} from '@/util/js/format.js'
	export default {
		
		data() {
			return {
				// time : formatDate(obj.lasttime)
			}
		},
		props:{
			obj: {
				type: Object,
				// default: {}
			}
		},
		methods: {
			
		},
		computed:{
			formatTime(){
				return formatDate(new Date(this.obj.lasttime))
			},
			formatUnreadMsg(){
				if(this.obj.unread > 99){
					return "..."
				}else{
					return this.obj.unread
				}
			},
			//获得完整图片地址
			getImageUrl(){
				return function(url){
					return getImageUrl(url)
				}
			},
			//处理列表最新一条消息
			formatLastMessage(){
				return function(message, type){
					if(type == 0){
						return message
					}else if(type == 1){
						return "[图片]"
					}else if(type == 2){
						return "[音频]"
					}else{
						return "[位置]"
					}
				}
				
			}
		},
		onLoad: {
			
		}
	}
</script>

<style lang="scss" scoped>
	.friend-list{
		display: flex;
		padding-left: 30rpx;
		padding-top: 36rpx;
		.left{
			display: flex;
			position: relative;
			justify-content: center;
			align-items: center;
			width: 96rpx;
			height: 96rpx;
			// background-color: #FFE431;
			border-radius: $uni-border-radius-base;
			image{
				width: 100%;
				height: 100%;
				border-radius: $uni-border-radius-base;
			}
			.unread{
				position: absolute;
				top: -16rpx;
				right: -16rpx;
				text-align: center;
				min-width: 34rpx;
				height: 34rpx;
				line-height: 34rpx;
				padding: 4rpx;
				font-size: $uni-font-size-sm;
				color: #fff;
				background-color: #FF5D5B;
				border-radius:36rpx;
			}
			.shield{
				position: absolute;
				top: -16rpx;
				right: -16rpx;
				width: 20rpx;
				height: 20rpx;
				border-radius:10rpx;
				background-color: #FF5D5B;
			}
		}
		.right{
			flex: 1;
			padding-left: 20rpx;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			.info{
				display: flex;
				justify-content: space-between;
				.title{
					background-color: #fff;
					font-size: 36rpx;
					font-weight: bold;
					color: $uni-text-color;
					height: 60rpx;
					line-height: 60rpx;
					display: block;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					
				}
				.time{
					// width: 124rpx;
					height: 60rpx;
					padding-right: 26rpx;
					line-height: 60rpx;
					font-size: $uni-font-size-sm;
					color: $uni-text-color-grey;
				}
			}
			
			.detail{
				line-height: 36rpx;
				height: 36rpx;
				font-size: $uni-font-size-base;
				color: $uni-text-color-grey;
				display:block;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
		
	}
</style>
