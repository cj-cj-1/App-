<template>
	<view class="bottom" :style="{bottom:keyboardheight+'px'}">
		<view class="send-message">
			<view class="" @click="changekeyBoardhandler">
				<image src="/static/image/voice.png" mode="" :class="{hide: voice}"></image>
				<image src="/static/image/keyboard.png" mode="" :class="{hide: !voice}"></image>
			</view>
			<textarea type="text" v-model="textContent" :class="{hide: voice}" :adjust-position="false" auto-height="true" maxlength="-1" @input="inputHandler" @focus="textFoucsHandler" @keyboardheightchange="keyboardheightchange" />
			<text :class="{speak: true,hide: !voice}"  @touchstart="voiceClickHandler" @touchend="voiceEndHandler" @touchmove="voiceMoveHandler">按住说话</text>
			<image src="/static/image/emoji.png" mode="" class="emoji" @click="emojiClickHandler" ></image>
			<image src="/static/image/morechange.png" mode="" @click="fileClickHandler" :class="{hide: !send}"></image>
			<view :class="{send:true,hide:send}" @click="sendClick">发送</view>
		</view>
		<view :class="{menu: true, hide: emoji}">
			<view v-for="(line, indexs) in emojiArr" class="line" :key="indexs">
				<view v-for="(item, index) in line" class="emoji-item" :key="index" @click="emojiItemClickHandler(item)" >
					{{item}}
				</view>
			</view>
			<image src="/static/image/delete.png" mode="" class="delete-emoji" @click="deleteHandler"></image>
		</view>
		<view :class="{file: true, hide: more}">
			<morechoise :friendid="friendid" :userid="userid" :imgurl='imgurl' :groupid='groupid' :isgroup="isgroup"></morechoise>
		</view>
	</view>
</template>

<script>
	import {emojiArr} from '@/util/js/emoji.js'
	import morechoise from '../morechoise/morechoise.vue'
	import {generateUUID} from '@/util/js/uuid.js'
	const recorderManager = uni.getRecorderManager();

	export default {
		components:{
			morechoise
		},
		data() {
			return {
				voice: false,			//是否隐藏声音按钮 true为隐藏
				height: 0,				//底部高度
				emoji: true,			//是否隐藏弹出表情 true为隐藏
				more: true,				//是否隐藏弹出更多 true为隐藏
				send: true,				//是否隐藏发送 true为隐藏
				textContent: '',		//文本框内容
				emojiArr: emojiArr,		//表情
				emojiArrPlat: [],		//	表情数组扁平化
				voicePath: '',			//录音路径
				timer: '',				//计时器
				voiceLength:'',			//录音长度
				isCancelRecord: false,	//是否取消录音
				pageY:'',				//目前移动的位置
				Recordthrottle: false,	//判断是否已经发送过取消录音给父组件
				keyboardheight: 0
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
			}
		},
		methods: {
			//切换键盘和录音
			changekeyBoardhandler(){
				this.voice = !this.voice
				this.more = true
				this.emoji = true
				this.getBottomElementHeight()
			},
			//获取高度
			getBottomElementHeight(){
				this.$nextTick(function(){
					setTimeout(()=>{
						const query = uni.createSelectorQuery().in(this);
						query.select('.bottom').boundingClientRect(data => {
							// console.log("data", data)
							if(this.height != data.height){
								this.height = data.height
								this.$emit("getBottomHeight", data.height + this.keyboardheight)
							}
							
						}).exec();
					},50)
				})
			},
			keyboardheightchange(e){
				// console.log(e)
				this.keyboardheight = e.detail.height
				// console.log(this.keyboardheight,this.height,this.height+this.keyboardheight)
				this.$emit("getBottomHeight", this.height+this.keyboardheight)
			},
			// blurHandler(){
			// 	this.keyboardheight = 0
			// 	this.$emit("getBottomHeight", this.height+this.keyboardheight)
			// },
			//判断高度，如果高度变化，需要发送给父组件
			inputHandler(){
				if(this.textContent != ''){
					this.send = false
				}else{
					this.send = true
				}
				
				this.getBottomElementHeight()
			},
			//长按按住说话时
			voiceClickHandler(e){
				// console.log(e)
				this.pageY = e.touches[0].pageY
				//重置
				this.Recordthrottle = false
				this.isCancelRecord = false
				this.$emit("RecardHandler", false)
				recorderManager.start();
				let i= 0
				this.voiceLength = 0
				this.$emit("recordLengthHandler",0)
				this.timer = setInterval(()=> {
					i++
					if(i > 18){
						clearInterval(this.timer)
						this.voiceLength = i
						recorderManager.stop();
						
					}
					this.voiceLength = i
					// console.log(this.voiceLength,"时长")
					this.$emit("recordLengthHandler",this.voiceLength)
				},1000)
			},
			//结束点击时
			voiceEndHandler(){
				// console.log("stop",this.voiceLength)
				this.$emit("RecardHandler",true)
				recorderManager.stop();
				if(this.timer){
					clearInterval(this.timer)
				}
			},
			voiceMoveHandler(e){
				// console.log(e)
				// this.pagex = e.
				if((this.pageY - e.touches[0].pageY > 80) && this.Recordthrottle == false){
					//大于100之后只发送一次
					this.Recordthrottle = true
					//取消录音
					this.isCancelRecord = true
					console.log("取消")
					this.$emit("RecardHandler",true)
					if(this.timer){
						clearInterval(this.timer)
					}
					
					recorderManager.stop();
					
				}
			},
			//点击表情按钮
			emojiClickHandler(){
				this.voice = false
				this.more = true
				this.emoji = !this.emoji
				this.getBottomElementHeight()
			},
			//点击更多按钮
			fileClickHandler(){
				this.emoji = true
				this.voice = false
				this.more = !this.more
				this.getBottomElementHeight()
			},
			//点击发送按钮
			sendClick(){
				if(this.isgroup == 0){
					this.sendMessage(this.textContent, 0)
				}else{
					// console.log("ppp")
					this.sendGroupMessage(this.textContent, 0)
				}
				this.textContent = ''
				this.send = true
			},
			sendMessage(msg, type){
				this.socket.emit('message', msg, this.userid, this.friendid, this.imgurl ,type)
			},
			sendGroupMessage(msg,type){
				this.socket.emit('groupmessage', msg, this.userid, this.groupid, this.imgurl ,type)
			},
			//点击表情时，将表情添加到输入框中
			emojiItemClickHandler(item){
				this.textContent += item
				//判断是否需要显示发送按钮
				this.inputHandler()
				this.getBottomElementHeight()
			},
			deleteHandler(){
				if(this.textContent != ''){
					if(this.textContent.length >= 2){
						let temp = this.textContent.substring(this.textContent.length - 2)
						//判断是否是emoji
						if(this.emojiArrPlat.indexOf(temp) !== -1){
							// console.log(temp)
							this.textContent = this.textContent.substring(0, this.textContent.length - 2)
						}else{
							this.textContent = this.textContent.substring(0, this.textContent.length - 1)
						}
					}else{
						this.textContent = this.textContent.substring(0, this.textContent.length - 1)
					}
					//判断是否需要显示发送按钮
					this.inputHandler()
					this.getBottomElementHeight()
				}
			},
			textFoucsHandler(){
				this.emoji = true
				this.more = true
				this.getBottomElementHeight()
			},
		},
		created() {
			//将所有的emoji放在一个数组里，也就是将原有的emoji扁平化
			for(let i = 0; i < this.emojiArr.length; i++){
				this.emojiArrPlat.push(...this.emojiArr[i])
			}
			// console.log(this.emojiArrPlat)
			
			
		},
		mounted() {
			this.getBottomElementHeight()
			// console.log(this.userid)
			let self = this;
			recorderManager.onStop( async function (res) {
				//如果不是取消录音的情况
				if(!self.isCancelRecord){
					// console.log('recorder stop' + JSON.stringify(res));
					self.voicePath = res.tempFilePath;
					self.$emit("playHandler", self.voicePath)
					let time = new Date()
					let url = String(time.getFullYear()) + String(time.getMonth() + 1) + String(time.getDate())
					let name = generateUUID()+url
					// console.log(name)
					let result = await self.$myUploadFile({
						url:"/file-upload",
						filePath: self.voicePath,
						name: 'file',
						formData:{url: "record",name: name}
					})
					// console.log(result)
					if(result.statusCode == 200){
						let content = JSON.stringify({name: result.data, time: self.voiceLength})
						// 还没有测试
						console.log(content)
						if(self.isgroup == 0){
							self.sendMessage(content, 2)
						}else{
							self.sendGroupMessage(content, 2)
						}
					}
				}
			});
			
			// console.log(this.userid)
		}
	}
