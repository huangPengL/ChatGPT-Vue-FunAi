<template>
  <div class="chat-window">
    <div class="top">
    </div>
    <div class="bottom">
      <div class="chat-content" id="chat-content" ref="chatContent">
        <div class="chat-wrapper" v-for="(item, index) in chatList" :key="index">
          <!-- 对方的信息 -->
          <div class="chat-friend" v-if="item.role == 'assistant'">
            <div class="info-time">
              <img :src="item.headImg" alt="" />
              <span>ChatGPT</span>
              <template v-if="!isMobile">
                <span>{{ item.create_time }}</span>
              </template>
            </div>
            <div class="chat-container">
              <div class="chat-text">
                <template v-if="isSend && index == chatList.length - 1">
                  <span class="flash_cursor"></span>
                </template>
                <template v-else>
                  <!-- {{ item.content }} -->
                  <div class="chat-text-content" :key='forceRefreshKey' v-html="renderMarkdown(item.content)"></div>
                </template>
              </div>
              <div class="chat-text-bar">
                  <el-tooltip content="复制全部内容" placement="top">
                    <span class="copy-button iconfont icon-fuzhi" @click="copyContent(item.content)"></span>
                  </el-tooltip>

                  <el-tooltip content="播放/取消声音" placement="bottom">
                    <span class="iconfont icon-31shengbo" @click="playSound(index, item.content)"></span>
                  </el-tooltip>
              </div>
            </div>
          </div>

          <!-- 我发送的的信息 -->
          <div class="chat-me" v-else>
            <div class="info-time">
              <span>{{username}}</span>
              <template v-if="!isMobile">
                <span>{{ item.create_time }}</span>
              </template>
              <img :src="item.headImg" alt="" />
            </div>
            <div class="chat-text">
              {{ item.content }}
            </div>
          </div>
        </div>
      </div>

      <!-- 消息输入与发送 -->
      <div class="chatInputs">

        <!-- 输入框 -->
        <TextareaAutosize class="inputs" v-model="inputMsg" @keydown.enter.native.prevent="handleEnterKey" placeholder="请在这里输入内容... ( Shift+Enter 换行)"/>
        <div class="input-function-btn">
          <!-- 发送按钮 -->
          <el-tooltip effect="dark" content="发送🚀" placement="top">
            <span class="iconfont icon-fasong" @click="sendText"></span>
          </el-tooltip>

          <!-- 百宝箱按钮 -->
          <el-tooltip effect="dark" content="百宝功能箱✨" placement="top">
            <el-popover
              placement="top-end"
              width="100"
              trigger="click">

              <div style="display: flex; justify-content: space-between; align-items: center;">
                  <el-tooltip :content="'输出模式: ' + stream" placement="top">
                      <el-switch
                        v-model="stream"
                        active-color="#13ce66"
                        inactive-color="#438EDB"
                        active-value="流式输出"
                        inactive-value="普通输出"
                        class="el-switch--vertical"
                        >
                      </el-switch>
                  </el-tooltip>
                <el-tooltip content="下载" placement="top">
                  <span class="iconfont icon-xiazai" @click="downloadSessionMessage"  style="cursor: pointer;"></span>
                </el-tooltip>  
                <el-tooltip content="长按时说话" placement="top">
                  <!-- <span class="iconfont icon-yuyin" @mousedown="startRecording" @mouseup="stopRecording"  style="cursor: pointer;"></span> -->
                  <span class="iconfont icon-yuyin"   style="cursor: pointer;"></span>
                </el-tooltip>
              
              </div>
              <span slot="reference" class="iconfont icon-gongneng" style="cursor: pointer;"></span>
            </el-popover>  
          </el-tooltip>
        </div>
        
      </div>

    </div>
  </div>
</template>

