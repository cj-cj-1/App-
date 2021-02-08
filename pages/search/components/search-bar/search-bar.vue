<template>
	<view class="top-search">
		<view class="search-bar">
			<view class="search">
				<input type="text" v-model="searchContent" placeholder="请输入搜索内容" placeholder-style="color:#ccc" @input="searchHandler"/>
				<image src="/static/image/close.png" mode="" v-if="searchContent" @click="closeHandler"></image>
				<!-- <image src="/static/image/search.png" mode="" @click="searchHandler" v-else></image> -->
				
			</view>
			<view class="cancel" @click="cancelHandler">
				取消
			</view>
		</view>
	</view>
</template>

<script>
	import {debounce} from '@/util/js/debounce.js'
	export default {
		data() {
			return {
				searchContent: '', //搜索框中的内容
				searchHandler:null //防抖的函数
			}
		},
		
		methods: {
			searchDebounce(){
				this.searchHandler = debounce(()=>{
					let content = this.searchContent.trim()
					if(content !== ''){
						this.$emit('searchHandler', content)
					}
				}, 200)
			},
			//取消按钮
			cancelHandler(){
				this.searchContent = ''
				this.$emit("cancelHandler")
			},
			closeHandler(){
				this.searchContent = ''
			}
		},
		created(){
			this.searchDebounce()
		}
	}
</script>

<style lang="scss" scoped>
	.top-search{
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		background-color: #fff;
		z-index: 9;
		padding-top: var(--status-bar-height);
		.search-bar{
			display: flex;
			align-items: center;
			padding: 24rpx 32rpx;
			width: 60rpx;
			.search{
				display: flex;
				justify-content: space-between;
				align-items: center;
				flex:0 0 560rpx;
				height: 60rpx;
				margin-right: 30rpx;
				padding: 0 20rpx;
				background-color: #f3f4f6;
				border-radius: 30rpx;
				input{
					// width: 520rpx;
					width: 100%;
					height: 60rpx;
				}
				image{
					width: 40rpx;
					height: 40rpx;
				}
			}
			.cancel{
				flex: 0 0 60rpx;
				font-size: $uni-font-size-base;
			}
		}
	}
</style>
