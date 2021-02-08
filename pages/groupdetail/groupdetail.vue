<template>
	<view class="groupdetail">
		<view class="top" >
			<top title="详细信息" @returnClickHandler="returnClickHandler"></top>
		</view>

		<groupmembers ref="groupmembers" :groupid="groupid" :userid="userid" :groupCreaterId="groupCreaterId" @inviteHandler="inviteHandler"></groupmembers>
		<view class="group-detail">
			<view class="row">
				<view class="name">头像</view>
				<view class="content" >
					<image-cropper :src="tempFilePath" @confirm="confirm"  @cancel="cancel"></image-cropper>
					<image :src="cropFilePath" @click="upload" class="meslist_img photo"></image>
				</view>
				<image src="../../static/image/arrow.png" mode=""class="back" @click="upload"></image>
			</view>
			<view class="row" @click="modifyHandler('群昵称',groupDetail.groupname,false, 'groupname')">
				<view class="name">群昵称</view>
				<view class="content">
					{{groupDetail.groupname}}
				</view>
				<image src="../../static/image/arrow.png" mode=""class="back"></image>
			</view>
			<view class="row" @click="modifyHandler('群签名',groupDetail.sign,false, 'sign')">
				<view class="name">群签名</view>
				<view class="content">
					{{groupDetail.sign}}
				</view>
				<image src="../../static/image/arrow.png" mode=""class="back"></image>
			</view>
			<view class="row" @click="modifyHandler('群公告',groupDetail.notice,false, 'notice')">
				<view class="name">群公告</view>
				<view class="content">
					{{groupDetail.notice}}
				</view>
				<image src="../../static/image/arrow.png" mode=""class="back"></image>
			</view>
			<view class="row">
				<view class="name">注册时间</view>
				<view class="content">
					{{formatTime(groupDetail.time)}}
				</view>
			</view>
			<view class="shield">
				<view class="name">消息免打扰</view>
				<switch :checked="groupDetail.shield==1" @change="switchChange"  style="transform:scale(0.7)" color="yellow"/>
			</view>
			<view class="exit" @click="exitHandler">退出群聊</view>
		</view>
		
		<view class="modal" :animation="animationData">
			<modify 
			@cancelHandler="cancelHandler" 
			@confirmHandler="confirmHandler" 
			:modifyTitle="modifyTitle"
			:isModifyPwd="isModifyPwd"
			:modifyParam="modifyParam"
			>
			</modify>
		</view>
		<view class="invite" :animation="animationData1" >
			<invite @cancelInvite="inviteHandler" @inviteMember="inviteMember" :userid="userid"></invite>
		</view>
	</view>
</template>

