<template>
	<view class="register">
		<view class="top">
			<image src="../../static/image/return.png" mode="" @click="goBack"></image>
		</view>
		<view class="logo">
			<image src="/static/image/rabbit.png" mode=""></image>
		</view>			
		<view class="register-input">
			<view>注册</view>
			<view class="input-view">
				<image src="/static/image/username.png" mode=""></image>				
				<input type="text" 
				 placeholder="请输入用户名" 
				 v-model="username"
				 placeholder-style="color:#ccc" 
				 @input="usernameInput" 
				 />
				<view class="" v-if="isuser">					
					<text v-if="isExist">用户名已存在</text>
					<image src="/static/image/Group3.png" mode="" v-else></image>
				</view>
			</view>
			<view class="input-view">
				<image src="/static/image/password.png" mode=""></image>
				<input :type="isPwd" placeholder="请输入密码" :value="password" @input="inputPassword" placeholder-style="color:#ccc"/>
				<view @click="lookUp">
					<image src="/static/image/lookup.png" mode="" v-if="lookUpPassword"></image>
					<image src="/static/image/eye-slash.png" mode="" v-else></image>
				</view>
			</view>
			<view class="input-view">
				<image src="/static/image/password.png" mode=""></image>
				<input :type="isConfirmPwd" placeholder="确认密码" :value="rePassword" @input="reconfirmPassword" placeholder-style="color:#ccc"/>
				<view @click="lookUpConfirm">
					<image src="/static/image/lookup.png" mode="" v-if="confirmPassword"></image>
					<image src="/static/image/eye-slash.png" mode="" v-else></image>
				</view>
			</view>
			
		</view>
		<view class="register-btn" @click="submitHandler">
			注册
		</view>
	</view>
</template>

<script>
	//引入防抖函数
	import {debounce} from '@/util/js/debounce.js'
	export default {
		data() {
			return {
				isuser: false, //是否要显示用户名存不存在的判断
				lookUpPassword: false, 
				confirmPassword: false, 
				isExist:false ,//false表示用户名不存在
				isPwd: "password",//input显示为文本或者密码
				isConfirmPwd: "password", //input显示为文本或者密码
				username: '',
				usernameDebounce: null,
				password: '',
				rePassword: '',
				userInfo: {}
			}
		},
		methods: {
			//点击切换placeholder的类型,控制密码是否以明文显示
			lookUp(){
				this.lookUpPassword = !this.lookUpPassword
				if(this.isPwd == "password"){
					this.isPwd = "text"
				}else{
					this.isPwd = "password"
				}
			},
			lookUpConfirm(){
				this.confirmPassword = !this.confirmPassword
				if(this.isConfirmPwd == "password"){
					this.isConfirmPwd = "text"
				}else{
					this.isConfirmPwd = "password"
				}
			},
			//返回登录页面
			goBack(){
				uni.navigateTo({
					url:'/pages/login/login'
				})
			},
			
			//当用户名的input输入时判断该用户是否存在
			usernameInput(){
				this.usernameDebounce()
			},
			usernameExist(){
				//调用防抖函数判断用户名是否存在
				this.usernameDebounce = debounce(async function(){
					let username = this.username
					if(this.username.trim() !== ''){
						let result = await this.$myHttp({
							url: '/valid',
							data: {username}
						})
						this.isuser = true
						if(result.data.res === 0){
							//等于0说明该用户名不存在，可以使用
							this.isExist = false
						}else{
							//用户名存在
							this.isExist = true
						}
					}else{
						//当用户输入的内容为空时判断用户是否存在的提示不显示
						this.isuser = false
					}
				}, 200)
			},
			//双向绑定password和密码框的值
			inputPassword(event){
				this.password = event.detail.value
			},
			//双向绑定repassword和确认密码框的值
			reconfirmPassword(event){
				this.rePassword = event.detail.value
			},
			//点击注册按钮
			async submitHandler(){
				//去掉空格
				let username = this.username.trim()
				let password = this.password.trim()
				let repassword = this.rePassword.trim()
				//当用户名，密吗，确认密码都不为空时
				if(username && password && repassword){
					//判断该用户是否已经注册过，如果注册过，则提醒已经注册过
					if(this.isExist){
						uni.showToast({
							title:"该用户已注册过，请不要重复注册",
							icon:'none',
							duration: 1500,
						})
					}else{
						//判断密码和确认密码是否一致,如果一致发送请求
						if(password === repassword){
							let result = await this.$myHttp({
								url: '/register',
								data: {
									username: username,
									password: password
								}
							})
							//如果返回的状态码为200则说明注册成功
							if(result.data.status === 200){
								uni.showToast({
									title:"注册成功",
									icon:'none',
									duration: 1500,
								})
								//清空input
								this.username = ''
								this.password = ''
								this.rePassword = ''
								this.isuser = false
								//注册成功后进行登录请求
								let result2 = await this.$myHttp({
									url:"/login",
									data: {
										username,
										password
									}
								})
								this.userInfo = result2.data
								let token = this.userInfo.res ? this.userInfo.res.token: ''
								let userid = this.userInfo.res ? this.userInfo.res.userid: ''
								let status = result2.data.status
								//登录成功后保存token并跳转到首页
								if(status === 200){
									uni.setStorageSync("token_id",JSON.stringify({token, userid }))
									
									await uni.switchTab({
										url: "/pages/index/index?userid="+this.userInfo.res.userid 
									})
								}else if(status === 500){
									uni.showToast({
										title: "服务器端发生错误",
										duration: 1500,
										icon:'none'
									})
								}			
							}else{
								uni.showToast({
									title:"注册失败",
									icon:'none',
									duration: 1500,
								})
							}
						}else{
							//提示用户密码不一致
							uni.showToast({
								title:"密码不一致",
								icon:'none',
								duration: 1500,
							})
						}
					}	
				}else{
					uni.showToast({
						title:"账号密码不能为空",
						icon:'none',
						duration: 1500,
					})
				}	
			}	
			
		},
		onLoad(option) {
			// console.log(option)
			//调用防抖函数
			this.usernameExist()
			
		}
	}
</script>

<style lang="scss" scoped>
	.register{
		padding-top: var(--status-bar-height);
		.top{
			display: flex;
			justify-content: space-between;
			padding: 30rpx 64rpx 0rpx;
			image{
				width: 50rpx;
				height: 50rpx;
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
		.register-input{
			padding: 54rpx 62rpx 120rpx;
			text-align: center;
			view{
				font-size: 56rpx;
				font-weight: bold;
			};
			.input-view{
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
				};
				text{
					font-size: $uni-font-size-base;
					color: #ff8483;
				}
			}
			
		}
		.register-btn{
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
