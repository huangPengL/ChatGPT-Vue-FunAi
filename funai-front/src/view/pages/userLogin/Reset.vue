<template>
  <div class="login-container">

    <div class="top">
      <p class="title" style="margin-top: 80px">FunAi</p>
      <p class="title">
         【有意思的AI体验馆】
      </p>
    </div>

    <div class="mid">
      <el-form ref="resetForm" :model="resetForm"  :rules="resetRules" class="login-form"  label-position="left">
        <el-form-item prop="phone">
          <el-input v-model="resetForm.phone" name="phone" type="text" suffix-icon="el-icon-mobile-phone"  placeholder="手机号" />
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="resetForm.code" name='code' placeholder="请输入手机验证码"></el-input>
          <button class="smsButton" @click="sendCode" :disabled="disabled">{{buttonText}}</button>
          <!-- <el-button type="success" @click="sendCode" :disabled="disabled">{{buttonText}}</el-button> -->
        </el-form-item>
        <el-form-item prop="newPwd">
          <el-input v-model="resetForm.newPwd" name="newPwd" :type="pwdType" suffix-icon="el-icon-lock" auto-complete="on" placeholder="新密码" />
        </el-form-item>
        <div style="display: flex; justify-content: flex-end;">
          <router-link to="/UserLogin" style="text-decoration: none;"> 
                <span class="go-to-login">
                  登录页    
                </span>
          </router-link>
        </div>
        <el-form-item>
          <el-button  type="primary" icon="el-icon-finished" style="width:100%;"  :loading="loading" @click="resetPwd">
              确认重置密码
          </el-button>
        </el-form-item>
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
      <!-- 二维码 -->
        <!-- <div v-for="item in buttomQRCodeDetail" :key="item" class="image-wrapper">
          <el-image
            style="width: 150px; height: 150px"
            :src="item.url"
            :fit="item.fit"></el-image>
          <span class="image-label">{{ item.desc }}</span>
        </div>  -->

      <!-- copyright -->
      <div class="copyright">
        <p>&copy; 2023 FunAi. All Rights Reserved.</p>
      </div>
    </div>

  </div>
</template>

<script>
import { sendCode,reset } from "@/api/getData";

export default {
  name: 'Reset',
  data() {
    const validatePhone = (rule, value, callback) => {
      let reg = /^1[3-9]\d{9}$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('手机号格式不正确'))
      }
    }
    const validateCode = (rule, value, callback) => {
      if (value.length == 0 || value.length > 4) {
        callback(new Error('请输入4位数字验证码'))
      } else {
        callback()
      }
    }
    const validateNewPwd = (rule, value, callback) => {
      if (value.length < 2 || value.length > 18) {
        callback(new Error('密码在2-18位之间噢！'))
      } else {
        callback()
      }
    }
    return {
      resetForm: {
        newPwd: '',
        phone: '',
        code:''
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined,
      disabled: false,
      countDown: 120,
      buttonText: '发送',
      resetRules: {
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
        newPwd: [{ required: true, trigger: 'blur', validator: validateNewPwd }],
        code:[{ required: true, trigger: 'blur', validator: validateCode }]
      }
    }
  },
  watch: {
    
  },
  methods: {
    resetPwd() {
      this.$refs.resetForm.validate(valid => { 
        if(valid) {
          this.loading = true;
          reset(this.resetForm).then(res => {
            if(res.code == 20000) {
                this.$message.success("密码重置成功！")
                this.$router.push({ path: '/UserLogin', query: { }});
            }else {
                this.loading = false;
                this.$message.error(res.message);
            }
          })
        }else {
          this.loading = false;
          this.$message.error("请正确填写表单信息")
        }
      })
    },
    sendCode() {
        // 验证字段
        let reg = /^1[3-9]\d{9}$/;
        let phone = this.resetForm.phone;
        if (reg.test(phone)) {
          // 禁用按钮并启动计时器
          this.disabled = true
                  
          this.$message.success("正在发送验证码！")
          // 发送验证码
          phone = {phone}
          sendCode(phone).then(res => {
              if(res.code == 20000){
                this.$message.success("验证码已发送到手机！")
                const timer = setInterval(() => {
                    if (this.countDown > 0) {
                      this.countDown--
                      this.buttonText = `${this.countDown}`
                    } else {
                      clearInterval(timer)
                      this.disabled = false
                      this.countDown = 120
                      this.buttonText = '发送'
                    }
                  }, 1000)
              }
              else if(res.code == 20001){
                this.$message.error(res.message)
                this.disabled = false
              }
          })
        } else {
          this.$message.error("手机号格式不正确")
        }
        
        
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;

/* reset element-ui css */
.login-container {
    display: flex;
    flex-direction: column;
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
  .title {
    font-size: 22px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 0px auto;
    text-align: center;
    font-weight: bold;
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
  .smsButton {
    display: inline-block;
    width: 15%;
    height: 35px;
    color: white;
    background-color: rgb(49, 174, 40);
    border: 0px;
    border-radius: 10px;
    cursor: pointer;
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
  .go-to-login {
      font-size:12px; 
      color: rgb(77,100,174);
      font-weight: bold;
      &:hover {
        color: blue;
      }
  }
}
</style>