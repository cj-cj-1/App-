<template>
	<view class="top">
		<image src="/static/image/return.png" mode="" @click="returnClickHandler"></image>
		<view class="title">
			{{title}}
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		},
		props:{
			title:{
				type:String,
				default:''
			}
		},
		methods:{
			returnClickHandler(){
				this.$emit("returnClickHandler")
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top{
			display: flex;
			align-items: center;
			height: 88rpx;
			border-bottom: 1rpx solid #eee;
			image{
				width: 50rpx;
				height: 50rpx;
				padding-left: 30rpx;
			}
			.title{
				margin-left: -70rpx;
				flex: 1;
				text-align: center;
				font-size: $uni-font-size-lg;
			}
		}
</style>
