<template>
  <div class="header">
    <div class="right">
      <el-dropdown>
        <span class="el-dropdown-link">
          <i class="el-icon-user-solid"></i>
           {{username}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <div @click="apiKeyManage">
            <el-dropdown-item >API-Key管理</el-dropdown-item>
          </div>

          <div v-if="userLevel == 0" @click="accountManage()" >
            <el-dropdown-item>账号管理</el-dropdown-item>
          </div>

          <div @click="showAdviceBox">
            <el-dropdown-item class="addAdviceBTN" >意见箱</el-dropdown-item>
          </div>
          
          <div @click="login()">
            <el-dropdown-item divided>其他账号</el-dropdown-item>
          </div>

          <div @click="logout()">
            <el-dropdown-item class="logout-btn">退出账号</el-dropdown-item>
          </div>
          
        </el-dropdown-menu>
      </el-dropdown>
     
      <span></span>
      <!-- <el-button type="danger" @click="logout" size="mini" style="margin-left: 20px;">退出</el-button>  -->
    </div>

    <el-dialog title="API-Key管理" :visible.sync="dialogFormVisible" :modal=false>
      <el-form :model="apikeyForm" label-position="top">
        
        <el-form-item label="类型:" :label-width="formLabelWidth">
          <el-select v-model="apikeyForm.api_type_no" placeholder="请选择apikey类型" @change="apiKeyFormChanged">
            <!-- 0: openai, 1: microsoft, 2: baidu, 3: 梦网 -->
            <el-option label="openai" value="0">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="您的API-Key: " :label-width="formLabelWidth">
          <el-input v-model="apikeyForm.api_key" autocomplete="off"  placeholder="不填则默认使用系统的apikey，会有使用限制噢😄"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateApiKey">确 定 修 改</el-button>
      </div>
    </el-dialog>
    <el-dialog title="意见箱" :visible.sync="adviceBoxFormVisible" :modal=false>
      <el-form label-position="top">
        <el-form-item label="意见:" :label-width="formLabelWidth">
          <el-input
          type="textarea"
          :rows="8"
          placeholder="请输入您宝贵的意见"
          v-model="userAdviceContent">
        </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adviceBoxFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addAdviceFromBox">确 定 提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
import { logout, getUserApiKey, insertOrUpdateApiKey, addAdvice ,getUserLevel} from "@/api/getData"; 
import { EventBus } from '@/main'

export default {
  data() {
    return { 
      username: "",
      inputApiKey: "",
      dialogFormVisible: false,
      apikeyForm: {
        user_id: Cookies.get("userId"),
        api_type_no: '0',
        api_key: '',
      },
      formLabelWidth: '120px',
      adviceBoxFormVisible: false,
      userLevel: '',
      userAdviceContent: "",
    }
  },
  methods: {
    getUserInitLevel(){
      getUserLevel().then(resp => {
        if(resp.code == 20000) {
          this.userLevel = resp.data.level;
        }else {
          this.$error.push("用户等级初始化异常");
        }
      })
    },

    // 展示意见箱
    showAdviceBox(){
      this.adviceBoxFormVisible = true
    },

    // 新增意见
    addAdviceFromBox(){
      this.adviceBoxFormVisible = false
      const advice = {
        user_id: Cookies.get("userId"),
        username: Cookies.get("username"),
        user_advice: this.userAdviceContent
      }
      addAdvice(advice).then(resp => {
        if(resp.code == 20000){
          this.$message.success("提交成功，请耐心等待管理员处理! ");
          this.userAdviceContent = ""
        }else{
          this.$message.error(resp.message);
        }
      })
    },

    login(){
      Cookies.remove('token');
      Cookies.remove('userId');
      Cookies.remove('username');
      this.$router.push({name: "UserLogin"}, () => {});
    },

    logout() {
      logout(Cookies.get("userId")).then(res => {
          if(res.code == 20000) {
            this.$message.success("退出成功！");
            // 删除cookie信息
            Cookies.remove("token");
            Cookies.remove("username");
            Cookies.remove("userId");
            this.$router.push({name: "UserLogin"}, () => {});
          }else {
            this.$message.error(res.message);
          }
      })
    },
    // 查询apikey
    apiKeyFormChanged(){
      getUserApiKey(this.apikeyForm).then(resp => {
        if(resp.code == 20000){
          this.apikeyForm.api_key = resp.data.api_key
        }
      })
    },
    
    apiKeyManage(){
      this.apikeyForm.api_key = ""
      this.apiKeyFormChanged()
      this.dialogFormVisible = true
    },

    // 新增/修改apikey
    updateApiKey(){
      this.dialogFormVisible = false
      insertOrUpdateApiKey(this.apikeyForm).then(resp => {
        if(resp.code == 20000){
          this.$message.success("修改成功！");
        }else{
          this.$message.error(resp.message);
        }
      })
    },
    accountManage(){
      this.$router.push(
        {
          name: "UserList",
        },
        () => {}
      );
    },
  },
  mounted() {
    
  },
  created() {
    EventBus.$on('login-success', message => {
      this.username = Cookies.get("username");
      this.getUserInitLevel()
    })
    this.getUserInitLevel()
    this.username = Cookies.get("username");
  }
}
</script>

<style>

.logout-btn {
  background-color: #F56C6C;
  border-radius: 3px;
  color: white !important;
}
.logout-btn:hover {
  background-color: #f34b4b !important;
  color: white !important;
}


.el-dropdown-link {
  /* 渐变色作为文字颜色 */
  background: #fff;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);

  animation: blinking 3s infinite;

  /* 其他样式 */
  font-family: Arial, sans-serif;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
}
.el-icon-arrow-down {
  font-size: 12px;
}

.header {
  z-index: 99;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* background-color: #599631; */
}

.left {
  width: 50%;
  color: aliceblue;
  display: flex;
}
.right {
  width: 100%;
  color: aliceblue;
  display: flex;
  align-items: center;
  justify-content: flex-end; /* 水平方向上靠右对齐 */
}

@keyframes blinking {
  0% {
    opacity: 1.0;
  }
  50% {
    opacity: 0.6;
  }
  100% {
    opacity: 1.0;
  }
}

</style>