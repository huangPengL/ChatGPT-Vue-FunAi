<template>
  <div class="chatHome">
    
    <!-- 聊天列表 -->
    <div class="chatLeft">
      
      <div class="online-person">
        <!-- <span class="onlin-text">聊天列表</span> -->
        <el-dropdown size="mini"  trigger="click">
          <el-button type="primary" size="mini">
            历史聊天列表<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          
          <el-dropdown-menu slot="dropdown">
            <div
              class="sessionList"
              v-for="sessionInfo in sessionList"
              :key="sessionInfo.session_id"
              @click="clickSession(sessionInfo)"
            >
              <el-dropdown-item>{{sessionInfo.session_name}}</el-dropdown-item>
            </div>

          </el-dropdown-menu>
        </el-dropdown>
        
        <el-tooltip effect="dark" content="新增会话" placement="top-start">
          <el-button class="icon-plus" size="mini" type="success" icon="el-icon-plus" circle @click="addSession"></el-button>
        </el-tooltip>
        
        <el-tooltip effect="dark" content="删除记录" placement="top-start">  
          <el-button class="icon-delete" size="mini" type="danger" icon="el-icon-delete" circle @click="deleteSession"></el-button>
        </el-tooltip>

        <el-tag type="success" size="mini" effect="plain">{{typeName}}</el-tag>
        <el-tag type="success" size="mini" effect="dark">「{{curSessionName}}」</el-tag>
      </div>
      
    </div>



    <div class="body-content">
            <!-- 聊天框 -->
      <div class="chatRight">
        <div v-if="showChatWindow" style="width:100%;">
          <ChatWindow 
            :sessionInfo="chatWindowInfo"
          ></ChatWindow>
        </div>
      </div>

      <div class="pdfShow">
        <div v-if="showChatWindow" style="width:100%;">
          <PdfWindow 
            :sessionInfo="chatWindowInfo"
          ></PdfWindow>
        </div>
      </div>      
    </div>

  


  </div>
</template>

<script>
import PersonCard from "@/components/PersonCard.vue";
import ChatWindow from "./fileChatWindow.vue";
import { getSessionList, deleteSession, dropCollection } from "@/api/getData";
import Cookies from 'js-cookie'
import Header from '@/components/Header.vue';
import PdfWindow from "./pdfWindow.vue"

export default {
  name: "App",
  components: {
    PersonCard,
    ChatWindow,
    Header,
    PdfWindow
  },
  data() {
    return {
      pcCurrent: "",
      sessionList: [],
      showChatWindow: false,
      chatWindowInfo: {},
      showAddSessionModal: false, // 是否显示新建会话弹窗
      addSessionName: '', // 新建会话的名称
      curSessionName: "",
      curSessionId: "",
      userId: Cookies.get('userId'),
      username: Cookies.get("username"),
      type: 1, 
      typeName: "✅PDF聊天✅",
      expertTypes: "",
      languageTypes: "",
      storyTypes: "",
    };
  },
  mounted() {
    if(Cookies.get('token') == null){
      this.$router.push({ path: '/UserLogin'}).catch((err) => {});
      this.$message("请登录! 🥳");
    }
    else{
      this.refreshSessionList(this.userId, null, this.type)
    }
  },
  watch:{
    $route(to, from){
      if(to.path != from.path){
        this.refreshSessionList(this.userId, null, this.type)
      }
    }
  },
  methods: {
    //登录
    login() {
      this.$message("该功能还没有开发哦，敬请期待一下吧~🥳");
    },

    // 处理按钮点击触发事件的逻辑
    addSession() {
      // PDF新增
      this.$router.push({
          name: "ChatWithFile",
        }, () => {});

    },


    // 删除会话
    deleteSession(){
      this.$confirm("是否删除当前会话[" + this.curSessionName + "], 删除后无法还原！", '确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error',
          center: true
      })
      .then(() => {
        let params = {
              userId: this.userId,
              sessionId: this.curSessionId,
              sessionType: this.type
            }

        // PDF阅读，需要删除该PDF在向量库的索引和连接
        dropCollection(params).then(resp => {
            if(resp.code == 20000){
              this.$message.success("删除索引成功!")
            }else{
              this.$message.error("删除索引失败!")
            }
          })

        deleteSession(this.curSessionId).then(resp => {
          if(resp.code == 20000){
            this.$message.success("删除会话 [" + this.curSessionName + "] 成功!")
            var selectedIndex = this.sessionList.length-2 < 0 ? 0 : this.sessionList.length-2;
            this.refreshSessionList(this.userId, selectedIndex, this.type)
          }
          else{
            this.$message.error("删除会话 [" + this.curSessionName + "] 失败!")
          }
        })
      })
      .catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },

    // 用户点击session列表中其中一个时候
    clickSession(info) {
      // 传递type给聊天窗口，用于判断需要调用后端哪个接口
      this.$set(info, 'type', this.type)
      this.curSessionName = info.session_name;
      this.curSessionId = info.session_id;
      this.showChatWindow = true;
      this.chatWindowInfo = info;
      this.sessionInfo = info;
      this.pcCurrent = info.session_id;
    },

    // 刷新会话列表，若没有则创建
    refreshSessionList(userId, selectedIndex, type){
      getSessionList(userId, type)
        .then((res) => {
          this.sessionList = res.data.list;

          for(var i=0;i<this.sessionList.length;i++){
              if (this.sessionList[i].session_name.length > 18) {
                this.sessionList[i].session_name = this.sessionList[i].session_name.slice(0, 18) + "...";
              }
            }
          
          // 若没有选择，则默认选最新的会话
          if(selectedIndex == null){
              selectedIndex = this.sessionList.length-1
          }
          this.clickSession(this.sessionList[selectedIndex]);
      });
    },
  },
};
 </script>

  <style lang="scss" scoped>
  .showExpertDomain{
    margin-top: 4px;
    margin-right: 5px;
    float: right;
  }
  .showExpertLanguage{
    margin-top: 4px;
    margin-right: 5px;
    float: right;
  }
  .storyTypeSelector{
    margin-left: 10px;
  }
  .icon-plus{
    margin-left: 10px;
  }
  .icon-delete{
    margin-right: 10px;
  }
  .add-session-modal {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
  }

  .add-session-modal-content {
    width: 400px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
  }

  .add-session-modal-header {
    font-size: 18px;
    color: #333;
    padding: 10px;
    border-bottom: 1px solid #eee;
  }

  .add-session-modal-body {
    padding: 10px;
  }

  .add-session-input {
    width: 95%;
    height: 30px;
    padding: 5px 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
  }

  .add-session-modal-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    border-top: 1px solid #eee;
  }

  .add-session-confirm-btn,
  .add-session-cancel-btn {
    color: #fff;
    background-color: #409eff;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    font-size: 14px;
    cursor: pointer;
    margin-right: 10px;
  }

  .add-session-confirm-btn:hover,
  .add-session-cancel-btn:hover {
    background-color: #66b1ff;
  }

  .chatHome {
    // margin-top: 20px;
    display: flex;
    flex-direction: column;
    height:calc(100% - 50px);
  }

  .chatLeft {
    display: flex;
    // justify-content: center;
    // align-items: center;
    flex-direction: column;
    width: 100%;
    .title {
      color: #fff;
      padding-left: 5px;
    }
    .online-person {

      align-items:center;
      .onlin-text {
        padding-left: 5px;
        color: rgb(176, 178, 189);
      }
      .person-cards-wrapper {
        padding-left: 5px;
        height: 100%;
        overflow: hidden;
        overflow-y: scroll;
        box-sizing: border-box;
        &::-webkit-scrollbar {
          width: 0; /* Safari,Chrome 隐藏滚动条 */
          height: 0; /* Safari,Chrome 隐藏滚动条 */
          display: none; /* 移动端、pad 上Safari，Chrome，隐藏滚动条 */
        }
      }
    }
  }
