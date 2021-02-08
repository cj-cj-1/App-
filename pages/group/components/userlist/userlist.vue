<template>
	<scroll-view class="userlist" scroll-y="true" :scroll-top="scrollTop">
		<view class="list-item" v-for="(item,index) in userList" :key="index">
			<view :class="{icon:true, select:item.selected}" @click="iconClickHandler(index,item.friendid)">
				<image src="/static/image/Group2.png" mode="" :class="{check:true,tick:item.selected}" ></image>
			</view>
			<image :src="item.imgurl" mode="" class="photo"></image>
			<view class="name">
				{{item.markname?item.markname:item.username}}
			</view>
		</view>
	</scroll-view>
</template>

<script>
	import {getImageUrl} from '@/util/js/format.js'
	export default {
		data() {
			return {
				scrollTop: 0,
				selected:true,
				userList:[],
			}
		},
		props:{
			userid:{
				type:String,
				default:''
			},	
		},
		methods: {
			iconClickHandler(index, friendid){
				this.userList[index].selected = !this.userList[index].selected
				let selected = this.userList[index].selected
				let getUserLength = this.userList.filter((item)=>{
					return item.selected == true
				}).length
				// console.log(getUserLength, "hhh")
				this.$emit("selectHandler",getUserLength, friendid, selected)
			},
			// 将所有的选项都设置为不选择，供父组件调用
			resetHandler(){
				// console.log("jjj")
				for(let i = 0; i < this.userList.length; i++){
					this.userList[i].selected = false
				}
			},
			async getUserinfo(){
				let userid = this.userid
				let res = await this.$myHttp({
					url:"/home/friends",
					data: {
						userid
					}
				})
				if(res.data.status == 200){
					let userListTemp = res.data.result	
					for(let i = 0; i < userListTemp.length;i++){
						userListTemp[i].selected = false
						userListTemp[i].imgurl = getImageUrl(userListTemp[i].imgurl)
					}
					this.userList = userListTemp
					console.log(this.userList)
				}
			},
		},
		created() {
			console.log(this.userid)
			this.getUserinfo()
		}
	}
</script>

<style lang="scss" scoped>
	.userlist{
		padding-top: 20rpx;
		// padding-bottom: 20rpx;
		// height: calc(100vh - 188rpx - 90rpx - env(safe-area-inset-bottom));
		height: 100%;
		box-sizing: border-box;
	}
	.list-item{
		display: flex;
		align-items: center;
		padding-bottom: 20rpx;
		.icon{
			width: 48rpx;
			height: 48rpx;
			border-radius: 24rpx;
			background-color: #fff299;
			text-align: center;
			.check{
				width: 50%;
				height: 50%;
				vertical-align: middle;
				display: none;
			}
			.tick{
				display: inline-block;
			}
		}
		.select{
			background-color: #ffe431;
		}
		
		.photo{
			width: 80rpx;
			height: 80rpx;
			border-radius: 20rpx;
			margin: 0 30rpx;
		}
		.name{
			flex: 1;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}
	}
	
</style>
