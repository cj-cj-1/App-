<template>
	<view class="nofriends">
		<image src="/static/image/rabbit.png" mode=""></image>
		<text>还没有好友哦，赶紧加好友吧~</text>
		<view class="confirm" @click="hiddenHandler">
			知道啦
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			hiddenHandler(){
				this.$emit('hiddenHandler')
			}
		}
	}
</script>

<style lang="scss" scoped>
	.nofriends{
		display: flex;
		flex-direction: column;
		align-items: center;
		color: $uni-text-color-grey;
		margin-top: 200rpx;
		image{
			width: 200rpx;
			height: 200rpx;
		}
		text{
			padding: 60rpx;
		}
		.confirm{
			background-color: #FFE431;
			width: 200rpx;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			border-radius: 40rpx;
		}
	}
</style>
