import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import cookie from 'js-cookie'
// 创建axios实例
const service = axios.create({
    baseURL: 'http://localhost',
    timeout: 15000 // 请求超时时间
})
// http request 拦截器
service.interceptors.request.use(
    config => {
    // cookie有token的话就放到header中。
    if(cookie.get('token')) {
        config.headers['token'] = cookie.get('token')
    }
    return config
    },
    err => {
    return Promise.reject(err)
})
// http response 拦截器
service.interceptors.response.use(
    response => {
        //状态码是10002, 表示用户未登录
        if(response.data.code === 10002) {
            this.$message.error("用户未登录！")
            //弹出登录输入框
            this.$router.push({ path: '/UserLogin', query: {}}); 
            return
        } else if(response.data.code != 20000){
            this.$message.error(response.data.message)
        }
        return response.data
    },
    error => {
        return Promise.reject(error.response)
})

// 处理 json 格式的转换( 编码 解码 ）
function unitToString(unitArray) {
    let encodedString = String.fromCharCode.apply(null, new Uint8Array(unitArray))
    let decodedString = decodeURIComponent(escape(encodedString))
    return JSON.parse(decodedString) // 转对象
}

export default service
