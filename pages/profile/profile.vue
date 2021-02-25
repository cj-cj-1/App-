<template>
	<view class="profile">
		<view class="top">
			我的
		</view>
		<view class="main" >
			<view class="row">
				<view class="name">头像</view>
				<view class="content" >
					<image-cropper :src="tempFilePath" @confirm="confirm"  @cancel="cancel"></image-cropper>
					<image :src="cropFilePath" @click="upload" class="meslist_img photo"></image>
					<!-- <image v-if="userInfo.imgurl" :src="getImageUrl(userInfo.imgurl)" mode="" class="photo"></image> -->
				</view>
				<image src="../../static/image/arrow.png" mode=""class="back" @click="upload"></image>
			</view>
			<view class="row" @click="modifyHandler('昵称',userInfo.username,false,'username')">
				<view class="name">昵称</view>
				<view class="content">
					{{userInfo.username}}
				</view>
				<image src="../../static/image/arrow.png" mode=""class="back"></image>
			</view>
			<view class="row">
				<view class="name">性别</view>
				<view class="content">
					<picker @change="bindPickerChange" :value="index" :range="array">
						<view class="uni-input">{{array[index]}}</view>
					</picker>
					<!-- {{userInfo.sex =='1' ? '女' : '男'}} -->
				</view>
				<image src="../../static/image/arrow.png" mode=""class="back"></image>
			</view>
			<view class="row">
				<view class="name">生日</view>
				<view class="content">
					<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
						<view class="uni-input">{{date}}</view>
					</picker>
					<!-- {{formatTime(userInfo.birthday)}} -->
				</view>
				<image src="../../static/image/arrow.png" mode=""class="back"></image>
			</view>
			<view class="row" @click="modifyHandler('签名',userInfo.sign?userInfo.sign:'',false,'sign')">
				<view class="name" >签名</view>
				<view class="content">
					{{userInfo.sign ? userInfo.sign : "未填写"}}
				</view>
				<image src="../../static/image/arrow.png" mode=""class="back"></image>
			</view>
			<view class="row">
				<view class="name">注册</view>
				<view class="content">
					{{formatTime(userInfo.time)}}
				</view>
				<!-- <image src="../../static/image/arrow.png" mode=""class="back"></image> -->
			</view>
			<view class="row password" @click="modifyHandler('密码',userInfo.password,true,'password')">
				<view class="name">密码</view>
				<view class="content">
					******
				</view>
				<image src="../../static/image/arrow.png" mode=""class="back"></image>
			</view>
			<view class="exit" @click="exitHandler">
				退出登录
			</view>
		</view>
		<view class="modal" :animation="annimatonData">
			<modify 
			@cancelHandler="cancelHandler" 
			@confirmHandler="confirmHandler" 
			:modifyTitle="modifyTitle"
			:modifyData="modifyData"
			:isModifyPwd="isModifyPwd"
			:modifyParam="modifyParam"
			>
			</modify>
		</view>
	</view>
</template>

