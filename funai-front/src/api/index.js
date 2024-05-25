import axios from 'axios'
import cookie from 'js-cookie'
import router from '@/router'; // 引入Vue Router
import Vue from 'vue'
//全局参数，自定义参数可在发送请求时设置
axios.defaults.timeout = 300000000 //超时时间ms
axios.defaults.withCredentials = true
// 请求时的拦截
//回调里面不能获取错误信息
axios.interceptors.request.use(
  function (config) {
      // cookie有token的话就放到header中。
    if(cookie.get('token')) {
      config.headers['token'] = cookie.get('token')
    }
    return config;
  },
  function (error) {
    // 当请求异常时做一些处理
    console.log('请求异常：' + JSON.stringify(error));
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(function (response) {
    // Do something with response data
    if(response.data.code === 10002) {
      //弹出登录输入框
      Vue.prototype.$message.error("请登录后使用！")
      cookie.remove('token');
      cookie.remove('userId');
      cookie.remove('username');
      router.push({ path: '/UserLogin'}).catch((err) => {});
      return
    } else if(response.data.code === 10004) {
      Vue.prototype.$message.error(response.data.message)
      cookie.remove('token');
      cookie.remove('userId');
      cookie.remove('username');
      router.push({ path: '/UserLogin'}).catch((err) => {});
      return
    }else {
      return response
    }
}, function (error) {
  // Do something with response error
  console.log('响应出错：' + error+'响应码'+response.data.code)
  return Promise.reject(error)
});


const base = {
  axios: axios,
  baseUrl: 'https://funai.space:8080'
  // baseUrl: 'http://localhost:8080'
  // baseUrl: 'http://127.0.0.1:8080'
}

export default base   
