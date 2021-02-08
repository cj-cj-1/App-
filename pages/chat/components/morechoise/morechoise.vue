<template>
	<view class="more">
		<view class="photo">
			<image src="/static/image/album.png" mode="" @click="clickHandler('album')"></image>
			<view>相册</view>
		</view>
		<view class="photo">
			<image src="/static/image/camera.png" mode="" @click="clickHandler('camera')"></image>
			<view>拍照</view>
		</view>
		<view class="photo">
			<image src="/static/image/map.png" mode="" @click="clickMapHandler"></image>
			<view>定位</view>
		</view>
	</view>
</template>

<script>
	import {generateUUID} from '@/util/js/uuid.js'
	export default {
		data() {
			return {

			}
		},
		props:{
			userid: {
				type: String,
				default:''
			},
			friendid: {
				type: String,
				default:''
			},
			imgurl:{
				type:String,
				default: ''
			},
			groupid:{
				type:String,
				// default: ''
			},
			isgroup:{
				type:String
			},
		},
		methods: {
			//点击相册或拍照
			clickHandler(type){
				let count = 9
				if(type == 'camera'){
					count = 1
				}
				uni.chooseImage({
				    count: count, //默认9
				    sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: [type], //从相册选择
				    success: async(res) => {
						console.log(res.tempFilePaths)
						for(let i = 0; i < res.tempFilePaths.length; i++){
						let filePath = res.tempFilePaths[i]
						let time = new Date()
						let url = String(time.getFullYear()) + String(time.getMonth() + 1) + String(time.getDate())
						let name = generateUUID() + i
						// let name = this.userid
						//调用自己封装好的文件上传api
						let result  = await this.$myUploadFile({
							url:"/file-upload",
							filePath: filePath,
							formData:{url: url,name: name}
						})
						//这里后续需要发送给socket
						console.log(result)
						if(result.statusCode == 200){
							if(this.isgroup == 0){
								this.sendMessage(result.data, 1)
							}else{
								this.sendGroupMessage(result.data, 1)
							}
							
						}
					 }
				    },
				  });
			},
			//点击地图时
			clickMapHandler(){
				let that = this
				uni.chooseLocation({	
					async success(res){
						let content = {
							name: res.name,
							address: res.address,
							latitude: res.latitude,
							longitude: res.longitude
						}
						//这里用this的话其实是指向于uni,而不是这个组件本身，所以要用that
						let userid = that.userid
						let friendid = that.friendid
						content = JSON.stringify(content)
						console.log(content)
						if(that.isgroup == 0){
							that.sendMessage(content, 3)
						}else{
							that.sendGroupMessage(content, 3)
						}
						
					}
				})
			},
			sendMessage(msg, type){
				console.log(msg)
				this.socket.emit('message', msg, this.userid, this.friendid, this.imgurl ,type)
			},
			sendGroupMessage(msg,type){
				this.socket.emit('groupmessage', msg, this.userid, this.groupid, this.imgurl ,type)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.more{
		display: flex;
		align-items: center;
		width: 100vw;
		.photo{
			flex:1;
			text-align: center;
			// margin-top: 52rpx;
			image{
				width: 50rpx;
				height: 50rpx;
				padding: 15rpx 25rpx;
				background-color: #fff;
				border-radius: 20rpx;
			}
		}
	}
</style>
