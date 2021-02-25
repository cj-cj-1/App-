<template>
	<view class="content">
		<!-- 头部 -->
		<top :imgurl="userInfo.imgurl" :userid="userid"></top>
		<!-- 好友列表 -->
		<view class="list">
			<friendlist v-for="(obj, index) in List" :key="index" :obj = obj @click.native="clickHandle(obj)"></friendlist>
		</view>
		<!-- 如果没有好友时 -->
		<!-- <view v-if="List.length ==0 && !hidden">
			<nofriend @hiddenHandler="hiddenHandler"></nofriend>
		</view> -->
	</view>
</template>

<script>
	import top from './components/top/top.vue'
	import friendlist from './components/frendlist/frendlist.vue'
	// import nofriend from './components/nofriend/nofriend.vue'
	import getUserid from '@/util/js/getUserid.js'
	export default {
		components:{
		        top,
				friendlist,
				// nofriend
		    },
		data() {
			return {
				title: "uni-app",
				List: [],
				userid: '',
				userInfo:'',
				// hidden: false,
				unread: 0,
				shielsUnread:0,
				friendListLength:0		//新朋友的个数
			}
		},
		methods: {
			async clickHandle(obj){
				console.log(obj)
				let userid = this.userid
				let username = obj.markname || obj.username
				let groupname = obj.groupname
				if(obj.id){
					// 修改群未读消息
					let result = await this.$myHttp({
						url: '/home/update-group-unread',
						data: {
							userid:userid,
							groupid:obj.id
						}
					})
					if(result.data.status === 200){
						uni.navigateTo({
							url:'/pages/chat/chat?groupid='+ obj.id + '&groupname='+ groupname + '&isgroup=' + obj.isgroup

						})
					}
					
				}else{
					// 修改好友未读消息
					let result = await this.$myHttp({
						url: '/home/update-unread',
						data: {
							userid:userid,
							friendid:obj.friendid
						}
					})
					if(result.data.status === 200){
						uni.navigateTo({
							url:'/pages/chat/chat?friendid='+ obj.friendid +'&imgurl=' + obj.imgurl + '&username='+ username + '&isgroup=' + obj.isgroup	
						})
					}
				}
			},
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
						this.userInfo = result.data.result[0]
					}	
				}	
			},
			async getGroupList(){
				let userid = this.userid
				let result = await this.$myHttp({
					url: '/home/groups',
					data: {
						userid
					}
				})
				let resultTemp = result.data.result
				if(result.data.status === 200){
					if(resultTemp){
						// this.List.push(...result.data.result) 
						for(let i = 0; i < resultTemp.length; i++){
							resultTemp[i].isgroup = 1
							this.List.push(resultTemp[i])
						}
					}	
				}
			},
			async getUserList(){
				//获取好友消息
				let res = await this.$myHttp({
					url:"/home/friends",
					data: {
						userid:this.userid
					}
				})
				let resultTemp = res.data.result
				this.List = []
				this.unread = 0
				this.friendListLength = 0
				await this.getApplyFriend()
				// this.List.push(...res.data.result)
				for(let i = 0; i < resultTemp.length; i++){
					resultTemp[i].isgroup = 0
					this.List.push(resultTemp[i])
				}
				//获取群消息
				await this.getGroupList()
				// 按照时间对好友和群列表排序
				this.List = this.List.sort((a, b)=> {
					if(a.lasttime < b.lasttime){
						return 1
					}else if(a.lasttime > b.lasttime){
						return -1
					}else{
						return 0
					}
				})
				// console.log(this.List)
				for(let i = 0; i< this.List.length;i++ ){
					if(this.List[i].shield == 0){
						this.unread += this.List[i].unread
					}else{
						this.shielsUnread += this.List[i].unread
					}
				}
				this.tabBarRedDot(this.unread,0)
				this.tabBarNewFriendRedDot(this.friendListLength,1)
			},
			// 显示tabbar红点的函数
			tabBarRedDot(unread, index){
				// 如果所有的unread大于0，则需要显示tabbar右上角的红点和数字
				if(unread > 0){
					unread = unread > 99 ? "..." :String(unread)
					uni.showTabBarRedDot({
						index:index
					})
					uni.setTabBarBadge({
						index:index,
						text:unread
					})
				}else if(this.shielsUnread > 0){
					uni.showTabBarRedDot({
						index:index
					})
				}else{
					uni.hideTabBarRedDot({
						index:index
					})
				}
			},
			// 显示新朋友的红点
			tabBarNewFriendRedDot(unread, index){
				// 如果所有的unread大于0，则需要显示tabbar右上角的红点和数字
				if(unread > 0){
					unread = unread > 99 ? "..." :String(unread)
					uni.showTabBarRedDot({
						index:index
					})
					uni.setTabBarBadge({
						index:index,
						text:unread
					})
				}else{
					uni.hideTabBarRedDot({
						index:index
					})
				}
			},
			//接收socket消息
			receiveMessage(){
				// let userid = this.userid
				this.socket.on('message', (message) => {
					// console.log("message")
					// 找到对应的好友，然后更新最后一条消息，
					// 这里不直接重新调用获取用户好友的函数是为了尽量少的访问后端
					// 减轻服务器的压力
					let index;
					for(let i = 0;i < this.List.length;i++){
						// 如果不是群，只有自己和好友会接收到消息，所以不用做很多的判断
						// 如果不是群，则知道对应的好友，该好友(friendid)肯定会满足是message的userid或者是message的toid，如果是群，则找对应的群
						if((!message.groupid && (this.List[i].friendid == message.userid || this.List[i].friendid == message.toid)) || (message.groupid && this.List[i].id == message.groupid)){
							index = i
							break
						}
						
					}
					if(index != undefined){
						this.List[index].lastMsg = message.content
						this.List[index].lasttime = message.time
						this.List[index].type = message.type
						this.List[index].unread = this.List[index].unread + 1
						if(message.username){
							this.List[index].username = message.username
						}
						// 修改后的最后一条消息放到最前面
						let tempListItem = this.List.splice(index, 1)
						// console.log("tempListItem",tempListItem)
						this.List.unshift(...tempListItem)
						if(this.List[0].shield == 0){
							this.unread += 1 
							this.tabBarRedDot(this.unread, 0)
						}else{
							// console.log(this.List[0],"hhhh")
							this.shielsUnread += 1
							this.tabBarRedDot(this.unread, 0)
						}
					}
					// console.log(this.List)
				})
				// 把对好友添加等的监听都放在首页是因为首页一开始就进行了onload方法，能够立即监听，而其他的
				// tabbar都还没有立即进行onload函数，也就没办法监听，所以需要写在首页里，
				// 即使是跳转到其他页面也能够监听到对应的socket函数
				this.socket.on('addfriend', async (friendid) => {
					let userid = this.userid
					if(userid == friendid){
						await this.getApplyFriend()
						console.log("this.friendListLength",this.friendListLength)
						this.tabBarNewFriendRedDot(this.friendListLength, 1)
						// console.log(this.friendListLength)
					}
				})
				this.socket.on('applyfriend', (fromid,friendid) => {
					let userid = this.userid
					console.log(fromid,friendid,userid)
					if(userid == fromid){
						// console.log("rrrrrrrr")
						this.tabBarRedDot(this.unread+1, 0)
					}
					if(userid == friendid){
						// this.List = []
						// console.log("rrrrrrrr")
						this.getUserList()
					}
				})
			},
			// 获取好友申请的个数
			async getApplyFriend(){
				let userid = getUserid()
				
				let result = await this.$myHttp({
					url:'/friend/get-apply-friend',
					data:{userid}
				})
				// console.log("userid",userid)
				if(result.data.status === 200){
					this.friendListLength = result.data.result.length
				}
			},
			// hiddenHandler(){
			// 	this.hidden = true
			// },
			login(){
				this.socket.emit('login', this.userid)
			},
			msg(){
				this.socket.on('login', id => {
					console.log("后端接收的消息",id)
				})
			}
		},
		async onLoad(){
			// console.log("kkkkkk")
			this.userid = getUserid()
			await this.getUserDetail()
			this.receiveMessage()
		},
		async onShow(){
			//在onshow这里也需要获取缓存的值是因为最开始的界面是index,所以onload一开始就会被执行,之后就不会再执行了,
			//而如果重新登录的话则需要重新获取缓存中的userid,所以必须在onShow中再次获取缓存的值

			this.userid = getUserid()
			if(this.userid){
				this.login()
				this.msg()
				this.List = []
				this.unread = 0
				this.friendListLength = 0
				this.shielsUnread = 0
				// 都先初始化为0
				this.tabBarRedDot(this.unread,0)
				this.tabBarNewFriendRedDot(this.friendListLength,1)
				await this.getUserDetail()
				await this.getUserList()
				// this.getGroupList()	
			}else{
				uni.navigateTo({
					url:'/pages/login/login'
				})
			}	
		}
}
</script>

<style lang="scss" scoped>
	.content{
		padding-top: var(--status-bar-height);	
	}
	.list{
		padding-top: 88rpx;
	}
	
</style>
