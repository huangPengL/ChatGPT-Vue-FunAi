<template>
  <div ref="snowflake" class="login-container">
    <div class="top">
      <p class="title" style="margin-top: 50px">
        FunAi
      </p>
      <p class="title">
          【
          <span v-for="(char, index) in animatedText" :key="index">
            {{ char }}
          </span>
          】
      </p>
      
    </div>
    
    <div class="mid">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form"  label-position="left">
        <el-form-item prop="loginAcct">
          <el-input v-model="loginForm.loginAcct" name="loginAcct" suffix-icon="el-icon-user" type="text"  placeholder="用户名/手机号" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            :type="pwdType"
            v-model="loginForm.password"
            suffix-icon="el-icon-lock"
            name="password"
            auto-complete="on"
            placeholder="密码"
            @keyup.enter.native="handleLogin" />
        </el-form-item>

        <div style="display: flex; justify-content: space-between;">
          <div>
            <router-link to="/UserReset" style="text-decoration: none;">
              <span class="forget-pwd">忘记密码？</span>
            </router-link>
            <span>&nbsp;&nbsp;</span>
            <router-link to="/UserRegister" style="text-decoration: none;">
              <span class="forget-pwd">立即注册！</span>
            </router-link>
          </div>
          <span>
            <a href="#"  class="third-login" @click="linkToWb">
                        <img style="width: 18px;height: 18px;" src="@/assets/img/loginImg/weibo.png"/>
                        
            </a>
            <span>&nbsp;&nbsp;</span>
            <a href="#"  class="third-login" @click="linkToWx">
                      <img  src="@/assets/img/loginImg/weixin.png"/>
                      
            </a>
          </span>
        </div>
        
        <el-form-item>
          <el-button :loading="loading" type="primary" icon="el-icon-s-promotion" style="width:100%;" @click.native.prevent="handleLogin">
            账号密码登录
          </el-button>
        </el-form-item>

        <el-form-item>
          <el-button :loading="loading" type="warning" icon="el-icon-thumb" style="width:100%;" @click="handleVisitorLogin">
            免登录注册直接体验~
          </el-button>
        </el-form-item>

        <!-- <el-form-item>
          <router-link to="/UserRegister">
            <el-button :loading="loading" type="primary" icon="el-icon-s-check" style="width:100%;">
              注册
          </el-button>
          </router-link>
        </el-form-item> -->
        <!-- <el-form-item>
          <router-link to="/UserReset">
            <el-button :loading="loading" type="primary" icon="el-icon-question" style="width:100%;">
              忘记密码
          </el-button>
          </router-link>
        </el-form-item> -->
        <el-form-item>
          <router-link to="/HomePage">
            <el-button :loading="loading" icon="el-icon-back" style="width:100%;">
              返回主页
            </el-button>
          </router-link>
        </el-form-item>
      </el-form>
    </div>

    <div class="buttom">
      <!-- copyright -->
      <div class="copyright">
        <p>&copy; 2023 FunAi. All Rights Reserved.</p>
      </div>
    </div>

    <!-- 雪花点标签 -->
    <div class="small-circle" v-for="(item,index) in smallCircle" :key="'smallCircle'+index" 
        :style="{
          'bottom':`${item.bottom}px`,
          'left':`${item.left}px`,
          'transition':`all ${item.timeStamp}`,

          }"
      >
      </div>

      <!-- 雪花标签 -->
      <img :src="item.imgSrc" 
          class="snowflake-img"
          v-for="(item,index) in snowflakeList" :key="'snowflakeImg'+index"
          :style="{
            'bottom':`${item.bottom}px`,
            'left':`${item.left}px`,
            'transition':`all ${item.timeStamp}`,
            'width':`${item.size}px`,
            'height':`${item.size}px`,
          }"
      >
  </div>
</template>

