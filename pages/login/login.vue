<template>
	<view class="login">
		<view class="top">
			<image src="/static/image/close.png" mode="" ></image>
			<text @click="toRegister">注册</text>
		</view>
		<view class="logo">
			<image src="/static/image/rabbit.png" mode=""></image>
		</view>			
		<view class="login-input">
			<view>登录</view>
			<view class="input-view">
				<image src="/static/image/username.png" mode=""></image>
				<input type="text" v-model="username" placeholder="请输入用户名" placeholder-style="color:#ccc;font-size:30rpx"/>
			</view>
			<view class="input-view">
				<image src="/static/image/password.png" mode=""></image>
				<input :type="isPwd"  placeholder="请输入密码" placeholder-style="color:#ccc;font-size:30rpx" :value="password" @input="inputPassword"/>
				<view @click="lookUp">
					<image src="/static/image/lookup.png" mode="" v-if="lookUpPassword"></image>
					<image src="/static/image/eye-slash.png" mode="" v-else></image>
				</view>
			</view>
		</view>
		<view class="login-btn" @click="loginHandler">
			登录
		</view>
	</view>
</template>

<script >
	export default {
		data() {
			return {
				username: '',
				password: '',
				isPwd: "password",
				lookUpPassword :false,
				userInfo: {}
			}
		},
		methods: {
			//点击切换密码是否以明文显示
			lookUp(){
				this.lookUpPassword = !this.lookUpPassword
				if(this.isPwd == "password"){
					this.isPwd = "text"
				}else{
					this.isPwd = "password"
				}
			},
			//跳转到注册页面
			toRegister(){
				uni.navigateTo({
					url:"/pages/register/register?abc='123'"
				})
			},
			inputPassword(event){
				// console.log(event)
				this.password = event.detail.value
			},
			//登录页面
			async loginHandler(){
				// console.log(this.username, this.password)
				let result = await this.$myHttp({
					url:"/login",
					data: {
						username: this.username.trim(),
						password: this.password.trim()
					}
				})
				this.userInfo = result.data
				let token = this.userInfo.res ? this.userInfo.res.token: ''
				let userid = this.userInfo.res ? this.userInfo.res.userid: ''
				let status = result.data.status
				if(status === 200){
					await uni.setStorageSync("token_id",JSON.stringify({token, userid }))
					uni.switchTab({
						url: "/pages/index/index?userid="+this.userInfo.res.userid 
					})
				}else if(status === 400){
					uni.showToast({
						title: "用户名或密码错误",
						duration: 1500,
						icon:'none'
					})
				}else if(status === 500){
					uni.showToast({
						title: "服务器端发生错误",
						duration: 1500,
						icon:'none'
					})
				}
				this.password = '',
				this.username = ''	
			},
		},
	}
</script>

<style lang="scss" scoped>
	.login{
		padding-top: var(--status-bar-height);
		.top{
			display: flex;
			justify-content: space-between;
			padding: 30rpx 64rpx 0rpx;
			image{
				width: 50rpx;
				height: 50rpx;
				vertical-align: bottom;
			}
			text{
				font-size: 36rpx;
				color: $uni-text-color;
				// font-family: PingFangSC-Medium;
			}
		}
		.logo{
			text-align: center;
			margin-top: 80rpx;
			image{
				width: 194rpx;
				height: 194rpx;
			}
		}
		.login-input{
			padding: 54rpx 62rpx 120rpx;
			text-align: center;
			view{
				font-size: 56rpx;
				font-weight: bold;
			}
			
			.input-view{
				display: flex;
				justify-content: space-between;
				align-items: flex-end;
				border-bottom: solid 1px $uni-border-color;
				input{
					flex: 1;
					padding: 80rpx 20rpx 0;		
					text-align: left;
					font-size: 30rpx;
					// border-bottom: solid 1px $uni-border-color;
				}
				image{
					height: 44rpx;
					width: 44rpx;
					vertical-align: bottom;
				};
			}
		}
		.login-btn{
			position: relative;
			left: 0;
			right: 0;
			margin: auto;
			text-align: center;
			width: 520rpx;
			height: 96rpx;
			line-height: 96rpx;
			background-color: #FFE431;
			border-radius: 48rpx;
		}
	}
</style>
