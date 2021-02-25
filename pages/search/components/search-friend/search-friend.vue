<template>
	<view class="search-friend">
		<view class="user" v-if="friendList.length">
			用户
		</view>
		<view class="list-item" v-for="(item,index) in friendList" :key="index">
			<image :src="getImageUrl(item.imgurl)" mode=""></image>
			<view class="center">
				<view class="name" v-html="item.rename"></view>
				<view class="markname" v-if="item.markname">
					昵称：{{item.markname}}
				</view>
			</view>
			<view :class="{right:true, right_addfriend: !item.isfriend}" @click="jumpHandler(item.isfriend, item.userid,item.imgurl,item.username,item.markname)">
				{{rigthMsg(item.isfriend)}}
			</view>
		</view>
		<view class="group" v-if="groupList.length">
			群聊
		</view>
		<view class="list-item" v-for="(item,index) in groupList" >
			<image :src="getImageUrl(item.imgurl)" mode=""></image>
			<view class="center">
				<view class="name" v-html="item.reGroupName"></view>
			</view>
			<view :class="{right:true, right_addfriend: !item.isingroup}" @click="jumpGroupHandler(item.id, item.groupname,item.isgroup,item.isingroup)">
				{{rigthGroupMsg(item.isingroup)}}
			</view>
		</view>
		</view>
	</view>
</template>