</script>

<style lang="scss" scoped>
	.bottom{
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		padding-bottom: env(safe-area-inset-bottom);
	}
	.send-message{
		display: flex;
		align-items: center;
		padding: 20rpx 30rpx;
		background-color: #eee;
		image{
			width: 56rpx;
			height: 56rpx;
			vertical-align: middle;
		}
		
		.emoji{
			margin-right: 20rpx;
		}
		textarea{
			flex:1;
			margin: 0 20rpx;
			background-color: #fff;
			padding: 10rpx 20rpx;
			border-radius: 10rpx;
			line-height: 40rpx;
			max-height: 120rpx;
		}
		.speak{
			flex:1;
			margin: 0 20rpx;
			padding: 10rpx 20rpx;
			background-color: #fff;
			text-align: center;
			border-radius: 10rpx;
		}
		.send{
			padding: 10rpx 20rpx;
			background-color: #ffe431;
			border-radius: 10rpx;
			
		}
	}
	.hide{
		// 这里需要加！important是因为.file设置了display为flex,所以导致hide层级不够高而无法隐藏，所以需要加!important
		display: none !important;
	}
	.menu{
		width: 100%;
		height: 463rpx;
		background-color: #eee;
		overflow: hidden;
		overflow-y: scroll;
		padding-bottom: 120rpx;
		box-sizing: border-box;
		.line{
			display: flex;
			align-items: center;
			margin-top: 20rpx;
			.emoji-item{
				flex: 1;
				text-align: center;
				font-size: $uni-font-size-lg;
			}
		}
		.delete-emoji{
			position: absolute;
			right: 20rpx;
			bottom: 30rpx;
			width: 50rpx;
			height: 50rpx;
			padding: 10rpx 20rpx;
			background-color: rgba(255,255,255,.9);
			border-radius: 10rpx;
		}
	}
	.file{
		display: flex;
		align-items: center;
		width: 100%;
		height: 200rpx;
		background-color: #eee;
	}
</style>
