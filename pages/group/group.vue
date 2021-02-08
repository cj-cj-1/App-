<template>
	<view class="group">
		<view class="top" >
			<top title="创建群聊" @returnClickHandler="returnClickHandler"></top>
		</view>
		<view class="content">
			<input type="text" v-model="groupname" placeholder="请输入群名称" class="groupname" placeholder-style="color:#ccc;font-size:30rpx"/>
			<view class="userlist">
				<userlist @selectHandler="selectHandler" :userid="userid" ref="userlist"></userlist>
			</view>
			
			<view :class="{creat:true,confirm:!iscomfirm}" @click="comfirmHandler">
				创建（{{userLength}}）
			</view>
		</view>
	</view>
</template>

<script>
	import top from "@/components/top/top.vue"
	import userlist from "./components/userlist/userlist.vue"
	export default {
		components:{
			top,
			userlist,
			
		},
		data() {
			return {
				userLength:0,
				groupname:'',
				userid: '',
				user:[]
			}
		},
		methods: {
			selectHandler(sum, friendid, selected){
				this.userLength = sum
				if(selected == false){
					let index = this.user.indexOf(friendid)
					this.user.splice(index,1)
				}
				else{
					this.user.push(friendid)
				}
				console.log(this.user)
			},
			async comfirmHandler(){
				if(this.userLength >= 2 && this.groupname !== ''){
					let groupname = this.groupname
					let user = this.user
					let userid = this.userid
					let result = await this.$myHttp({
						url:"/group/add-group",
						data: {
							userid,
							groupname,
							user
						}
					})
					console.log(result)
					if(result.data.status == 200){
						// 调用子组件的复原函数
						this.$refs.userlist.resetHandler()
						this.groupname = ''
						this.user = [this.userid]
						this.userLength = 0
						uni.showToast({
							title:"创建成功",
							icon:"none"
						})
					}else if(result.data.status == 400){
						uni.showToast({
							title:"您已存在该群",
							icon:"none"
						})
					}
				}else if(this.groupname == ''){
					uni.showToast({
						title:"请输入群名",
						icon:"none"
					})
				}
			},
			returnClickHandler(){
				uni.switchTab({
					url:'/pages/index/index'
				})
			}
		},
		computed:{
			iscomfirm(){
				return this.userLength >= 2
			}
		},
		onLoad(option) {
			this.userid = option.userid
			this.user.push(this.userid)
		}
	}
</script>

<style lang="scss" scoped>
	.group{
		padding-top: var(--status-bar-height);
		// padding: 0 32rpx;
		.top{
			// padding-top: var(--status-bar-height);
			// // background-color: #fff;
			// z-index: 10;
		}
		.content{
			padding: 0 32rpx;
			.userlist{
				height: calc(100vh - 188rpx - 90rpx - env(safe-area-inset-bottom));
			}
		}
		.groupname{
			height: 80rpx;
			background-color: #f3f4f6;
			border-radius: 40rpx;
			text-align: center;
			margin-top: 20rpx;
		}

		.creat{
			position: fixed;
			left: 40rpx;
			right: 40rpx;
			bottom: env(safe-area-inset-bottom);
			// width: 80%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			background-color: #ffe431;
			border-radius: 40rpx;
			margin:0rpx auto 10rpx;
		}
		.confirm{
			background-color: #fff299;
		}
	}
	
</style>
