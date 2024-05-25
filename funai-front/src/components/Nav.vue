<template>
  <div class="nav">
    <!-- <div class="left">
      <span @click="expand()" class="iconfont icon-zhankaishousuo" style="cursor: pointer;"></span> 
    </div> -->
    <div class="left" @click="expand()" id="left">
      <i :class="isShow ? 'el-icon-arrow-left' : 'el-icon-arrow-right'" class="left_icon"></i>
    </div>
    <div v-show="isShow">
      <div class="nav-menu-wrapper">
        <ul class="menu-list">
          <li
            v-for="(item, index) in menuList"
            :key="index"
            :class="{ activeNav: index == current }"
            @click="changeMenu(index)"
          >
            <div>
              <div class="block"></div>
              <el-tooltip effect="light" :content="item.info" placement="top">
                <span class="iconfont" :class="item.icon"></span>
              </el-tooltip>
            </div>
          </li>
        </ul>
      </div>
      <div class="own-pic">
        <el-tooltip
          effect="dark"
          content="点击该按钮，联系我们！"
          placement="top"
        >
          <el-popover placement="top-end" width="300" trigger="click">
            <div class="pop-container">
              <div class="image-container">
                <el-image
                  :src="wechatImgSrc"
                  style="width: 150px; height: 150px"
                ></el-image>
                <p>最新微信群</p>
              </div>
              <el-divider><i class="el-icon-magic-stick"></i></el-divider>
              <div class="image-container">
                <el-image
                  :src="cooperateImgSrc"
                  style="width: 150px; height: 150px"
                ></el-image>
                <p>合作微信</p>
              </div>
              <el-divider><i class="el-icon-magic-stick"></i></el-divider>
              <div class="image-container">
                <el-image
                  :src="meImgSrc"
                  style="width: 150px; height: 150px"
                ></el-image>
                <p>管理员微信</p>
              </div>
            </div>

            <span
              slot="reference"
              class="iconfont icon-guanyuwomen"
              style="cursor: pointer"
            ></span>
          </el-popover>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import { getToken } from "@/util/auth";
import HeadPortrait from "./HeadPortrait.vue";
import {getUserLevel} from "@/api/getData";
import { EventBus } from '@/main'

export default {
  components: {
    HeadPortrait,
  },
  data() {
    return {
      isShow:true,
      userLevel: '',
      menuList: [
        { icon: "icon-huihua", info: "无限聊天" },
        { icon: "icon-pdf", info: "PDF阅读" },
        { icon: "icon-ai-img", info: "智能画图" },
        { icon: "icon-youxiyouxiji", info: "冒险游戏" },
        { icon: "icon-fanyi", info: "智能语言学家" },
        { icon: "icon-zhuanjia", info: "专家系统" },
        { icon: "icon-ziliaoku", info: "提示库" },
        { icon: "icon-yulanjianli", info: "模拟面试" },
        // { icon: "icon-kouyuzhuanxiangke", info: "口语练习" },
      ],
      current: 0,
      imgUrl: require("@/assets/img/head_portrait.jpg"),
      wechatImgSrc: "https://funai-hpl.oss-cn-guangzhou.aliyuncs.com/homePage/contact-1.png",
      cooperateImgSrc: "https://funai-hpl.oss-cn-guangzhou.aliyuncs.com/homePage/cooperate-1.png",
      meImgSrc: "https://funai-hpl.oss-cn-guangzhou.aliyuncs.com/homePage/contact-3.png",
    };
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
    // 左侧导航栏
    changeMenu(index) {
      this.current = index;
      switch (index) {
        case 0:
          if (getToken() != null) {
            this.$router.push(
              {
                name: "ChatHome",
                params: { type: "NormalChat" },
              },
              () => {}
            );
          } else {
            this.$message("目前还没登陆哦，请登陆之后再进行尝试~🥳");
          }
          break;
        case 1:
          if (getToken() != null) {
            this.$router.push(
              {
                name: "ChatWithFile",
              },
              () => {}
            );
          } else {
            this.$message("目前还没登陆哦，请登陆之后再进行尝试~🥳");
          }
          break;
        case 2:
          if (getToken() != null) {
            this.$router.push(
              {
                name: "ImgGenerate",
              },
              () => {}
            );
          } else {
            this.$message("目前还没登陆哦，请登陆之后再进行尝试~🥳");
          }
          break;
        case 3:
          if (getToken() != null) {
            this.$router.push(
              {
                name: "GameChat",
              },
              () => {}
            );
          } else {
            this.$message("目前还没登陆哦，请登陆之后再进行尝试~🥳");
          }
          break;

        case 4:
          if (getToken() != null) {
            this.$router.push(
              {
                name: "Translation",
              },
              () => {}
            );
          } else {
            this.$message("目前还没登陆哦，请登陆之后再进行尝试~🥳");
          }
          break;
        case 5:
          if (getToken() != null) {
            this.$router.push(
              {
                name: "ExpertChat",
              },
              () => {}
            );
          } else {
            this.$message("目前还没登陆哦，请登陆之后再进行尝试~🥳");
          }
          break;
        case 6:
          if (getToken() != null) {
            if (this.userLevel == 0) {
              this.$router.push(
                {
                  name: "Prompt",
                },
                () => {}
              );
            } else {
              this.$message("暂不支持非管理员访问提示库！😥");
              this.changeMenu(0);
            }
          } else {
            this.$message("目前还没登陆哦，请登陆之后再进行尝试~🥳");
          }
          break;
        case 7:
          this.$message("该功能还没有开发哦，敬请期待一下吧~🥳");
          break;
        // case 8:
        //   this.$message("该功能还没有开发哦，敬请期待一下吧~🥳");
        //   break;
        default:
          this.$router.push({
            name: "ChatGGG",
          });
      }
    },
    expand() {
      this.isShow = !this.isShow
      let navElem = document.getElementById("navElem");
      if(this.isShow){
        navElem.style.width = "55px";
      }else{
        navElem.style.width = "0px";
      }
    },
  },

  mounted() {
    this.getUserInitLevel()
  },
  created() {
    EventBus.$on('login-success', message => {
      this.getUserInitLevel()
    })
  }
};
</script>

