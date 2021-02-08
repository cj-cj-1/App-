<template>
	<view class="content">
		<searchBar @searchHandler="searchHandler" @cancelHandler="cancelHandler" ></searchBar>
		<view class="userlist">
			<searchFriend ref='searchFriend' :userid='userid' ></searchFriend>
		</view>
	</view>
</template>

<script>
	import searchBar from './components/search-bar/search-bar.vue'
	import searchFriend from './components/search-friend/search-friend.vue'
	export default {
		components:{
			searchBar,
			searchFriend
		},
		data() {
			return {
				userid: '',          // 用户id
				// isfriend: false,     //判断是否为好友
				// searchContent: '',   //搜索框的内容
				
			}
		},
		methods: {
			
			//搜索框输入时调用获取好友和获取群列表的函数
			searchHandler(msg){
				//调用子组件搜索好友的函数
				this.$refs.searchFriend.getFriendList(msg)
				this.$refs.searchFriend.getGroupList(msg)
			},
			//按下取消按钮时把friendList和groupList的内容清空
			cancelHandler(){
				//返回首页
				uni.switchTab({
					url:'/pages/index/index'
				})
			},
				
		},
		computed:{
			
		},
		onShow() {
			//获取用户的id
			let token = uni.getStorageSync('token_id')
			token = JSON.parse(token)
			this.userid = token.userid
		},

	}
</script>

<style lang="scss" scoped>
	.content{
		padding-top: var(--status-bar-height);		
	}
	.userlist{
		padding-top: 88rpx;
	}
</style>
