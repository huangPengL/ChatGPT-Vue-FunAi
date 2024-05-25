<template>
  <div class="person-card" :class="{ activeCard: sessionInfo.session_id == current }">
    <div class="info">
      <template v-if="!isMobile">
        <HeadPortrait></HeadPortrait>
      </template>
      <div class="info-detail">
        <div class="name" v-tooltip="sessionInfo.session_name" >{{ shortSessionName }}</div>
        <!-- <div class="detail">{{ sessionInfo.detail }}</div> -->
      </div>
    </div>
  </div>
</template>
<script>
import HeadPortrait from "./HeadPortrait.vue";
import Vue from 'vue'
import VTooltip from 'v-tooltip'

Vue.use(VTooltip)
export default {
  props: {
    sessionInfo: {
      default: {
      },
    },
    pcCurrent: {
      default: ''
    }
  },
  components: {
    HeadPortrait,
  },
  data() {
    return {
      current: '',
      isMobile: false
    }
  },
  watch: {
    pcCurrent: function() {
      this.isActive()
    }
  },
  methods: {
    isActive() {
      this.current = this.pcCurrent
    },
    checkIfMobile() {
      const isMobile = window.innerWidth <= 1024;
      this.isMobile = isMobile;
    }
  },
  computed: {
    shortSessionName() {
      const name = this.sessionInfo.session_name;
      const length = name.replace(/[^\u4e00-\u9fa5]/g, "").length; // 计算汉字长度
      if (length <= 5) {
        return name;
      } else {
        let shortName = "";
        let count = 0;
        for (let i = 0; i < name.length; i++) {
          const char = name.charAt(i);
          if (/[^\u4e00-\u9fa5]/.test(char)) {
            shortName += char;
          } else {
            if (count < 5) {
              shortName += char;
              count++;
            } else {
              break;
            }
          }
        }
        return shortName + "...";
      }
    }
  },
  mounted() {
    this.checkIfMobile();
    window.addEventListener('resize', this.checkIfMobile);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkIfMobile);
  }
};
</script>

<style lang="scss" scoped>

.person-card {
  width: 90%;
  height: 80px;
  border-radius: 10px;
  background-color: rgb(50, 54, 68);
  position: relative;
  margin: 22px 0;
  cursor: pointer;
  .info {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 90%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    display: flex;
    .info-detail {
      margin-top: 5px;
      margin-left: 5px;
      display: flex; /* 修改此处 */
      align-items: center; /* 垂直居中 */
      justify-content: center; /* 水平居中 */
      
      .name {
        color: #fff;
        overflow: hidden;
        // white-space: nowrap;
        // text-overflow: ellipsis;
        margin-bottom: 5px;
        // word-wrap: break-word; /* 或者 overflow-wrap: break-word; */
      }
      .detail {
        color: #5c6675;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 11px;
      }
    }
  }
  &:hover {
    background-color: #1d90f5;
    transition: 0.3s;
    box-shadow: 0px 0px 10px 0px rgba(0, 136, 255);
    // box-shadow:  0 5px 20px rgba(251, 152, 11, .5);
    .info {
      .info-detail {
        .detail {
          color: #fff;
        }
      }
    }
  }
}
.activeCard {
    background-color: #1d90f5;
    transition: 0.3s;
    box-shadow: 3px 2px 10px 0px rgba(0, 136, 255);
    .info {
      .info-detail {
        .detail {
          color: #fff;
        }
      }
    }
}
</style>