<style lang="scss" scoped>
.nav {
  width: 100%;
  height: 90vh;
  position: relative;
  border-radius: 20px 0 0 20px;
  .left {
    position: absolute;
    top: 50%;
    right: -19px;
    z-index: 999;
    width: 15px;
    height: 57px;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background-color: rgb(29, 144, 245);
      color: #fff;
      border-color: rgb(29, 144, 245);
    }
  }
  .left_icon {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgb(42, 48, 77);
    color: #fff;
    &:hover {
      color: #fff;
      background-color: rgb(29, 144, 245);
    };

    border-radius: 10px;
  }
  .nav-menu-wrapper {
    position: absolute;
    top: 40%;
    transform: translate(0, -50%);
    .menu-list {
      margin-left: 0px;

      li {
        margin: 40px 0 0 10px;
        list-style: none;
        cursor: pointer;
        position: relative;
        .block {
          background-color: rgb(29, 144, 245);
          position: absolute;
          left: -13px;
          width: 6px;
          height: 25px;
          transition: 0.5s;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
          opacity: 0;
        }
        &:hover {
          span {
            color: rgb(29, 144, 245);
          }
          .block {
            opacity: 1;
          }
        }
      }
    }
  }
  .own-pic {
    position: absolute;
    bottom: 0%;
    margin: 40px 0 0 10px;
    .iconfont {
      font-size: 32px !important;
    }
  }
}

.image-container {
  display: flex;
  align-items: center;
  margin-right: 20px;
  p {
    background-color: #b9cff4;
    font-family: "Helvetica Neue", sans-serif;
    font-weight: bold;
    letter-spacing: 1px;
    text-transform: uppercase;
    box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.2);
  }
}

.activeNav {
  span {
    color: rgb(29, 144, 245);
  }
  .block {
    opacity: 1 !important;
  }
}

.info-wrapper {
  position: absolute;
  z-index: 999;
  background-color: #333;
  color: #fff;
  padding: 5px;
  border-radius: 5px;
}

.info-wrapper .info {
  font-size: 12px;
}

.block {
  width: 20px;
  height: 100%;
  display: inline-block;
  margin-right: 20px;
}

.iconfont {
  font-size: 24px;
  vertical-align: middle;
  cursor: pointer;
}
</style>