<script>
import { getChatMsg, downloadSession, sendAudio, getAudioToken, chatWithFile, streamChatWithFile} from "@/api/getData";
import HeadPortrait from "@/components/HeadPortrait";
import Emoji from "@/components/Emoji";
import FileCard from "@/components/FileCard.vue";
import VueMarkdown from 'vue-markdown'
import Cookies from 'js-cookie'
import base from '../../../../src/api/index'
import Recorder from "js-audio-recorder";
import "highlight.js/styles/atom-one-light.css"; 
import MarkDownIt from "markdown-it"
import hljs from "highlight.js"
import mk from "markdown-it-katex"
import ClipboardJS from 'clipboard';

export default {
  components: {
    HeadPortrait,
    Emoji,
    FileCard,
    VueMarkdown,
    Recorder
  },
  
  props: {
    sessionInfo: Object,
    default() {
      return {};
    },
  },
  watch: {
    sessionInfo() {
      this.getChatRecordsMsg();
    },
  },
  data() {
    return {
      chatList: [],
      inputMsg: "",
      showEmoji: false,
      srcImgList: [],
      isSend: false,
      isMobile: false,
      username: Cookies.get("username"),
      stream: "流式输出",    // 是否支持流式输出
      forceRefreshKey: 0,         // 手动刷新组件
      recorder: null,
      audioToken: "",
      curIsPlaySound: false,
      curPlaySoundMsgIndex: -1,
      isStartGame: false,
      isGameOver: false
    };
  },
  mounted() {
    this.getChatRecordsMsg();
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile);
    // this.getAudioToken();
    // this.getPermission();
    this.copyCode();
    this.noneLatex();
    
  },
  updated(){
    this.copyCode();
    this.noneLatex();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkIfMobile);
  },
  methods: {
    // 播放声音
    playSound(msgIndex, msg){
      if(!this.isPlaySound){
        speechSynthesis.speak(new SpeechSynthesisUtterance(msg));
        this.curPlaySoundMsgIndex = msgIndex;
        this.isPlaySound = !this.isPlaySound;
      }
      else{
        speechSynthesis.cancel()
        if(this.curPlaySoundMsgIndex != msgIndex){
          speechSynthesis.speak(new SpeechSynthesisUtterance(msg));
          this.curPlaySoundMsgIndex = msgIndex;
        }
        else{
          this.isPlaySound = !this.isPlaySound;
        }
      }
    },

    subscribeStreamAndStartGame(req_data, index){
      // 建立 SSE 连接
      let sseClient = this.$sse
          .create({
            format: "text/event-stream",
            polyfill: true,
            forcePolyfill: true,
            url: `${base.baseUrl}/chat/getSseEmitter`,
            polyfillOptions: {
              // 超时时间，调长点，要不频繁重连
              heartbeatTimeout: 10 * 60 * 1000,
              // 携带认证token
              headers: {
                'token': Cookies.get('token'),
              },
            },
        });

        // 接收后端消息
        let flag = false
        sseClient.on("message", (data) => {
          if(data != null){

            // 接收到第一条消息，则为sse_emitter_id，则开始发送消息
            if(!flag){
              req_data['sse_emitter_id'] = data;


              flag = true
              this.isSend = false;
              return;
            }

            if(data == '[DONE]'){
              sseClient.disconnect();
              this.scrollBottom();
              return;
            }

            data = data.replaceAll("「`」", ' ')
            data = data.replaceAll("「·」", '\n')
            data = data.replaceAll("「~」", '\t')
            this.chatList[index].content = this.chatList[index].content + data;
            this.forceRefreshKey += 1      // 刷新组件
            // this.scrollBottom();
          }
        })
        sseClient.on("error", (err) =>{
            console.error("Failed to parse or lost connection:", err)
            sseClient.disconnect()
        });
        sseClient.connect()
          .catch((err) => console.error("Failed make initial connection:", err));
    },
    getRecorder() {
      this.recorder = new Recorder({
          sampleBits: 16, // 采样位数，支持 8 或 16，默认是16
          sampleRate: 16000, // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
          numChannels: 1, // 声道，支持 1 或 2， 默认是1
          // compiling: false,(0.x版本中生效,1.x增加中)  // 是否边录边转换，默认是false
      });
    },
    getPermission() {
      Recorder.getPermission().then(
        () => {
          console.log("获取麦克风权限成功");
        },
        (error) => {
          console.log(`${error.name} : ${error.message}`);
        }
      );
    },
    getAudioToken() {
      getAudioToken().then(res => {
        if(res.code == 20000) {
          console.log("audio_token:"+res.message)
          this.audioToken = res.message
        }
      })
    },
    startRecording() {
      this.getRecorder();
      this.recorder.start() // 开始录音
    },
    stopRecording() {
      const formData = new FormData()
      const blob = this.recorder.getWAVBlob()// 获取wav格式音频数据.自动调用recorder的stop
      this.recorder.play();
      // 此处获取到blob对象后需要设置fileName满足当前项目上传需求，其它项目可直接传把blob作为file塞入formData
      const newbolb = new Blob([blob], { type: 'audio/wav' })
      const fileOfBlob = new File([newbolb], new Date().getTime() + '.wav')
      formData.append('file', fileOfBlob)
      sendAudio(Cookies.get("userId"),this.audioToken,formData).then(res => {
          if(res.code == 20000) {
            this.inputMsg = JSON.parse(res.message).result[0]
          } else {
            this.$message({
              message: res.message,
              type: "warning",
            });
          }
          
      })
      this.recorder.destroy() // 毁实例
    },
    checkIfMobile() {
      const isMobile = window.innerWidth <= 1024;
      this.isMobile = isMobile;
    },
    //获取聊天记录
    getChatRecordsMsg() {
      this.chatList = []
      let params = {
        sessionId: this.sessionInfo.session_id,
      };
      getChatMsg(params).then((res) => {
        this.chatList = res.data.record;
        this.chatList.unshift({
            role: "assistant",
            content: "你好「" + this.username 
              +"」我是ChatGPT，我可以帮你解答任何我能够回答的问题😀, 让我们在当前会话 【"
              + this.sessionInfo.session_name + "】 畅聊吧！",
          })

        this.chatList.forEach((item) => {
          item['headImg'] = item.role == 'user' ? require("@/assets/img/head_portrait.jpg") : require("@/assets/img/head_robot.jpg")
        });
        this.scrollBottom();
      });
    },
    //发送信息
    sendMsg(msgList) {
      this.chatList.push(msgList);
      this.scrollBottom();
    },
    //获取窗口高度并滚动至最底层
    scrollBottom() {
      this.$nextTick(() => {
        const scrollDom = this.$refs.chatContent;
        scrollDom.scrollTop = scrollDom.scrollHeight;
        // animation(scrollDom, scrollDom.scrollHeight - scrollDom.offsetHeight);
      });
    },

    // 会话记录导出并下载
    downloadSessionMessage(){
      let params = {
        sessionId: this.sessionInfo.session_id,
      };
      this.$confirm('是否导出聊天记录为csv?', '确认', {
          confirmButtonText: '确定导出',
          cancelButtonText: '取消导出',
          type: 'success',
          center: true
        }).then(() => {
          // 使用插件下载
          downloadSession(params).then((res) => {
            let fileDownload = require('js-file-download')
            fileDownload(res, this.sessionInfo.session_name + ".csv", "application/octet-stream")
          });

          this.$message({
            type: 'success',
            message: '导出成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消导出'
          });
        });

      
    },
    //关闭标签框
    clickEmoji() {
      this.showEmoji = !this.showEmoji;
    },
    //发送文字信息
    sendText() {
      if (this.inputMsg) {
        // 推送问题到聊天框
        let chatMsg = {
          role: "user",
          headImg: require("@/assets/img/head_portrait.jpg"),
          name: this.username,
          create_time: new Date().toLocaleTimeString(),
          content: this.inputMsg,
        };
        this.sendMsg(chatMsg);
        this.inputMsg = "";

        // 准备请求数据，推送头像和名字，不推送内容
        let req_data = {
          message: chatMsg.content,
          user_id: Cookies.get("userId"),
          session_id: this.sessionInfo.session_id,
          session_type: this.sessionInfo.type
        }
        let chatGPT = {
          role: "assistant",
          headImg: require("@/assets/img/head_robot.jpg"),
          name: "ChatGPT",
          create_time: "",
          content: "",
        };
        this.isSend = true;
        this.sendMsg(chatGPT);

        // 请求后端，获得回答后修改推送数据 (是否采用流的方式推送)
        if(this.stream == "普通输出"){
          chatWithFile(req_data).then((resp) => {
              if(resp.code != 20000){
                this.$message({
                  message: resp.message,
                  type: "warning",
                });
                this.reSetLastMsg(resp.message)
                return
              }
              this.isSend = false;
              this.chatList[this.chatList.length-1].content = resp.data.message;
              this.chatList[this.chatList.length-1].create_time = new Date().toLocaleTimeString();
              this.scrollBottom();
              
            });
      
        }
        else{
            let index = this.chatList.length-1
            this.chatList[index].create_time = new Date().toLocaleTimeString();
            this.subscribeStreamAndsessionChat(req_data, index)
        }
      } 
      else {
        this.$message({
          message: "消息不能为空哦~",
          type: "warning",
        });
      }
    },

    subscribeStreamAndsessionChat(req_data, index){
        let sseClient = null
        // 建立 SSE 连接
        sseClient = this.$sse
            .create({
              format: "text/event-stream",
              polyfill: true,
              forcePolyfill: true,
              url: `${base.baseUrl}/chatFile/getSseEmitter`,
              polyfillOptions: {
                // 超时时间，调长点，要不频繁重连
                heartbeatTimeout: 10 * 60 * 1000,
                // 携带认证token
                headers: {
                  'token': Cookies.get('token'),
                },
              },
          });

        // 接收后端消息
        let flag = false
        sseClient.on("message", (data) => {
          if(data != null){

            // 接收到第一条消息，为sse_emitter_id，则开始发送消息
            if(!flag){
              req_data['sse_emitter_id'] = data;

              streamChatWithFile(req_data).then(resp => {
                  // 无法响应消息，则断开连接
                  if(resp.code != 20000){
                    this.$message({
                      message: resp.message,
                      type: "warning",
                    });
                    this.reSetLastMsg(resp.message)
                    sseClient.disconnect()
                  }
                })
              flag = true
              this.isSend = false;
              return;
            }

            if(data == '[DONE]'){
              sseClient.disconnect();
              this.scrollBottom();
              return;
            }

            data = data.replaceAll("「`」", ' ')
            data = data.replaceAll("「·」", '\n')
            data = data.replaceAll("「~」", '\t')
            this.chatList[index].content = this.chatList[index].content + data;
            this.forceRefreshKey += 1      // 刷新组件
            // this.scrollBottom();
          }
        })
        
        sseClient.on("error", (err) =>{
            console.error("Failed to parse or lost connection")
            this.$message({
              message: "连接中断！考虑以下解决方案 1.请切换成普通输出模式 2.清空会话 3.联系工作人员 243031504@qq.com",
              type: "error",
            });
            sseClient.disconnect()
        });
        sseClient.connect()
         .then(sse => {
            // 连接超过60秒自动断开
            setTimeout(() => {
              sseClient.disconnect()
            }, 60000);
          })
          .catch((err) => console.error("Failed make initial connection:", err));
    },

    // 修改聊天框最后一条数据
    reSetLastMsg(msg){
      this.isSend = false;
      this.chatList[this.chatList.length-1].content = msg;
      this.chatList[this.chatList.length-1].create_time = new Date().toLocaleTimeString();
      this.forceRefreshKey += 1
    },

    // md格式转化
    renderMarkdown(markdownString) {
      return md.render(markdownString);
    },
    // 复制内容
    copyContent(content){
        const clipboard = new ClipboardJS('.copy-button', {
          text: function() {
            return content;
          }
        });
        
        clipboard.on('success', () => {
          this.$message.success("复制成功!");
          clipboard.destroy(); //销毁clipboard对象
        });
        clipboard.on('error', () => {
          this.$message.error("复制失败!");
        });
        
    },
    // 复制代码
    copyCode(){
        // 获取所有的复制按钮
      const copyBtns = document.querySelectorAll('.code-copy');
      // 遍历复制按钮，为每个按钮添加点击事件
      for (const btn of copyBtns) {
        if (!btn.hasAttribute('data-clipboard')) {
          btn.setAttribute('data-clipboard', true);
          const clipboard = new ClipboardJS(btn, {
            text: function(trigger) {
              // 复制代码块到剪切板
              const preNode = trigger.closest('pre');
              const codeNode = preNode.querySelector('code');
              const codeText = codeNode.innerText;
              return codeText;
            }
          });
          clipboard.on('success', () => {
            this.$message.success("复制成功!");
          });
          clipboard.on('error', () => {
            this.$message.error("复制失败!");
          });
        }
      }
    },

    noneLatex(){
        // 获取所有的复制按钮
      const kt = document.querySelectorAll('.katex-html');
      kt.forEach(element => {
        element.style.display = 'none';
      });
    },

    handleEnterKey(event) {
      if (event.keyCode === 13 && !event.shiftKey) {
        event.preventDefault(); // 阻止默认行为
        this.sendText(); // 发送消息的方法
      }else if(event.keyCode === 13 && event.shiftKey){
        event.preventDefault(); // 阻止默认行为
        this.inputMsg += "\n"; // 在文本框中添加换行符
      }
    }
  }
};
  const md = new MarkDownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, language) {
      const validLang = !!(language && hljs.getLanguage(language))
      // 得到经过highlight.js之后的html代码
      if(validLang){
        const lang = language ?? ''
        return highlightBlock(hljs.highlight(str, { language: lang }).value, lang)
      }
      return highlightBlock(hljs.highlightAuto(str).value, '');
    },
});
  
  md.use(mk, { blockClass: 'katexmath-block', errorColor: ' #cc0000' });
  function highlightBlock(str, lang) {
    return `<pre class="pre-code">
              <div class="code-block-header">
                <span class="code-copy" data-clipboard-text="' + str + '">复制代码</span>
              </div>
              <code class="hljs code-block-body ${lang}">${str}</code>
            </pre>`
}
</script>

