<template>
	<view class="chat" >
		<top :friendname="friendname" :groupname="groupname" :isgroup="isgroup" :userid="userid" :groupid="groupid" :friendid="friendid" ></top>
		<view :class="{mask:true, hide:hideMask}" :style="{bottom:bottomHeight+'px'}" >
			<view class="time-length" :style="{width:recordLength*4+'px'}">{{recordLength}}{{second}}</view>
			<view class="tip">上滑取消录音</view>
		</view>
		<message 
		:friendid="friendid" 
		:groupid="groupid"
		:groupname="groupname"
		:imgurl="imgurl" 
		:userid="userid" 
		:friendname="friendname" 
		:isgroup="isgroup"
		:bottomHeight="bottomHeight"
		:scrollTo="scrollTo"
		:voicePath="voicePath"
		@changeScrollTo="changeScrollTo"
		>
		</message>
		<bottom 
		@getBottomHeight="getBottomHeight" 
		@playHandler="playHandler"
		@RecardHandler="RecardHandler"
		@recordLengthHandler="recordLengthHandler"
		:friendid="friendid" 
		:userid="userid" 
		:imgurl="ownImgurl" 
		:groupid="groupid"
		:isgroup="isgroup"
		>
		</bottom>
	</view>
</template>

<script>
	import top from './components/top/top.vue'
	import message from './components/message/message.vue'
	import bottom from './components/bottom/bottom.vue'
	import getUserid from '@/util/js/getUserid.js'
	export default {
		components:{
			top,
			message,
			bottom,
		},
		data() {
			return {
				friendid: '',
				imgurl: '',
				userid: '',
				friendid: '',
				friendname:'',
				bottomHeight: 48,
				scrollTo:'',
				voicePath:'',
				recordLength: '0'		,//录音计时
				hideMask: true,
				ownImgurl: '',
				groupname:'',
				groupid:'',
				isgroup:'',
				second:`"`,
				
			}
		},
		methods: {
			//获取用户信息
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
						this.ownImgurl = result.data.result[0].imgurl
					}	
				}
				
			},
			//动态获取底部高度
			getBottomHeight(height){
				console.log("底部整体高度",height)
				this.bottomHeight = height
				this.changeScrollTo()
			},
			
			changeScrollTo(num){
				//先把原先的scrollTo 清除，然后再重新设置scrollTo ,让他滚动到底部，
				// 因为底部的数据在messageList里其实是第一条数据，所以就是取msg0
				this.scrollTo = ''
				if(num){
					num = num == -1 ? 0 : num
					this.$nextTick(function(){
						this.scrollTo = 'msg' + num
					})
					
				}else{	
					this.$nextTick(function(){
						this.scrollTo = 'msg0'
					})
				}
			},
			recordLengthHandler(len){
				// console.log("len",len)
				this.recordLength = len
			},
			playHandler(voicePath){
				this.voicePath = voicePath
			},
			RecardHandler(message){
				this.hideMask = message
			},
		},
		onShow() {
			
		},
		onLoad(option) {
			console.log(option)
			//isgroup为0表示是好友
			this.isgroup = option.isgroup
			if(option.isgroup == 0){
				this.friendid = option.friendid
				this.imgurl = option.imgurl
				this.friendname = option.username 
				console.log(this.friendname)
			}else{
				this.groupid = option.groupid
				this.groupname = option.groupname
			}
			
			// 获取用户id
			this.userid = getUserid()
			this.getUserDetail()
			
		},
	}
</script>

<style lang="scss" scoped>
	
	.chat{
		height: 100vh;
		.hide{
			//因为mask设置了display为flex，为了能够层叠掉这个类，所以要设置为！important
			display: none !important;
		}
		.mask{
			position: fixed;
			display: flex;
			padding-top: var(--status-bar-height);
			top: 0;
			left:0;
			right: 0;
			flex-direction: column;
			align-items: center;
			justify-content:center;
			z-index: 999;
			background-color:rgba(39,40,50,0.8);
			.time-length{
				background-color: #fff157;
				text-align: center;
				padding: 10rpx;
				border-radius: 20rpx;
				margin-bottom: 20rpx;
				min-width: 60rpx;
				max-width: 480rpx;
			}
			.tip{
				color:#f7f7f7
			}
			
		}
	}
</style>