<script>
import { login ,getWxCode , getWbCode} from "@/api/getData";
import { EventBus } from '@/main'
import Cookies from 'js-cookie'
let _that
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error('用户名/手机号不能为空'))
      } else if( value.length < 2 || value.length >15){
        callback(new Error('用户名/手机号在2-15位之间'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 2 || value.length > 18) {
        callback(new Error('密码在2-18位之间噢！'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        loginAcct: '',
        password: '',
        loginType: 0,   // 默认普通登录
      },
      loginRules: {
        loginAcct: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined,

      text: "有意思的AI体验馆",
      animatedText: "", // 用于动画效果的文本
      intervalId: null, // 用于保存定时器的 ID
      pauseDuration: 3000, // 暂停时长（单位：毫秒）

      smallCircle:[],//保存雪花点数组
      snowflakeList:[],//保存雪花数组
      visualAreaWidth:0,//获取雪花x轴的范围
      visualAreaHeight:10,//获取雪花降落的高度
      randomlyGeneratedDotsTimes:null//保存我们的定时器
    }
  },
  mounted() {
    // 在组件挂载后开始执行动画
    this.startAnimation();
    _that.visualAreaWidth=_that.$refs.snowflake.clientWidth
    _that.visualAreaHeight=_that.$refs.snowflake.clientHeight
    _that.randomlyGeneratedDots()
    this.loginVerification()
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    
		_that=this
	},
  methods: {
    // 已经登录过，直接跳转功能页面
    loginVerification() {
      let token = Cookies.get('token')
      if(token != null && token != undefined) {
        this.$router.push("/ChatHome/NormalChat").catch(err => { console.log(err) });
      }
    },
    linkToWx() {
      // getWxCode().then(res => {
      //   if(res.code == 20000) {
      //     window.location.href = res.data.url;
      //   }else {
      //     this.$error.push(res.message)
      //   }
      // })
      this.$message.error("功能暂未开放，敬请期待！")
    },

    linkToWb() {
      // getWbCode().then(res => {
      //   if(res.code == 20000) {
      //     window.location.href = res.data.url;
      //   }else {
      //     this.$error.push(res.message)
      //   }
      // })
      this.$message.error("功能暂未开放，敬请期待！")
    },
    
    //每隔一秒生成若干雪花点和雪花
    randomlyGeneratedDots(){
      let id=0
      _that.randomlyGeneratedDotsTimes=setInterval(function(){
        id++
        //生成雪花点
        _that.generateSnowflakes(id)
        // //生成雪花
        // _that.getSnowflake(id)
      },1000)
    },
    //雪花点下降
    generateSnowflakes(id) {
      if (_that.smallCircle.length > 1000) {
        _that.smallCircle = [];
      }
      for (let i = 0; i < 12; i++) {
        let angle = Math.random() * Math.PI * 2; // 生成随机角度
        let speed = Math.random() * 3 + 1; // 生成随机速度
        let data = {
          left: Math.ceil(Math.random() * (_that.visualAreaWidth-50)),
          bottom: _that.visualAreaHeight,
          top: Math.ceil(Math.random() * _that.visualAreaHeight),
          timeStamp: Math.ceil(Math.random() * 10 + 1) + "s",
          id: id,
          angle: angle,
          speed: speed
        };
        _that.smallCircle.push(data);
        let nowIndex = _that.smallCircle.length - 1;
        setTimeout(function() {
          _that.smallCircle[nowIndex].bottom = 0
          _that.smallCircle[nowIndex].left =
            _that.smallCircle[nowIndex].left +
            Math.cos(angle) * speed * 20; // 根据角度计算偏移量
        }, 10);
      }
    },

    //生成雪花
    getSnowflake(id){
      //当我们雪花超过100个，清空数组，避免内存溢出
      if(_that.snowflakeList.length>10){
        _that.snowflakeList=[]
      }
      //保存雪花的数据
      //left 代表生成x轴的位置 bottom 代表初始化位置 top 代表Y轴消失的位置 timeStamp 代表设置我们动画的时间 imgSrc代表雪花样式 size代表雪花大小 id当前数据的标识
      //arr 保存我们雪花样式的路径
      let arr=[require("@/assets/img/xuehua.png")]
      for(let i = 0 ; i < 1; i++){
        let data={
          left:Math.ceil(Math.random()*_that.visualAreaWidth),
          bottom:_that.visualAreaHeight,
          top:Math.ceil(Math.random()*_that.visualAreaHeight),
          timeStamp:Math.ceil(Math.random()*10+1)+'s',
          imgSrc:arr[Math.floor(Math.random()*2)],
          size:Math.ceil(Math.random()*20+5)*2,
          id:id,
        }
        //
        _that.snowflakeList.push(data)
        let nowIndex=_that.snowflakeList.length-1
        //将我们的雪花降落到底部
        setTimeout(function(){
          _that.snowflakeList[nowIndex].bottom=0
        },5)
      }
    },

    // 逐字显示和擦除动画
    startAnimation() {
      this.intervalId = setInterval(() => {
        if (this.animatedText.length < this.text.length) {
          // 如果动画文本长度小于原始文本长度，则逐字添加
          this.animatedText = this.text.slice(0, this.animatedText.length + 1);
        } else {
          // 如果动画文本长度等于原始文本长度，则暂停 pauseDuration 后重新开始逐字删除
          clearInterval(this.intervalId); // 清除之前的定时器
          setTimeout(() => {
            this.intervalId = setInterval(() => {
              if (this.animatedText.length > 0) {
                // 如果动画文本长度大于 0，则逐字删除
                this.animatedText = this.animatedText.slice(0, this.animatedText.length - 1);
              } else {
                // 如果动画文本长度为 0，则重新开始逐字添加
                clearInterval(this.intervalId); // 清除当前的定时器
                this.startAnimation(); // 重新开始动画
              }
            }, 50);
          }, this.pauseDuration);
        }
      }, 150);
    },

    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.loginForm.loginType = 0
          login(this.loginForm).then(res => {
          if(res.code == 20000) {
              Cookies.set('token', res.data.token)
              Cookies.set('userId', res.data.userId)
              Cookies.set('username', res.data.username)
              this.$message.success("登录成功！")
              this.$router.push({name: "ChatHome", params: { type: 'NormalChat' }}).catch(err => { console.log(err) });
              EventBus.$emit('login-success','')
          }else {
              this.loading = false
              this.$message.error("登录失败! " + res.message)
          }
          })
        } else{
          this.$message.error("请正确填写登录信息");
          return false;
        }
      })
    },
    handleVisitorLogin(){
    
        this.loginForm.loginAcct = "FunAi";
        this.loginForm.password = "*****";
        this.loginForm.loginType = 2;
        this.loading = true;
          
        login(this.loginForm).then(res => {
          if(res.code == 20000) {
              Cookies.set('token', res.data.token)
              Cookies.set('userId', res.data.userId)
              Cookies.set('username', res.data.username)
              this.$message.success("游客登录成功！")
              this.loading = false;
              this.$router.push({name: "ChatHome", params: { type: 'NormalChat' }}).catch(err => { console.log(err) });
              EventBus.$emit('login-success','')
          }else {
              this.loading = false
              this.$message.error("游客登录失败! " + res.message)
          }
        })
    }
  },
  beforeDestroy() {
    // 组件销毁前清除定时器
    this.intervalId && clearInterval(this.intervalId);
    _that.randomlyGeneratedDotsTimes && clearInterval(_that.randomlyGeneratedDotsTimes);
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#4b2d40;
$light_gray:#eee;
$dark_gray:#889aa4;

/*****************  雪花点样式  *******************/
.small-circle{
  background-color: #FFFFFF;
  border-radius: 50%;
  width: 5px;
  height: 5px;
  position: absolute;
  z-index: 999;
}
/*****************  雪花样式  *******************/
.snowflake-img{
  position: absolute;
  z-index: 999;
}

/* reset element-ui css */
.login-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(to right,rgb(36, 99, 163),rgb(220, 222, 225));
    backdrop-filter: blur(1px); /*  元素后面区域添加模糊效果 */
    border-radius: 30px;
    animation: blink 2s infinite; /* 新增动画属性 */

  @keyframes blink {
    0% {
      box-shadow: -1px 1px 0px rgba(46, 103, 161, 0.4);
    }
    50% {
      box-shadow: -1px 1px 10px rgba(46, 103, 161, 1);
    }
    100% {
      box-shadow: -1px 1px 0px rgba(46, 103, 161, 0.4);
    }
  }
  .top{
    width: 100%;
    margin: 0px auto;
  }
  .mid{
    width: 60%;
    margin: 0px auto;
    margin-top: 20px;
  }
  .buttom{
    width: 80%;
    display: flex;
    // justify-content: space-between;
    justify-content: center;
    align-items: center;
    margin: 0px auto;
    .image-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-left: 20px;
      margin-bottom: 10px; /* 可根据实际情况进行调整，控制图片与span之间的间距 */
    }

    .image-label {
      margin-top: 10px; /* 可根据实际情况进行调整，控制span距离图片的间距 */
      text-align: center;
      color: #FFFFFF
    }
    .copyright {
      color: #121010; /* 根据需要设置文字颜色 */
      font-size: 12px; /* 根据需要设置文字大小 */
      position: absolute;
      bottom: 20px;
    }

    .copyright p {
      margin: 0;
    }
  }
  .title {
    font-size: 22px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 0px auto;
    text-align: center;
    font-weight: bold;
  }
  .el-input {
    display: inline-block;
    height: 35px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      color: $light_gray;
      height: 35px;
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
.forget-pwd {
  font-size:12px; 
  color: #eee;
  &:hover {
    color: blue;
    font-weight: bold;
  }
}
.third-login {
  text-decoration: none;
  &:hover {
    color: blue;
    font-weight: bold;
    cursor: pointer;
  }
  font-size: 14px;
  color:#000000e0;
}
</style>