<style>

.chat-text-content{
  position: relative;
}

.chat-text-content > p {
  white-space: pre-wrap;
  color: white;
  font-size: 14px;
  line-height: 1.5;
}

.pre-code{
  display: flex;
}

pre code.hljs {
    display: block;
    overflow-x: auto;
    padding: 1em;
}

.code-block-header {
    position: absolute;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: #383a42;
    background: #e3dcdc;
    border-radius: 5px 5px 0px 0px;
    flex: 1;
    font-weight: bold;
    padding: 0px;
    right: 0px;
}
.code-copy{
  padding: 5px;
  cursor: pointer;
  user-select: none;
  font-size: 10px;
  font-weight: bold;
  border: 2px solid #5270bc;
  background: rgba(227, 220, 220, 0.3);
  color: #5270bc;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.code-copy:hover {
  background-color: #5270bc;
  color: #fff;
}

.hljs {
    border-radius: 5px 5px 5px 5px;
    color: #383a42;
    background: #e3dcdc;
    line-height: 1.3;
    flex: 1;
}
</style>

<style lang="scss" scoped>
.flash_cursor {
  width: 20px;
  height: 30px;
  display: inline-block;
  background: #d6e3f5;
  opacity: 1;
  animation: glow 800ms ease-out infinite alternate;
}