<script>
	import {getImageUrl, formatTime} from '@/util/js/format.js'
	import groupmembers from "./components/groupmembers/groupmembers.vue"
	import invite from "./components/invite/invite.vue"
	import top from "@/components/top/top.vue"
	//引入裁剪图片的插件
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	//引入模态框子组件
	import modify from '@/components/modify/modify.vue'
	export default {
		components:{
			top,
			groupmembers,
			ImageCropper,
			modify,
			invite
		},
		data() {
			return {
				groupid:'',
				userid:'',
				groupDetail:{},
				tempFilePath: "",        //临时的图片地址
				cropFilePath: "",		 //图片地址
				isModify: false,		//是否弹出模态框
				animationData: '',		//动画
				animationData1:'',		//邀请好友的电话
				modifyTitle: '',		//模态框的title
				modifyData: '',			//要修改的数据
				isModifyPwd: false,			//是否修改密码
				modifyParam:'',			//修改的参数
				groupCreaterId:'',		//群主的id	
				isinvite:false,			//是否邀请进群
			}
		},
		methods: {
			//获取群详细信息
			async getGroupDetail(){
				let groupid = this.groupid
				let userid = this.userid
				let result = await this.$myHttp({
					url:"/group/group-detail",
					data:{
						userid,
						groupid
					}
				})
				if(result.data.status == 200){
					this.groupDetail = result.data.result
					this.cropFilePath = getImageUrl(this.groupDetail.imgurl)
					this.groupCreaterId = result.data.result.userid
					// console.log(this.groupCreaterId)
				}
			},
			returnClickHandler(){
				uni.navigateBack({
					url:"/pages/chat/chat"
				})
			},
			//选择图片
			upload() {
				uni.chooseImage({
			        count: 1, //默认9
			        sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
			        sourceType: ["album","camera"], //从相册选择
			        success: (res) => {
			          this.tempFilePath = res.tempFilePaths.shift();
					  // console.log(this.tempFilePath)
			        },
			      });
			    },
			    async confirm(e) {
					this.tempFilePath = "";
					this.cropFilePath = e.detail.tempFilePath;
				  // 图片上传
			
				  let filePath = this.cropFilePath
				  let groupid = this.groupid
				  let time = new Date()
				  let name = groupid + time.getFullYear() + time.getMonth() + time.getDate() + time.getHours() + time.getMinutes() + time.getSeconds()
				  //调用自己封装好的文件上传api
					  let result  = await this.$myUploadFile({
						  url:"/file-upload",
						  filePath: filePath,
						  // filename: name,
						  formData:{url: "groups",name: name}
					  })
					  // console.log(result)
					  //上传文件成功时
					  if(result.statusCode == 200){
						  // console.log("hhh")
						  this.cropFilePath = result.data.imgUrl
						  let result2 = await this.$myHttp({
						  	url:'/group/modify',
						  	data: {groupid: groupid, paramName: 'imgurl', param: result.data}
						  })
					  }
			
			    },
			    cancel() {
			      console.log("canceled");
			      this.tempFilePath = "";
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
					this.animationData = annimaton.export()
				},
				//接收子组件的传过来的取消函数
				cancelHandler(){
					this.modifyHandler()
				},
				//接收子组件传过来的确认函数
				async confirmHandler(param, paramName){
					// console.log(msg)
					let groupid = this.groupid
					let userid = this.userid
					let result = await this.$myHttp({
						url:'/group/modify',
						data: {groupid, paramName, param, userid}
					})
					console.log(result)
					if(result.data.status == 200){
						this.modifyHandler()
						//修改数据后需要重新获取群数据，这样用户信息才会显示
						this.getGroupDetail()
					}else if(result.data.status == 400){
						uni.showToast({
							title: '群名已存在',
							icon: 'none'
						})
					}
					
				},
				// 邀请进群的模态框
				inviteHandler(){
					// console.log("jjjjj")
					this.isinvite = !this.isinvite
					let annimaton = uni.createAnimation({
						duration:300,
						timingFunction: 'ease'
					})
					if(this.isinvite == true){
						annimaton.bottom(0).step()
					}else{
						annimaton.bottom("-100%").step()
					}
					
					//触发动画
					this.animationData1 = annimaton.export()
				},
				// 确定邀请进群
				async inviteMember(user){
					// console.log(msg)
					let groupid = this.groupid
					console.log(groupid)
					let result = await this.$myHttp({
						url:'/group/add-groupmember',
						data: {groupid, user}
					})
					console.log(result)
					if(result.data.status == 200){
						this.inviteHandler()
						//修改数据后需要重新获取群数据，这样用户信息才会显示
						this.$refs.groupmembers.getGroupmember()
						
					}
				},
				// 消息免打扰
				async switchChange(e) {
					let groupid = this.groupid
					let userid = this.userid
					let shield;
					if(e.target.value == true){
						shield = "1"
					}else{
						shield = "0"
					}
					let result = await this.$myHttp({
						url:'/group/shield',
						data: {groupid, userid, shield}
					})
				},
				async exitHandler(){
					let groupid = this.groupid
					let userid = this.userid
					uni.showModal({
						title:"提示",
						content:"确认退出群聊",
						success: async(res) => {
						        if (res.confirm) {
						           let result = await this.$myHttp({
						           	url:'/group/exit',
						           	data: {groupid, userid}
						           })
						           console.log(result)
						           if(result.data.status == 200 || result.data.status == 201){
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
		onShow() {
			this.getGroupDetail()
		},
		onLoad(option) {
			console.log(option)
			this.groupid = option.groupid
			this.userid = option.userid
		}
	}
</script>

<style lang="scss" scoped>
	.groupdetail{
		padding-top: var(--status-bar-height);
		background-color: #eee;
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
		.group-detail{
			margin-top: 20rpx;
			
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
		.invite{
			position: fixed;
			// height: calc(100vh - 25vh);
			left:0;
			right: 0;
			bottom: -100%;
			z-index: 100;
			padding: 32rpx;
			background-color: #faf5e6;
			border-radius: 40rpx 40rpx 0 0;
		}
	}
</style>
