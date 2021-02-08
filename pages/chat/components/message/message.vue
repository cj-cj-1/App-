<template>
	<view class="message" :style="{paddingBottom:bottomHeight+'px'}" >
		<image src="/static/image/loading.png" mode="" :class="{loading:true, hide: loading}" :animation="animatonData"></image>
		<scroll-view scroll-y="true" :scroll-top="scrollTop" class="scroll-view" :scroll-into-view="scrollTo" @scrolltoupper="scrollToUpperRefresh" >
			<view class="main" >
				<view class="message-item" v-for="(item, index) in messageList" :key="index" :id="'msg' + index">
					<view class="" v-if="item.userid !== userid">
						<view class="time" v-if="item.time">{{item.time}}</view>
						<view class="bottom-left">
							<image :src="getImageUrl(item.imgurl)" mode="" class="photo" ></image>
							<view class="">
								<view class="group-username" v-if="isgroup==1">{{item.username}}</view>
								<view class="text-message-left" v-if="item.type==0">{{item.content}}</view>
								<image :src="item.content" mode="widthFix" class="image-left" v-if="item.type==1" @click="previewHandler(item.content)"></image>
								<view class="record" v-if="item.type==2" :style="{width:item.content.time*4+'px'}" @click="playRecordHandler(item.content.name)">
									<image src="/static/image/record.png" mode=""></image>
									<view class="record-time">{{item.content.time}}{{second}}</view>
								</view>
								<view class="map-info"v-if="item.type==3" @click="mapClickHandler(item.content.latitude,item.content.longitude)">
									<view class="name">
										{{item.content.name}}
									</view>
									<view class="address">
										{{item.content.address}}
									</view>
									<image src="/static/image/mapimage.jpg" mode="" class="mapimage"></image>
								</view>
							</view>
						</view>
					</view>
					<view class="" v-else>
						<view class="time" v-if="item.time">{{item.time}}</view>
						<view class="bottom-right">
							<image :src="getImageUrl(item.imgurl)" mode="" class="photo"></image>
							<view class="text-message-right" v-if="item.type==0">{{item.content}}</view>
							<image :src="item.content" mode="widthFix" class="image-right" v-if="item.type==1" @click="previewHandler(item.content)"></image>
							<view class="record" v-if="item.type==2" :style="{width:item.content.time*4+'px'}" @click="playRecordHandler(item.content.name)">
								<image src="/static/image/record.png" mode=""></image>
								<view class="record-time">{{item.content.time}}{{second}}</view>
								<view class="dot"></view>
							</view>
							<view class="map-info"v-if="item.type==3" @click="mapClickHandler(item.content.latitude,item.content.longitude)">
								<view class="name">
									{{item.content.name}}
								</view>
								<view class="address">
									{{item.content.address}}
								</view>
								<image src="/static/image/mapimage.jpg" mode="widthFix" class="mapimage"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {getImageUrl, getChatTime, getRecordUrl} from '@/util/js/format.js'
	const innerAudioContext = uni.createInnerAudioContext();
	let newTime = new Date()
	let recordPlay = {}
	export default {
		data() {
			return {
				scrollTop: 0,			//设置竖向滚动条位置
				id: "a",
				messageList: [],
				imageList: [],			//存储图片
				time:'',
				// scrollTo: '',
				// nowPage: 0,
				skipNum:0,
				lastMessageTime: '',
				loading: true,			//隐藏loading
				throttle: true,			//节流阀
				animatonData: {},		
				timer: '',
				// recordPlay:{},			//声音要播放还是暂停
				// record: '',				//当前的录音地址
				recordArr:[],			//所有录音的地址
				second:`"`	,			//秒
			}
		},
		props:{
			userid:{
				type:String,
				// default: ''
			},
			friendid:{
				type:String,
				// default: ''
			},
			groupid:{
				type:String,
				// default: ''
			},
			imgurl:{
				type:String,
				default: ''
			},
			friendname:{
				type:String,
				default: ''
			},
			isgroup:{
				type:String
			},
			groupname:{
				type:String,
				default: ''
			},
			bottomHeight:{
				type: Number
			},
			scrollTo:{
				type:String,
				default: ''
			},
			voicePath:{
				type:String,
				default: ''
			},
		},
		methods: {
			// getMessage(){
			// 	console.log("getMessage")
			// },
			//请求数据
			async getMessage(){
				this.skipNum = this.messageList.length
				// console.log(this.messageList)
				//请求数据显示loading
				this.loading = false
				let animation = uni.createAnimation({
				  duration: 150,
				  timingFunction: "ease",
				})
				let i = 1
				this.timer = setInterval(()=>{
					animation.rotate(36 * i).step()
					i++
					//触发动画
					this.animatonData = animation.export()
				},150)
				
				//节流阀，防止多次请求数据，需要等处理完一次请求数据后才可以重新请求
				this.throttle = false
				let userid = this.userid
				let friendid = this.friendid
				// console.log(userid, friendid)
				let skipNum = this.skipNum
				let pageSize = 11
				let result;
				if(this.isgroup == 0){
					result = await this.$myHttp({
						url:'/message/load-more',
						data:{
							userid,
							friendid,
							skipNum,
							pageSize,
						}
					})
				}else{
					let groupid = this.groupid
					result = await this.$myHttp({
						url:'/message/load-groupmsg',
						data:{
							userid,
							groupid,
							skipNum,
							pageSize,
						}
					})
				}
				if(result.data.status == 200){
					// console.log("shujucg")
					let data = result.data.result
					if(data.length == 0){
						this.skipNum = -1
					}else{
						// console.log(data)
						if(this.skipNum == 0){
							this.lastMessageTime = String(data[0].time)
						}
						//处理数据
						for(let i = 0; i < data.length; i++){
							if(data[i].type == 1){
								data[i].content = this.getImageUrl(data[i].content)
								this.imageList.unshift(data[i].content)
							}else if(data[i].type == 2){
								// console.log(JSON.parse(data[i].content))
								data[i].content = JSON.parse(data[i].content)
								data[i].content.name =getRecordUrl(data[i].content.name)
								let name = data[i].content.name
								recordPlay[name] = true
								console.log(recordPlay)
								this.recordArr.unshift(name)
							}else if(data[i].type == 3){
								data[i].content = JSON.parse(data[i].content)
							}
							if(i < data.length - 1){
								data[i].time = getChatTime(data[i].time, data[i + 1].time)
							}else{
								data[i].time = getChatTime(data[i].time)
							}
						}
						this.messageList.push(...data)
						// console.log(this.nowPage * pageSize)
						// this.$emit("changeScrollTo", this.nowPage * pageSize - 1)
						this.$emit("changeScrollTo", this.skipNum - 1)
						this.throttle = true
					}
					//清除定时器，隐藏loading
					clearInterval(this.timer)
					this.loading = true
				}
			},
			//接收socket消息
			receiveMessage(){
				this.socket.on('message', (message) => {
					if((!message.groupid && (message.userid == this.friendid || message.userid == this.userid)) || message.groupid == this.groupid){
						// console.log(message)
						
						//深拷贝对象，因为里面有日期对象，日期对象是引用对象
						let newMessage = JSON.parse(JSON.stringify(message))
						let tempTime = message.time
						// console.log(newMessage) 
						if(newMessage.type == 1){
							newMessage.content = this.getImageUrl(newMessage.content)
							this.imageList.push(newMessage.content)
						}else if(newMessage.type == 2){
							// console.log(JSON.parse(data[i].content))
							newMessage.content = JSON.parse(newMessage.content)
							newMessage.content.name =getRecordUrl(newMessage.content.name)
							let name = newMessage.content.name
							recordPlay[name] = true
							this.recordArr.push(name)
							console.log("this.recordArr.length",this.recordArr.length)
						}else if(newMessage.type == 3){
							newMessage.content = JSON.parse(newMessage.content)
						}
						newMessage.time = getChatTime(tempTime, this.lastMessageTime)
						this.lastMessageTime = tempTime
						this.messageList.unshift(newMessage)
						this.$emit("changeScrollTo")
					}
				})
				
			},
			//下拉刷新
			scrollToUpperRefresh(){
				// console.log("hhhhhhh")
				if(this.skipNum != -1&& this.throttle == true){
					this.getMessage()
					// console.log("hhhhhhh")
				}
				// this.$emit("changeScrollTo")
			},
			//大图查看图片
			previewHandler(imgurl){
				let index = this.imageList.indexOf(imgurl)
				uni.previewImage({
					current: index,
					urls: this.imageList,
				});
			},
			//点击查看地图详情
			mapClickHandler(latitude, longitude){
				uni.openLocation({
					latitude: latitude,
					longitude: longitude,
					success: function () {
						console.log('success');
					}
				});
			},
			//播放/停止录音
			playRecordHandler(record){
				let lastRecord = this.record
				this.record = record
				// console.log(this.record)
				let isPlay = recordPlay[record]
				//判断当前点击的和上一次是否一样，如果一样说明有一次是播放，一次是暂停，所以需要把this.recordPlay[record]改了
				if(lastRecord == record){
					recordPlay[record] = !isPlay
					isPlay = recordPlay[record]
					// console.log('播放/停止录音');
					// console.log(this.recordPlay)
					if (record && isPlay) {
						innerAudioContext.src = record;
						innerAudioContext.play();
					}else if(!isPlay){
						innerAudioContext.stop();
					}
				}else{
					//如果不一样，那肯定就是要播放的
					recordPlay[record] = true
					innerAudioContext.src = record;
					innerAudioContext.play();
				}
			}
			
		},
		computed:{
			//获得完整图片地址
			getImageUrl(){
				return function(url){
					return getImageUrl(url)
				}
			},
			
		},
		created() {
			//进来时就更新一下当前时间
			// newTime = new Date()
			//调用请求数据的函数
			if(this.timer){
				clearInterval(this.timer)
			}
			// console.log("this.scrollTo","hhh")
			// this.getMessage()
			// console.log(this.getTime(new Date("2020,11,20"), new Date("2020,11,19")))
		},
		mounted(){
			
			this.getMessage()
			this.receiveMessage()
			console.log(this.scrollTo,"hhh")
			innerAudioContext.onEnded(() => {
				// console.log("结束")
				recordPlay[this.record] = false
				// //找到目前播放的音频，在结束后手动调用点击事件，让音频自动播放
				// let index = this.recordArr.indexOf(this.record)
				// if(index < this.recordArr.length - 1){
				// 	console.log(this.recordArr,index+1)
				// 	// console.log(this.recordArr[index + 1])
				// 	this.playRecordHandler(this.recordArr[index + 1])
				// }
			})
		},
		beforeDestroy() {
			if(this.timer){
				clearInterval(this.timer)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.message{
		// height: calc(100% - 88rpx - var(--status-bar-height));
		height: 100%;
		//这里需要设置为boder-box,要不然padding-bottom不会加在高度里面，导致message高度大于整个页面，会有滚动条
		box-sizing: border-box;
		// padding-bottom: env(safe-area-inset-bottom);
		padding-top: calc(88rpx + var(--status-bar-height));
		text-align: center;
		background-color: #f7f7f7;
		.loading{
			width: 40rpx;
			height: 40rpx;
		}
		.hide{
			display: none;
		}
	}
	.scroll-view{
		height: 100%;
		// height: calc(100vh - 88rpx);
		//这里需要设置为boder-box,要不然padding-bottom不会加在高度里面，导致message高度大于整个页面，会有滚动条
		box-sizing: border-box;
		background-color:#f7f7f7;
		.main{
			display: flex;
			flex-direction: column-reverse;
		}
	}
	.message-item{
		padding: 28rpx 30rpx 0;
		.time{
			text-align: center;
			font-size: $uni-font-size-sm;
			color: $uni-text-color-grey;
			padding-bottom: 10rpx;
		}
		.bottom-left{
			display: flex;	
			.photo{
				width: 80rpx;
				height: 80rpx;
				border-radius: 10rpx;
			}
			.group-username{
				font-size: $uni-font-size-sm;
				text-align: left;
				margin-left:25rpx;
			}
			.text-message-left{
				max-width: 480rpx;
				padding: 16rpx 20rpx;
				border-radius: 0rpx 20rpx 20rpx 20rpx;
				background-color: #fff;
				margin-left:20rpx;
				text-align: left;
			}
			.image-left{
				max-width: 300rpx;
				margin-left:20rpx;
			}
			.map-info{
				width: 350rpx;
				margin-left: 20rpx;
				background-color: #fff;
				.name{
					display: block;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					font-size: $uni-font-size-base;
					padding: 10rpx 5rpx;
				}
				.address{
					display: block;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					font-size: $uni-font-size-sm;
					padding: 0rpx 10rpx ;
					color: $uni-text-color-grey;
				}
				image{
					width: 100%;
					height: 200rpx;
				}
			}
			.record{
				display: flex;
				align-items: center;
				background-color: #fff;
				border-radius: 0rpx 20rpx 20rpx 20rpx;
				margin-left: 20rpx;
				min-width: 60rpx;
				max-width: 480rpx;
				padding: 16rpx 20rpx;
				font-size: $uni-font-size-sm;
				image{
					width: 35rpx;
					height: 35rpx;
					margin-right: 6rpx;
				}
			}
			
		}
		.bottom-right{
			display: flex;
			flex-direction: row-reverse;
			.photo{
				width: 80rpx;
				height: 80rpx;
				border-radius: 10rpx;
			}
			.text-message-right{
				max-width: 480rpx;
				padding: 16rpx 20rpx;
				border-radius: 20rpx 0rpx 20rpx 20rpx;
				background-color: #fff157;
				margin-right:20rpx;
				text-align: left;
			}
			.image-right{
				max-width: 300rpx;
				margin-right:20rpx;
			}
			.map-info{
				width: 350rpx;
				margin-right: 20rpx;
				background-color: #fff;
				.name{
					display: block;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					font-size: $uni-font-size-base;
					padding: 10rpx 5rpx;
				}
				.address{
					display: block;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					font-size: $uni-font-size-sm;
					padding: 0rpx 10rpx ;
					color: $uni-text-color-grey;
				}
				image{
					width: 100%;
					height: 200rpx;
				}
			}
			.record{
				display: flex;
				align-items: center;
				background-color: #fff157;
				border-radius: 20rpx 0rpx 20rpx 20rpx;
				margin-right: 20rpx;
				min-width: 60rpx;
				max-width: 480rpx;
				padding: 16rpx 20rpx;
				font-size: $uni-font-size-sm;
				image{
					width: 35rpx;
					height: 35rpx;
					margin-right: 6rpx;
				}
			}
		}
	}
</style>