@keyframes glow {
  0% {
    opacity: 1;
  }

  25% {
    opacity: .5;
  }

  50% {
    opacity: 0;
  }

  75% {
    opacity: .5;
  }

  100% {
    opacity: 1;
  }
}

.input-function-btn{
  margin-left: 4px;
  display: flex;
  justify-content: left;
  align-items: left;
  margin-bottom: 15px;
  span {
    margin-left: 4px;
    cursor: pointer;
  }
  input {
    display: none;
  }
}

.chat-window {
  width: 100%;
  height: 100%;
  position: relative;

  .top {
    margin-bottom: 20px;

    &::after {
      content: "";
      display: block;
      clear: both;
    }

    .head-pic {
      float: left;
    }

    .info-detail {
      float: left;
      margin: 5px 20px 0;

      .name {
        font-size: 20px;
        font-weight: 600;
        color: #fff;
      }

      .detail {
        color: #9e9e9e;
        font-size: 12px;
        margin-top: 2px;
      }
    }
  }
  // 聊天窗口控制
  .bottom {
    width: 100%;
    height: 85vh;
    background-color: rgb(50, 54, 68);
    border-radius: 20px;
    padding: 20px;
    box-sizing: border-box;
    position: relative;
    // margin-top: -10px;

    .chat-content {
      width: 100%;
      height: 85%;
      overflow-y: scroll;
      padding-right: 10px;
      box-sizing: border-box;
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
      &::-webkit-scrollbar-thumb {
        background-color: #ccc;
        border-radius: 5px;
      }

      &::-webkit-scrollbar-track {
        background-color: #f2f2f2;
        border-radius: 5px;
      }

      .chat-wrapper {
        position: relative;
        word-break: break-all;

        .chat-friend {
          width: 100%;
          float: left;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;

          .chat-container {
            display: flex;
            flex-direction: row;
            align-items: center;
          }

          .chat-text {
            max-width: 88%;
            padding: 20px;
            border-radius: 20px 20px 20px 5px;
            background-color: rgb(56, 60, 75);
            color: #fff;
            font-size: 14px;
            &:hover {
              background-color: rgb(39, 42, 55);
            }
          }

          .chat-text-bar {
            
            margin-left: 10px;
            span {
              display: block;
              cursor: pointer;
            }
          }

          .chat-img {
            img {
              width: 100px;
              height: 100px;
            }
          }

          .info-time {
            margin: 10px 0;
            color: #fff;
            font-size: 12px;

            img {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              vertical-align: middle;
              margin-right: 10px;
            }

            span:last-child {
              color: rgb(101, 104, 115);
              margin-left: 10px;
              vertical-align: middle;
            }
          }
        }

        .chat-me {
          width: 100%;
          float: right;
          margin-bottom: 20px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-end;

          .chat-text {
            float: right;
            max-width: 88%;
            padding: 20px;
            border-radius: 20px 20px 5px 20px;
            background-color: rgb(29, 144, 245);
            color: #fff;
            font-size: 14px;

            &:hover {
              background-color: rgb(26, 129, 219);
            }
          }

          .chat-img {
            img {
              max-width: 300px;
              max-height: 200px;
              border-radius: 10px;
            }
          }

          .info-time {
            margin: 10px 0;
            color: rgb(101, 104, 115);
            font-size: 12px;
            display: flex;
            justify-content: flex-end;

            img {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              vertical-align: middle;
              margin-left: 10px;
            }

            span {
              line-height: 30px;
            }

            span:first-child{
              color: #fff;
              margin-right: 10px;
              vertical-align: middle;
            }
          }
        }
      }
    }

    .chatInputs {
      width: 98%;
      position: absolute;
      bottom: 10px;
      display: flex;
      justify-content: center; 
      align-items: flex-end;

      .inputs {
        width: 80%;
        height: 50px;
        background-color: rgb(66, 70, 86);
        border-radius: 10px;
        border: 2px solid rgb(34, 135, 225);
        padding: 10px;
        box-sizing: border-box;
        transition: 0.2s;
        font-size: 15px;
        color: #fff;
        font-weight: 100;

        &:focus {
          outline: none;
        }
      }

      .send {
        background-color: rgb(29, 144, 245);
        border: 0;
        transition: 0.3s;
        box-shadow: 0px 0px 5px 0px rgba(0, 136, 255);

        &:hover {
          box-shadow: 0px 0px 10px 0px rgba(0, 136, 255);
        }
      }
    }
  }
  .el-switch--vertical {
    display: flex;
    flex-direction: row-reverse;
    transform: rotate(-90deg);
    transform-origin: center;
    margin-left: -20px;
  }

  .gameOper {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .gameOper .el-button-success {
    margin-bottom: 20px;
  }

}
</style>