.username-text {
  color: #fff;
  font-family: "Helvetica Neue", sans-serif;
  font-weight: bold;
  font-size: 15px;
}

.body-content {
  display: flex;
  flex-direction: row;
}

  .chatRight {
    display: flex;
    flex: 1;
    flex-direction: row;
    width: 50%;
    .top-nav {
      display: flex;
      justify-content: flex-end;
      width: 100%;
      // left: calc(95% - 50px); /*水平居中 */
      color: #fff;
    }
    .showIcon {
      position: absolute;
      top: calc(50% - 150px); /*垂直居中 */
      left: calc(50% - 50px); /*水平居中 */
      .icon-snapchat {
        width: 300px;
        height: 300px;
        font-size: 300px;
        // color: rgb(28, 30, 44);
      }
    }
  }

  .pdfShow {
    display: flex;
    flex: 1;
    flex-direction: row;
    float: right;
    width: 100%;
    // overflow-y: scroll;
    // padding-right: 10px;
    box-sizing: border-box;
    box-shadow: 10px 2px 8px 4px rgba(0, 0, 0, 0.1);
    // background-color: #555;
    color: #ddd;
    // /* 添加过渡动画 */
    // transition: all 0.3s ease-out;
      
      &::-webkit-scrollbar {
        width: 8px;
        /* Safari,Chrome 隐藏滚动条 */
        height: 8px;
        /* Safari,Chrome 隐藏滚动条 */
        // display: none;
        /* 移动端、pad 上Safari，Chrome，隐藏滚动条 */
      }
  }

  .pdfShow > div {
    height: 100%;
  }

  .vue-pdf-embed > div {
    margin-bottom: 8px;
    box-shadow: 0 2px 8px 4px rgba(0, 0, 0, 0.1);
  }

@media(max-width: 768px){

  .body-content {
    display: flex;
    flex-direction: column;
  }

  .chatRight {
    display: flex;
    flex: 1;
    flex-direction: row;
    width: 100%;
    .top-nav {
      display: flex;
      justify-content: flex-end;
      width: 100%;
      // left: calc(95% - 50px); /*水平居中 */
      color: #fff;
    }
    .showIcon {
      position: absolute;
      top: calc(50% - 150px); /*垂直居中 */
      left: calc(50% - 50px); /*水平居中 */
      .icon-snapchat {
        width: 300px;
        height: 300px;
        font-size: 300px;
        // color: rgb(28, 30, 44);
      }
    }
  }
}
</style>