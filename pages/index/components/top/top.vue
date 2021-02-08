<template>
	<view class="top">
		<view class="left">
			<image :src="getImageUrl(imgurl)" alt="">
		</view>
		<view class="right">
			<image src="/static/image/search.png" class="search" @click="JumpHandler">
			<image src="/static/image/addgroup.png" class="addgroup" @click="addGrouphandler">
		</view>
	</view>
</template>

<script>
	import {getImageUrl} from '@/util/js/format.js'
	export default {
		data() {
			return {
				
			}
		},
		props:{
			imgurl:{
				type:String
			},
			userid:{
				type:String,
				default:''
			}
		},
		methods: {
			JumpHandler(){
				uni.navigateTo({
					url:'/pages/search/search'
				})
			},
			addGrouphandler(){
				let userid = this.userid
				uni.navigateTo({
					url:'/pages/group/group?userid=' + userid
				})
			}
		},
		computed:{
			//获得完整图片地址
			getImageUrl(){
				return function(url){
					if(!url){
						return ''
					}
					return getImageUrl(url)
				}
			},
		}
	}
</script>
	
<style scoped lang="scss">
	.top{
		position: fixed;
		height: 88rpx;
		top: 0;
		right: 0;
		left: 0;
		display: flex;
		padding-top: var(--status-bar-height);
		justify-content: space-between;
		align-items: center;
		border-bottom: solid 1px #eee;
		background-color: #fff;
		z-index: 9;
		.left{
			padding-left: 30rpx;
			image{
				vertical-align: middle;
				width: 70rpx;
				height: 70rpx;
				border-radius: $uni-border-radius-sm;
			}
		}
		.right{
			// padding-right: 100rpx;
			image{
				vertical-align: middle;
				padding-right: 30rpx;
				width: 46rpx;
				height: 46rpx;
			}
		}
	}
</style>
