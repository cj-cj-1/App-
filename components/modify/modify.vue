<template>
	<view class="modify">
		<view class="top">
			<view class="cancel" @click="cancelHandler">取消</view>
			<view class="title">{{modifyTitle}}</view>
			<view class="confirm" @click="confirmHandler" v-if="isconfrim">确定</view>
		</view>
		<view class="content">	
			<view v-if="isModifyPwd">
				<view v-if="!validPwdResult">
					<view class="oldpwd">
						<image src="/static/image/password.png" mode=""></image>
						<input type="password" v-model="oldpwd" placeholder="请输入原密码" key='1'/>
					</view>
					<view class="next" @click="validhandler">下一步</view>
				</view>
				<view class="newpwd" v-else>
					<image src="/static/image/password.png" mode=""></image>
					<input type="password" v-model="newpwd" placeholder="请输入新密码" key='2'/>
				</view>
			</view>
			<textarea v-model="modifyData" placeholder="" v-else/>
		</view>
	</view>
</template>

<script>
	import getUserid from '@/util/js/getUserid.js'

	export default {
		
		data() {
			return {
				modifyData: '',
				oldpwd: '',
				newpwd: '',
				validPwdResult: false,
				userid:''
			}
		},
		props:{
			isModifyPwd:{
				type:Boolean,
				default:false
			},
			modifyTitle:{
				type:String,
				default:''
			},
			modifyParam:{
				type:String,
			}
			
		},
		methods: {
			//点击取消时
			cancelHandler(){
				this.modifyData = ''
				this.newpwd = ''
				this.oldpwd = ''
				this.validPwdResult = false
				this.$emit("cancelHandler")
			},
			//点击确定时
			async confirmHandler(){
				let userid = this.userid
				let oldpwd = this.oldpwd
				let newpwd = this.newpwd.trim()
				let modifyParam = this.modifyParam
				let modifyData = this.modifyData
				if(this.validPwdResult && newpwd != ''){
					// 修改密码
					this.$emit("confirmHandler", newpwd, modifyParam,oldpwd)
					this.validPwdResult = false
					this.oldpwd = ''
					this.newpwd = ''
				}else if(!this.isModifyPwd && this.modifyData !=''){
					this.$emit("confirmHandler", modifyData, modifyParam)
					this.modifyData = ''
				}
			},
			//点击下一步时验证密码
			async validhandler(){
				let password = this.oldpwd.trim()
				let userid = this.userid
				// console.log(password)
				let result = await this.$myHttp({
					url:'/detail/valid',
					data:{
						userid,
						password
					}
				})
				if(result.data.status === 200){
					this.validPwdResult = true
				}else{
					uni.showToast({
						title: '密码错误',
						icon: 'none'
					})
				}
			}
		},
		created() {
			//获取用户id
			this.userid = getUserid()
		},
		computed:{
			isconfrim(){
				return (this.isModifyPwd&&this.validPwdResult) || !this.isModifyPwd
			}
		}
	}
</script>

<style lang="scss" scoped>
	.modify{
		padding-top: var(--status-bar-height);
		background-color: #fff;
		min-height: 100%;
		.top{
			display: flex;
			align-items: center;
			height: 88rpx;
			border-bottom: 1rpx solid #eee;
			padding: 0 34rpx;
			.cancel .confirm{
				width: 80rpx;
				height: 88rpx;
				text-align: center;
				font-size: $uni-font-size-base;
			}
			.confirm{
				color:#ffaf2e
			}
			.title{
				flex:1;
				font-size: $uni-font-size-lg;
				text-align: center;
				font-weight: bold;
			}
			
		}
		.content{
			padding: 0 34rpx;
		}
		textarea{
			width: 100%;
			height: 300rpx;
			padding: 6rpx;
			margin-top: 20rpx;
			background-color: #eee;
		}
		.oldpwd,.newpwd{
			display: flex;
			justify-content: space-between;
			align-items: flex-end;
			border-bottom: solid 1px $uni-border-color;
			input{
				flex: 1;
				padding: 80rpx 20rpx 0;		
				text-align: left;
			}
			image{
				height: 44rpx;
				width: 44rpx;
				vertical-align: bottom;
			}
			
		}
		.next{
			position: relative;
			left: 0;
			right: 0;
			margin: 50rpx auto;
			background-color: #ffe431;
			text-align: center;
			height: 60rpx;
			line-height: 60rpx;
			width: 200rpx;
			border-radius: 30rpx;
		}
	}
</style>
