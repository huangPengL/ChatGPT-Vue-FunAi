import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import VueRouter from 'vue-router'
import 'element-ui/lib/theme-chalk/index.css';
import router from './router/index'
import "./mock/index.js"
import VueTextareaAutosize from "vue-textarea-autosize";
Vue.use(VueTextareaAutosize);

Vue.use(VueRouter)
Vue.config.productionTip = false
Vue.use(ElementUI);

import VueSSE from 'vue-sse';
import { Message } from 'element-ui';

// using defaults
Vue.use(VueSSE);
Vue.prototype.$message = Message;

export const EventBus = new Vue()

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')


router.beforeEach((to,form,next) => {
  window.document.title = to.meta.title == undefined ? 'FunAi':to.meta.title
  next()
})