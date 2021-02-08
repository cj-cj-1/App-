export default function(){
	let tokenValue = uni.getStorageSync('token_id')
	if(!tokenValue){
		uni.redirectTo({
			url:'/pages/login/login'
		})
	}else{
		tokenValue = JSON.parse(tokenValue)
		return tokenValue.userid
	}
}