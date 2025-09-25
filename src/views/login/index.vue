<template>
  <div class="login">
    <div class="login-weaper">
      <div class="login-left">
        <div class="login-time">{{ time.txt }}</div>
        <div class="login-left-box">
          <div>
            <div class="logo">{{ themeConfig.globalViceTitle }}</div>
            <h2 class="title">{{ themeConfig.globalViceDes }}</h2>
            <div class="msg">
              <div class="msg-author">
                <span>{{ quotations.name }}</span>
                <span>{{ quotations.comeFrom }}</span>
              </div>
              <div class="msg-txt">{{ quotations.content }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="login-right">
        <h4 class="login-title">{{ themeConfig.globalTitle }}</h4>
        <el-tabs class="mode-change" v-model="activeMode">
          <el-tab-pane label="登录" name="login">
            <loginForm v-if="activeMode === 'login'" />
            <p class="toRegister" @click="activeMode = 'register'">暂无账号？去注册></p>
          </el-tab-pane>
          <el-tab-pane label="注册" name="register">
            <registerForm v-if="activeMode === 'register'" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="vue-particles">
      <vue-particles
          color="#dedede"
          shapeType="star"
          linesColor="#dedede"
          hoverMode="grab"
          clickMode="push"
          style="height: 100%"
      ></vue-particles>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import {formatAxis, formatDate} from '@/utils/formatTime';
import {quotationsList} from './mock';

import loginForm from '@/components/loginForm/index.vue';
import registerForm from '@/components/registerForm/index.vue';

export default {
  name: 'login',
  components: {loginForm, registerForm},
  computed: {
    // 获取布局配置信息
    ...mapState('themeConfig', ['themeConfig']),
    // 获取当前时间
    currentTime() {
      return formatAxis(new Date());
    },
  },
  data() {
    return {
      activeMode: 'login',
      quotationsList,
      quotations: {},
      isView: false,
      ruleForm: {
        username: '',
        password: '',
        captcha: '',
        randomStr: Math.floor(Math.random() * 999999999),
      },
      time: {
        txt: '',
        fun: null,
      },
    };
  },
  created() {
    this.initTime();
  },
  mounted() {
    this.initRandomQuotations();
  },
  methods: {
    // 随机语录
    initRandomQuotations() {
      this.quotations = this.quotationsList[Math.floor(Math.random() * this.quotationsList.length)];
    },
    // 初始化左上角时间显示
    initTime() {
      this.time.txt = formatDate(new Date(), 'YYYY-mm-dd HH:MM:SS WWW QQQQ');
      this.time.fun = setInterval(() => {
        this.time.txt = formatDate(new Date(), 'YYYY-mm-dd HH:MM:SS WWW QQQQ');
      }, 1000);
    },
  },
  destroyed() {
    clearInterval(this.time.fun);
  },
};
</script>

<style scoped lang="scss">
.login {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  position: relative;

  .vue-particles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(ellipse at top left, rgba(105, 155, 200, 1) 0%, rgba(181, 197, 216, 1) 57%);
  }

  .login-weaper {
    margin: auto;
    height: 500px;
    display: flex;
    box-sizing: border-box;
    position: relative;
    z-index: 1;
    border: none;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .login-left {
      width: 491px;
      padding: 20px;
      font-size: 16px;
      color: var(--prev-color-text-white);
      position: relative;
      background-color: var(--prev-color-primary);
      display: flex;
      flex-direction: column;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;

      .login-time {
        width: 100%;
        color: var(--prev-color-text-white);
        opacity: 0.9;
        font-size: 14px;
        overflow: hidden;
      }

      .login-left-box {
        flex: 1;
        overflow: hidden;
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        padding: 80px 45px;

        .logo {
          font-size: 22px;
          margin-bottom: 15px;
        }

        .title {
          color: var(--prev-color-text-white);
          font-weight: 300;
          letter-spacing: 2px;
          font-size: 16px;
        }

        .msg {
          color: var(--prev-color-text-white);
          font-size: 13px;
          margin-top: 35px;

          .msg-author {
            opacity: 0.6;

            span:last-of-type {
              margin-left: 15px;
            }
          }

          .msg-txt {
            margin-top: 15px;
            line-height: 22px;
          }
        }
      }
    }

    .login-right {
      width: 491px;
      padding: 20px;
      position: relative;
      display: flex;
      flex-flow: column nowrap;
      align-items: center;
      background-color: var(--prev-bg-white);
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;

      .login-title {
        color: var(--prev-color-text-primary);
        margin: 40px auto 20px;
        font-weight: 500;
        font-size: 22px;
        text-align: center;
        letter-spacing: 4px;
      }

      ::v-deep .mode-change {
        font-size: 20px !important;
        display: flex;
        flex-flow: column nowrap;
        align-items: center;

        .el-tabs__header {
          display: inline-block;
          margin-bottom: 20px;

          .el-tabs__nav-wrap::after {
            background-color: #fff;
          }

          .el-tabs__item {
            font-size: 20px;
          }
        }

        .toRegister {
          color: var(--prev-color-text-secondary);
          font-size: 12px;
          margin: 0 8px;
          text-decoration: none;
          text-align: right;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
