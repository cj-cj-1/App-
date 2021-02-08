<template>
	<view class="friend-detail">
		<view class="top" >
			<top title="详细信息" @returnClickHandler="returnClickHandler"></top>
		</view>
		<view class="friend-message">
			<view class="row">
				<view class="name">头像</view>
				<view class="content">
					<image :src="getImageUrl(friendInfo.imgurl)" mode="" class="photo"></image>
				</view>
			</view>
			<view class="row">
				<view class="name">昵称</view>
				<view class="content">
					{{friendInfo.username}}
				</view>
			</view>
			<view class="row space" @click="modifyHandler('备注',friendInfo.markname,false, 'markname')">
				<view class="name">备注</view>
				<view class="content">
					{{friendInfo.markname}}
				</view>
				<image src="../../static/image/arrow.png" mode=""class="back"></image>
			</view>
			<view class="row">
				<view class="name">签名</view>
				<view class="content">
					{{friendInfo.sign ? friendInfo.sign : "未填写"}}
				</view>
			</view>
			<view class="row">
				<view class="name">性别</view>
				<view class="content">
					{{friendInfo.sex =='1' ? '女' : '男'}}
				</view>
			</view>
			<view class="shield space">
				<view class="name">消息免打扰</view>
				<switch :checked="friendInfo.shield==1" @change="switchChange"  style="transform:scale(0.7)" color="yellow"/>
			</view>
			<view class="row">
				<view class="name">注册</view>
				<view class="content">
					{{formatTime(friendInfo.time)}}
				</view>
			</view>
			<view class="row">
				<view class="name">生日</view>
				<view class="content">
					{{formatTime(friendInfo.birthday)}}
				</view>
			</view>
			<view class="exit" @click="exitHandler">删除好友</view>
		</view>
		
		<view class="modal" :animation="annimatonData">
			<modify 
			@cancelHandler="cancelHandler" 
			@confirmHandler="confirmHandler" 
			:modifyTitle="modifyTitle"
			:isModifyPwd="isModifyPwd"
			:modifyParam="modifyParam"
			>
			</modify>
		</view>
	</view>
</template>

<script>
	import {getImageUrl, formatTime} from '@/util/js/format.js'
	import top from "@/components/top/top.vue"
	//引入裁剪图片的插件
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	//引入模态框子组件
	import modify from '@/components/modify/modify.vue'
	export default {
		components:{
			top,
			ImageCropper,
			modify,
		},
		data() {
			return {
				userid:'',
				isModify: false,		//是否弹出模态框
				annimatonData: '',		//动画
				modifyTitle: '',		//模态框的title
				modifyData: '',			//要修改的数据
				isModifyPwd: false,		//是否修改密码
				modifyParam:'',			//修改的参数
				friendInfo: {},			//好友信息
				sex:'',					//性别
				date:'',
				
			}
		},
		methods: {
			// 返回
			returnClickHandler(){
				uni.navigateBack({
					url:"/pages/chat/chat"
				})
			},
			//获取好友详细信息
			async getFriendDetail(){
				let userid = this.userid
				let friendid = this.friendid
				
				let result = await this.$myHttp({
					url: '/friend/detail',
					data: {
						userid,
						friendid
					}
				})
				if(result.data.status == 200){
					if(result.data.result){
						this.friendInfo = result.data.result
						this.sex = parseInt(this.friendInfo.sex)
						this.date = formatTime(new Date(this.friendInfo.birthday))
					}	
				}
			},
			//点击修改图标时弹出模态框
			modifyHandler(modifyTitle,modifyData,isModifyPwd,modifyParam){
				this.isModify = !this.isModify
				this.modifyParam = modifyParam
				let annimaton = uni.createAnimation({
					duration:300,
					timingFunction: 'ease'
				})
				if(this.isModify){
					this.modifyTitle = modifyTitle
					this.modifyData = modifyData
					this.isModifyPwd = isModifyPwd
					annimaton.bottom(0).step()
					
				}else{
					this.modifyTitle = ''
					this.modifyData = ''
					this.isModifyPwd = false
					annimaton.bottom("-100%").step()
				}
				//触发动画
				this.annimatonData = annimaton.export()
			},
			//接收子组件的传过来的取消函数
			cancelHandler(){
				this.modifyHandler()
			},
			//接收子组件传过来的确认函数
			async confirmHandler(param, paramName){
				// console.log(msg)
				let friendid = this.friendid
				let userid = this.userid
				let markname = param
				let result = await this.$myHttp({
					url:'/update-markname  ',
					data: {friendid, markname, userid}
				})
				if(result.data.status == 200){
					this.modifyHandler()
					//修改数据后需要重新获取群数据，这样用户信息才会显示
					this.getFriendDetail()
				}
				
			},
			// 消息免打扰
			async switchChange(e) {
				let friendid = this.friendid
				let userid = this.userid
				let shield;
				if(e.target.value == true){
					shield = "1"
				}else{
					shield = "0"
				}
				let result = await this.$myHttp({
					url:'/friend/shield',
					data: {friendid, userid, shield}
				})
			},
			async exitHandler(){
				let friendid = this.friendid
				let userid = this.userid
				uni.showModal({
					title:"提示",
					content:"确认删除！",
					success: async(res) => {
					        if (res.confirm) {
					           let result = await this.$myHttp({
					           	url:'/friend/reject',
					           	data: {userid, friendid}
					           })
					           console.log(result)
					           if(result.data.status == 200){
					           	uni.switchTab({
					           		url:"/pages/index/index"
					           	})
					           }
					        } 
					    }
				})
			}
				
		},
		computed:{
			//获得完整图片地址
			getImageUrl(){
				return function(url){
					return getImageUrl(url)
				}
			},
			//格式化时间
			formatTime(){
				return function(time){
					return formatTime(new Date(time))
				}
			},
		},
		onLoad(option) {
			this.userid = option.userid
			this.friendid = option.friendid
			this.getFriendDetail()
		}
	}
</script>

<style lang="scss" scoped>
	.friend-detail{
		padding-top: var(--status-bar-height);
		background-color: #eee;
		.friend-message{
			padding-top: 88rpx
		}
		// padding: 0 32rpx;
		.top{
			padding-top: var(--status-bar-height);
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			background-color: #fff;
			z-index: 10;
			
		}
		.shield{
			display: flex;
			align-items: center;
			height: 110rpx;
			line-height: 110rpx;
			padding: 0 34rpx;
			background-color: #fff;
			justify-content: space-between;
		}
		.space{
			margin-bottom: 20rpx;
		}
		.exit{
			margin-top: 20rpx;
			text-align: center;
			background-color: #fff;
			color: #dd5347;
			font-size: 40rpx;
			line-height: 110rpx;
		}
		.row{
			display: flex;
			align-items: center;
			height: 110rpx;
			line-height: 110rpx;
			padding: 0 34rpx;
			background-color: #fff;
			.name{
				font-size: 32rpx;					
			}
			.content{
				padding: 0 32rpx;
				flex: 1;
				display: block;
				color: $uni-text-color-grey;
				font-size: 32rpx;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
				.photo{
					width: 90rpx;
					height: 90rpx;
					vertical-align: middle;
				}
			}
			.back{
				width: 28rpx;
				height: 28rpx;
			}
			
			
		}
		.modal{
			position: fixed;
			height: 100%;
			left:0;
			right: 0;
			bottom: -100%;
			z-index: 99;
		}
	}
</style>
