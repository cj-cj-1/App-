import Vue from 'vue'
import App from './App'
import {myHttp, myUploadFile} from './request/index.js'
import io from '@/util/js/weapp.socket.io.js'

let serverUrl = 'http://192.168.1.102:3002'
Vue.config.productionTip = false
Vue.prototype.$myHttp = myHttp
Vue.prototype.$myUploadFile = myUploadFile
Vue.prototype.socket = io(serverUrl,{
    transports: ['websocket'], // 此项必须设置
	reconnectionAttempts: 3, // 失败后重新连接次数，一直失败总共尝试四次
	reconnectionDelay: 2000, // 重新连接间隔时间毫秒
	forceNew: true,
})
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
