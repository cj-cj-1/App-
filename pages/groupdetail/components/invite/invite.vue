<template>
	<view>
		<view class="userlist">
			<userlist @selectHandler="selectHandler" :userid="userid" ref="userlist"></userlist>
		</view>
		<view class="button">
			<view :class="{confirm:true,noconfirm:variable}" @click="inviteHandler">确定</view>
			<view class="cancel" @click="cancelHandler">取消</view>
		</view>
	</view>
</template>

<script>
	import userlist from "@/pages/group/components/userlist/userlist.vue"
	export default {
		components:{
			userlist
		},
		data() {
			return {
				user:[],
				variable:true
			}
		},
		props:{
			userid:{
				type:String,
				default:''
			}
		},
		methods: {
			selectHandler(sum, friendid, selected){
				// 如果sum为0，则确定按钮显示浅灰色
				this.variable = sum == 0
				if(selected == false){
					let index = this.user.indexOf(friendid)
					this.user.splice(index,1)
				}
				else{
					this.user.push(friendid)
				}
				console.log(this.user)
			},
			inviteHandler(){
				if(this.variable == false){
					this.$emit("inviteMember", this.user)
					this.$refs.userlist.resetHandler()
					this.user = []
				}
			},
			// 取消
			cancelHandler(){
				this.$emit("cancelInvite")
				this.$refs.userlist.resetHandler()
				this.user = []
			}
		},
	}
</script>

<style lang="scss" scoped>
	.userlist{
		height: calc(100vh - 88rpx - 25vh - env(safe-area-inset-bottom));
	}
	.button{
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.confirm,.cancel{
		height: 6vh;
		line-height: 6vh;
		background-color: #ffe431;
		width: 45%;
		text-align: center;
		border-radius: 3vh;
	}
	.noconfirm{
		background-color: #fff299;
	}
</style>