<script>
	import {getImageUrl} from '@/util/js/format.js'
	export default {
		data() {
			return {
				// userid: '',          // 用户id
				// isfriend: false,     //判断是否为好友
				// searchContent: '',   //搜索框的内容
				friendList: [],
				groupList:[]
			}
		},
		props:{
			userid:{
				type: String,
				default: ''
			},
			ownImgurl:{
				type: String,
				default: ''
			}
			
		},
		methods: {
			//获取好友列表的函数
			async getFriendList(content){
				let result = await this.$myHttp({
					url: '/search/search-user',
					data: {username: content}
				})
				if(result.data.status == 200){
					// console.log(result.data.result)
					let TempFriendList = result.data.result
					// console.log(TempFriendList)
					
					let tempIndex;
					let userid = this.userid
					// console.log(result.data)
					//遍历每个搜索出来的对象判断是否为好友
					for(let i = 0; i < TempFriendList.length; i++){
						let friendid = TempFriendList[i].userid
						//将匹配的部分加上样式
						TempFriendList[i].rename = TempFriendList[i].username.replace(new RegExp(content, 'g'), "<span style='color:#FFE431';>" + content + "</span>")
						
						//判断是否是自己，如果是自己则记下来索引，后面可以直接删除
						if(friendid == userid){
							//获取自己的图片，传给聊天页面
							console.log(TempFriendList[i].imgurl)
							tempIndex = i
						}else{
							//如果userid不是自己则逐个发送请求，判断是否为好友
							let result2 = await this.$myHttp({
								url:'/search/isfriend',
								data:{
									userid,
									friendid
								}
							})
							if(result2.data.status == 200){
								TempFriendList[i].isfriend = result2.data.isfriend
								//如果是好友，则判断是否有昵称
								if(TempFriendList[i].isfriend){
									let result3 = await this.$myHttp({
										url: '/get-markname',
										data: {
											userid,
											friendid
										}
									})
									if(result3.data.status == 200){
										if(result3.data.res.length){
											// console.log(result3.data.res.length)
											TempFriendList[i].markname = result3.data.res[0].markname?result3.data.res[0].markname:''
										}
											
									}
								}
							}
						}
					}
					//如果是自己,删除掉自己
					if(tempIndex !== undefined){
						TempFriendList.splice(tempIndex, 1)
					}
					this.friendList = TempFriendList
					// console.log(this.friendList)
				}
			},
			//跳转到聊天界面或加好友界面
			async jumpHandler(isfriend, friendid, imgurl, username, markname){
				// console.log(username,markname)
				let ownImgurl = this.ownImgurl
				if(isfriend){
					let userid = this.userid
					username = markname||username
					let isgroup = 0
					// console.log(username)
					let result = await this.$myHttp({
						url: '/home/update-unread',
						data: {
							userid:userid,
							friendid:friendid
						}
					})
					if(result.data.status === 200){
						uni.redirectTo({
							url:'/pages/chat/chat?friendid='+ friendid +'&imgurl=' + imgurl + '&username='+ username + '&isgroup=' + isgroup
						})
					}
					
				}else{
					uni.redirectTo({
						url:'/pages/addfriend/addfriend?friendid=' + friendid +'&imgurl=' + imgurl + '&username='+ username + '&ownImgurl=' + ownImgurl
					})

				}
			},
			async jumpGroupHandler(groupid, groupname, isgroup,isingroup){
				// 在群内则直接跳转到群聊
				let userid = this.userid
				if(isingroup){
					let result = await this.$myHttp({
						url: '/home/update-group-unread',
						data: {
							userid,
							groupid
						}
					})
					if(result.data.status === 200){
						uni.redirectTo({
							url:'/pages/chat/chat?groupid='+ groupid + '&groupname='+ groupname + '&isgroup=' + isgroup
						})
					}
					
				}else{
					// 否则进群后跳转到首页
					let user = [this.userid]
					let result = await this.$myHttp({
						url:'/group/add-groupmember',
						data: {groupid, user}
					})
					if(result.data.status == 200){
						uni.showToast({
							title:"添加成功",
							icon:"none"
						})
						uni.switchTab({
							url:'/pages/index/index'
						})
					}
				}
				
			},
			async getGroupList(content){
				let userid = this.userid
				console.log(content)
				let result = await this.$myHttp({
					url: '/search/searchgroup',
					data: {groupname: content}
				})
				// console.log(result)
				if(result.data.status == 200){
					// console.log(result.data.result)
					let tempGroupList = result.data.result
					// 对搜索到的特殊标记
					for(let i = 0; i < tempGroupList.length; i++){
						tempGroupList[i].isgroup = 1
						tempGroupList[i].reGroupName = tempGroupList[i].groupname.replace(new RegExp(content, 'g'), "<span style='color:#FFE431';>" + content + "</span>")
						// 判断是否在群内
						let groupid = tempGroupList[i].id
						let result2 = await this.$myHttp({
							url:'/search/isingroup',
							data:{
								userid,
								groupid
							}
						})

						if(result2.data.status == 200){
							tempGroupList[i].isingroup = result2.data.isingroup
						}
					}
					this.groupList = tempGroupList
					console.log(this.groupList)
				}
			}
		},
		computed:{
			rigthMsg(){
				return function(isfriend){
					let msg = isfriend ? "发信息" : "加好友"
					return msg
				}
			},
			rigthGroupMsg(){
				return function(isingroup){
					console.log("isingroup",isingroup)
					let msg = isingroup ? "发信息" : "加群聊"
					return msg
				}
			},
			//获得完整图片地址
			getImageUrl(){
				return function(url){
					return getImageUrl(url)
				}
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	.search-friend{
		.user,.group{
			font-size: $uni-font-size-lg;
			font-weight: bold;
			padding-left: 40rpx;
			padding-top: 30rpx;
		}
		.list-item{
			display: flex;
			padding: 32rpx 40rpx 0;
			justify-content: space-between;
			align-items: center;
			image{
				width: 80rpx;
				height: 80rpx;
				border-radius: $uni-border-radius-base;
			}
			.center{
				flex: 1;
				padding-left: 30rpx;
				text-align: left;
				.name{
					font-size: 36rpx;
					// font-weight: bold;
				}
				.markname{
					font-size: $uni-font-size-sm;
					color: #9b9fa1;
				}
			}
			.right{
				font-size: $uni-font-size-sm;
				padding: 0 20rpx;
				height: 48rpx;
				line-height: 48rpx;
				background-color: #FFE431;
				border-radius: 24rpx;
			}
			.right_addfriend{
				background-color: rgba($color: #4AAAFF, $alpha: 0.1);
				color: #4AAAFF;
			}
		}
	}
</style>