<script>
	import Vue from 'vue'
	import io from '@/util/js/weapp.socket.io.js'
	import getUserid from '@/util/js/getUserid.js'
	import {getImageUrl, formatTime} from '@/util/js/format.js'
	import {socketSeverUrl} from '@/util/js/commom.js'
	//引入裁剪图片的插件
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	//引入模态框子组件
	import modify from '@/components/modify/modify.vue'
	export default {
		components: {
		    ImageCropper,
			modify,
			
		},
		data() {

			return {
				userid: '',
				userInfo: {},
				tempFilePath: "",        //临时的图片地址
				cropFilePath: "",		 //图片地址
				array: ['男', '女'],     //性别的选择
				index: 0,                //选择第几个性别
				date: '',      			//当前时间
				isModify: false,		//是否弹出模态框
				annimatonData: '',		//动画
				modifyTitle: '',		//模态框的title
				modifyData: '',			//要修改的数据
				isModifyPwd: false,			//是否修改密码
				modifyParam:''			,//修改的参数
				friendListLength: 0,		//好友申请
			}
		},
		methods: {
			async getUserDetail(){
				let userid = this.userid
				let result = await this.$myHttp({
					url: '/detail/find-user',
					data: {
						userid
					}
				})
				if(result.data.status === 200){
					if(result.data.result[0]){
						this.userInfo = result.data.result[0]
						this.cropFilePath = getImageUrl(this.userInfo.imgurl)
						this.index = parseInt(this.userInfo.sex)
						this.date = formatTime(new Date(this.userInfo.birthday))
					}	
				}
				
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
				  let userid = this.userid
				  let time = new Date()
				  let name = userid + time.getFullYear() + time.getMonth() + time.getDate() + time.getHours() + time.getMinutes() + time.getSeconds()
				  //调用自己封装好的文件上传api
					  let result  = await this.$myUploadFile({
						  url:"/file-upload",
						  filePath: filePath,
						  // filename: name,
						  formData:{url: "user",name: name}
					  })
					  // console.log(result)
					  //上传文件成功时
					  if(result.statusCode == 200){
						  // console.log("hhh")
						  this.cropFilePath = result.data.imgUrl
						  let result2 = await this.$myHttp({
						  	url:'/detail/modify',
						  	data: {userid: userid, paramName: 'imgurl', param: result.data}
						  })
					  }

			    },
			    cancel() {
			      console.log("canceled");
			      this.tempFilePath = "";
			    },
				//选择性别时
				bindPickerChange: async function(e) {
					let userid = this.userid
					this.index = e.target.value
					let index= this.index 
					let result = await this.$myHttp({
						url:'/detail/modify',
						data: {userid: userid, paramName: 'sex', param: index}
					})
					
				},
				//选择日期时
				bindDateChange: async function(e) {
					this.date = e.target.value
					let userid = this.userid
					let time = this.date
					// console.log("选择的生日时间是:", new Date(this.date))
					//发送修改日期的请求
					let result = await this.$myHttp({
						url:'/detail/modify',
						data: {userid: userid, paramName: 'birthday', param: time}
					})
				},
				getDate(type) {
					const date = new Date();
					let year = date.getFullYear();
					let month = date.getMonth() + 1;
					let day = date.getDate();
		
					if (type === 'start') {
						year = year - 60;
					} else if (type === 'end') {
						year = year + 2;
					}
					month = month > 9 ? month : '0' + month;;
					day = day > 9 ? day : '0' + day;
					return `${year}-${month}-${day}`;
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
				async confirmHandler(param, paramName, oldpwd){
					console.log(param, paramName)
					let password = oldpwd
					let userid = this.userid
					let result = await this.$myHttp({
						url:'/detail/modify',
						data: {userid, paramName, param,password}
					})
					console.log(result)
					if(result.data.status == 200){
						this.modifyHandler()
						//修改数据后需要重新获取用户数据，这样用户信息才会显示
						this.getUserDetail()
					}else if(result.data.status == 301){
						uni.showToast({
							title:"用户名已存在",
							icon:"none"
						})
					}else if(result.data.status == 400){
						uni.showToast({
							title:"密码错误",
							icon:"none"
						})
					}
					
				},
				//退出登录
				exitHandler(){
					let that = this
					uni.showModal({
						title: '提示',
						content:'确认退出登录',
						success: function(res){
							if(res.confirm){
								//删除localStorage,同时重定向到登录页面
								uni.removeStorageSync('token_id');
								// that.socket.emit("logout",that.userid)
								if(that.socket){
									that.socket.close()
									Vue.prototype.socket = io(socketSeverUrl,{
										transports: ['websocket'], // 此项必须设置
										reconnectionAttempts: 3, // 失败后重新连接次数，一直失败总共尝试四次
										reconnectionDelay: 2000, // 重新连接间隔时间毫秒
										forceNew: true,
									})
								}
								
								uni.reLaunch({
									url:'/pages/login/login'
								})
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
			//生日时间选择里的开始时间
			startDate() {
				return this.getDate('start');
			},
			//生日时间选择里的结束时间
			endDate() {
				return this.getDate('end');
			}
			
		},
		onShow() {
			//获取用户id
			this.userid = getUserid()
			//发送请求获取用户详细信息
			this.getUserDetail()
		}
	}
</script>

<style lang="scss" scoped>
	page{
		// height:100%;
		height: 100vh;
	}
	.profile{
		position: absolute;
		left:0;
		top: var(--status-bar-height);;
		right: 0;
		bottom: 0;
		// min-height: 100%;
		padding-bottom: var(--window-bottom);
		background-color: #eee;
		.top{
			height: 88rpx;
			text-align: center;
			line-height: 88rpx;
			font-size: $uni-font-size-lg;
			border-bottom: 1rpx solid #eee;
			background-color: #fff;
		}
		.main{
			// background-color: #eee;
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
			.password{
				margin-top: 20rpx;
			}
			.exit{
				text-align: center;
				margin: 50rpx 50rpx;
				border-radius: 40rpx;
				height: 80rpx;
				line-height: 80rpx;
				background-color: #ffe431;
				
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
