import {socketSeverUrl} from '@/util/js/commom.js'
export function formatDate(time){
	let nowDate = new Date()
	let year = time.getFullYear();
	let nowYear = nowDate.getFullYear();
	let month = time.getMonth() + 1;
	let nowMonth = nowDate.getMonth() + 1;
	let day = time.getDate();
	let nowDay = nowDate.getDate()
	let hour = time.getHours();
	// let nowHour = nowDate.getHours()
	let minute = time.getMinutes();
	// console.log(year + '年',month,day,hour,minute,second)
	if(year === nowYear && month === nowMonth && day === nowDay){
		if(hour <= 12){
			minute = minute < 10 ? '0' + minute : minute
			return "上午 " + hour + ":" +minute
		}else{
			hour -= 12
			minute = minute < 10 ? '0' + minute : minute
			return "下午 " + hour + ":" + minute
		}
	}else if(year === nowYear && month === nowMonth && (day + 1 === nowDay)){
		return  "昨天 "
	}else if(year === nowYear){		
		if(month < 10){
			month = '0' + month;
		}
		if(day < 10){
			day = '0' + day;
		}
		return  month + "月" + day + "日 " 
	}else{
		if(month < 10){
			month = '0' + month;
		}
		if(day < 10){
			day = '0' + day;
		}
		return year + "年" + month + "月" + day + "日"
	}

}
//获得图片地址
export function getImageUrl(url){
	// return "http://localhost:3001/user/" + url
	return socketSeverUrl + url
	// return "http://192.168.43.207:3001" + url
}

//获得录音地址
export function getRecordUrl(url){
	// return "http://localhost:3001/user/" + url
	return socketSeverUrl + url
	// return "http://192.168.43.207:3001" + url
}

//格式化时间
export function formatTime(time){
	let year = time.getFullYear();
	let month = time.getMonth() + 1;
	let day = time.getDate();

	if(month < 10){
		month = '0' + month;
	}
	if(day < 10){
		day = '0' + day;
	}

	return year + "-" + month + "-" + day 

}
export function getChatTime(newTime, oldTime){
	let time = ''
	// 获取当前数据的时间
	if(typeof newTime == "string"){
		newTime = new Date(newTime)
	}
	let newYear = newTime.getFullYear();
	let newMonth = newTime.getMonth() + 1;
	let newDay = newTime.getDate()
	let hour = newTime.getHours();
	let minute = newTime.getMinutes()
	
	minute = minute < 10 ? '0' + minute : minute
	if(hour <= 12){
		// minute = minute < 10 ? '0' + minute : minute
		hour =  "上午 " + hour 
	}else{
		hour -= 12	
		hour = "下午" + hour 
	}
	//获取当前的时间
	let nowDate = new Date()
	let nowYear = nowDate.getFullYear();
	let nowMonth = nowDate.getMonth() + 1;
	let nowDay = nowDate.getDate()
	if(newYear === nowYear && nowMonth === nowMonth && newDay === nowDay){
		time = hour + ':' + minute 
	}else if(newYear === nowYear && nowMonth === nowMonth && (newDay + 1 === nowDay)){
		time = "昨天 " + hour + ':' + minute 
	}else if(newYear === nowYear){									
		time =  newMonth + "月" + newDay + "日 " + hour + ':' + minute 
	}else{
		time = newYear + "年" + newMonth + "月" + newDay + "日 " + hour + ':' + minute 
	}
	
	if(arguments.length == 2){
		if(typeof oldTime == "string"){
			oldTime = new Date(oldTime)
		}
		if((newTime - oldTime) <= (1000 * 60 * 5)){
			time = ''		
		}
		return time	
	}else{
		return time
	}
	
}
	
