// 全局请求路径，也就是后端的请求基准路径
import {socketSeverUrl, BASE_URL} from '@/util/js/commom.js'
// const BASE_URL = socketSeverUrl
// const BASE_URL = 'http://192.168.43.207:3001'
// 同时发送异步代码的次数，防止一次点击中有多次请求，用于处理
// let ajaxTimes=0;
// 封装请求方法，并向外暴露该方法
export const myHttp = (options)=>{
	
	// 解构请求头参数
	let header = {...options.header};
	// 当前请求不是登录时请求，在header中加上后端返回的token
	if(options.url != '/login'){
	    header["token"] = uni.getStorageSync('token_id') || 'noToken';
	}
	// ajaxTimes++;
	// 显示加载中 效果
	// uni.showLoading({
	// 	title: "加载中",
	//     mask: true,
	// });
	return new Promise((resolve,reject)=>{
		
		uni.request({
			url:BASE_URL+options.url,
			method: options.method || 'POST',
			data: options.data || {},
			header,
			success: async(res)=>{
				// console.log(res)
				// console.log("成功返回的数据:",res)
				if(res.data.status == 300){
					uni.navigateTo({
						url: "/pages/login/login"
					})
				}
				resolve(res)	
			},
			fail: (err)=>{
				reject(err)
			},
			// 完成之后关闭加载效果
			// complete:()=>{
			// 	ajaxTimes--;
			// 	if(ajaxTimes===0){
			//         //  关闭正在等待的图标
			//         uni.hideLoading();
			//     }
			// }
		})
	})
}

export const myUploadFile = (options)=>{
	
	// 解构请求头参数
	let header = {...options.header};
	// 当前请求不是登录时请求，在header中加上后端返回的token
	if(options.url != '/login'){
	    header["token"] = uni.getStorageSync('token_id') || 'noToken';
	}
	// ajaxTimes++;
	// // 显示加载中 效果
	// uni.showLoading({
	// 	title: "加载中",
	//     mask: true,
	// });
	return new Promise((resolve,reject)=>{
		
		uni.uploadFile({
			url:BASE_URL+options.url,
			method: options.method || 'POST',
			header:header,
			filePath: options.filePath,
			// fileType: options.fileType || "image",
			name: options.name || "file",
			formData:options.formData, //传递参数
			success: (uploadFileRes) => {
				resolve(uploadFileRes)
			  // this.cropFilePath = uploadFileRes.data;
			  //自定义操作
			},
			fail(e) {
			  reject(e)
			},
			// // 完成之后关闭加载效果
			// complete:()=>{
			// 	ajaxTimes--;
			// 	if(ajaxTimes===0){
			//         //  关闭正在等待的图标
			//         uni.hideLoading();
			//     }
			// }
		})
	})
}
