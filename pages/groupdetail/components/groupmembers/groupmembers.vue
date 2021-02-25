<template>
	<view class="group-members">
		<view class="groupmember">
			<view class="group">群成员</view>
			<!-- 如果是群主就显示成员管理的选项 -->
			<view class="group-manger" v-if="(userid == groupCreaterId) && isHide" @click="mangerHandler">
				<view>成员管理 </view>
				<image src="/static/image/arrow.png" mode=""></image>
			</view>
			<view class="success" v-if="(userid == groupCreaterId) && !isHide" @click="mangerHandler">完成</view>
		</view>
		<view class="members" >
			<view class="member-item" v-for="(member, index) in groupmembers" :key="index">
				<view class="box">
					<image :src="getImageUrl(member.imgurl)" class="photo"></image>
				</view>
				<view class="name">{{member.username}}</view>
				<image src="/static/image/deletemember.png" :class="{delete:true, hide:isHide}" @click="deleteMemberHandler(member.userid)"></image>
			</view>
			
			<view class="member-item" @click="inviteHandler" >
				<view class="invite-box">
					<image src="/static/image/Group.png" class="invite" ></image>
				</view>
				<view class="name">邀请</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import {getImageUrl} from '@/util/js/format.js'
	export default {
		data() {
			return {
				groupmembers: [],
				isHide: true,
			}
		},
		props:{
			groupCreaterId:{
				type:String,
				default:''
			},
			userid:{
				type:String,
				default:''
			},
			groupid:{
				type:String,
				default:''
			},
			
		},
		methods: {
			async getGroupmember(){
				let userid = this.userid
				let groupid = this.groupid
				let result = await this.$myHttp({
					url:"/group/get-member",
					data:{userid, groupid}
				})
				// console.log(result)
				if(result.data.status == 200){
					this.groupmembers = result.data.result
				}
			},
			// 成员管理
			mangerHandler(){
				this.isHide = !this.isHide
				console.log(this.isHide)
			},
			deleteMemberHandler(userid){
				let groupid = this.groupid
				uni.showModal({
					title:"提示",
					content:"确认删除群成员",
					success: async(res) => {
							if (res.confirm) {
							   let result = await this.$myHttp({
								url:'/group/exit',
								data: {groupid, userid}
							   })
							   console.log(result)
							   if(result.data.status == 200){
								uni.showToast({
									title:"删除成功",
									icon:"none"
								})
								this.getGroupmember()
							   }else if(result.data.status == 201){
								   uni.switchTab({
								   	url:"/pages/index/index"
								   })
							   }
							} 
						}
				})
			},
			inviteHandler(){
				// console.log("888888")
				this.$emit("inviteHandler")
			}
		},
		computed:{
			//获得完整图片地址
			getImageUrl(){
				return function(url){
					return getImageUrl(url)
				}
			}
		},
		created() {
			this.getGroupmember()
		}
	}
</script>

<style lang="scss" scoped>
	.group-members{
		background-color: #fff;
	}
	.groupmember{
		padding: 108rpx 32rpx 10rpx;
		display: flex;
		align-items: center;
		
		image{
			width: 40rpx;
			height: 40rpx;
		}
		.group-manger{
			display: flex;
			align-items: center;
		}
		.group{
			flex: 1;
		}
	}
	.members{
		display: flex;
		flex-wrap: wrap;
		// justify-content: space-between;
		max-height: 450rpx;
		overflow-y: scroll;
		padding: 0 32rpx 30rpx;
		// margin-right: -5%;
		// border-bottom: 1rpx solid #ddd;
		.member-item{
			width: 16%;
			position: relative;
			text-align: center;
			font-size: $uni-font-size-sm;
			margin-top: 20rpx;
			margin-right: 5%;
			&:nth-child(5n){
				margin-right: 0;
			}
			.box{
				width: 100%;
				padding-bottom: 100%;
				height: 0;
				position: relative;
				.photo{
					width: 100%;
					height: 100%;
					border-radius: 20rpx;
					position: absolute;
					top: 0;
					left: 0;
				}
			}
			.name{
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
			.delete{
				position: absolute;
				box-sizing: border-box;
				padding: 6rpx;
				top: -10rpx;
				right: -10rpx;
				width: 36rpx;
				height: 36rpx;
				border-radius: 18rpx;
				background-color: #ff643d;
			}
			.hide{
				display: none;
			}
			.invite-box{
				position: relative;
				width: 100%;
				padding-bottom: 100%;
				height: 0;
				background-color: #ffe431;
				border-radius: 20rpx;
			}
			.invite{
				box-sizing: border-box;
				padding: 30%;
				width: 100%;
				height: 100%;
				position: absolute;
				top: 0;
				left: 0;
			}
		}
		
	}
</style>
