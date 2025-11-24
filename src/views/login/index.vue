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
          <el-tab-pane label="账号登录" name="login">
            <loginForm v-if="activeMode === 'login'" />
            <div class="register-row">
              <p class="toRegister left" @click="registerDialog.isShowDialog = true">还没有账号？立即注册</p>
              <p class="toRegister right" @click="resetPasswordDialog.isShowDialog = true">找回密码</p>
            </div>
          </el-tab-pane>
          <el-tab-pane label="手机号登录" name="phone">
            <mobileForm v-if="activeMode === 'phone'" />
          </el-tab-pane>
          <el-tab-pane label="邮箱登录" name="email">
            <emailForm v-if="activeMode === 'email'" />
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
    <el-dialog title="注册账号" :visible.sync="registerDialog.isShowDialog" width="500px">
      <div>
        <el-form ref="userDialogFormRef" :model="registerRuleForm" size="default" label-width="90px">
          <el-row :gutter="35">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="用户名">
                <el-input v-model="registerRuleForm.username" placeholder="请输入用户名" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="姓名">
                <el-input v-model="registerRuleForm.name" placeholder="请输入姓名" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="密码">
                <el-input v-model="registerRuleForm.password" placeholder="请输入密码" type="password"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="确认密码">
                <el-input v-model="confirmPassword" placeholder="请输入确认密码" type="password"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="手机号">
                <el-input v-model="registerRuleForm.mobile" placeholder="请输入手机号" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="邮箱">
                <el-input v-model="registerRuleForm.email" placeholder="请输入邮箱" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template>
				<span class="dialog-footer">
					<el-button @click="registerDialog.isShowDialog = false" size="default">取 消</el-button>
					<el-button type="primary" @click="onRegisterSubmit" :loading="registerDialog.loading"
                     size="default">立即注册</el-button>
				</span>
        </template>
      </div>
    </el-dialog>
    <el-dialog title="找回密码" :visible.sync="resetPasswordDialog.isShowDialog" width="500px">
      <div>
        <el-form ref="userDialogFormRef" :model="resetPasswordForm" size="default" label-width="90px">
          <el-row :gutter="35">
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="找回方式">
                <el-radio v-model="resetPasswordForm.type" :label="1">手机号</el-radio>
                <el-radio v-model="resetPasswordForm.type" :label="2">邮箱</el-radio>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20" v-if="resetPasswordForm.type === 1">
              <el-form-item label="手机号">
                <el-input v-model="resetPasswordForm.mobile" placeholder="请输入手机号" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20" v-if="resetPasswordForm.type === 2">
              <el-form-item label="邮箱">
                <el-input v-model="resetPasswordForm.email" placeholder="请输入邮箱" clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="验证码">
                <el-input v-model="resetPasswordForm.code" placeholder="请输入验证码" clearable style="width: 200px"></el-input>
                &nbsp;
                <el-button @click="debouncedGetCaptcha(resetPasswordForm.type === 1 ? 'mobile' : 'email')" :disabled="checkCode.countdown > 0 || checkCode.isGettingCaptcha">
                  {{ checkCode.countdown > 0 ? `$checkCode.{countdown}秒后重新获取` : '获取验证码' }}
                </el-button>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="新密码">
                <el-input v-model="resetPasswordForm.password" placeholder="请输入密码" type="password"
                          clearable></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
              <el-form-item label="确认密码">
                <el-input v-model="confirmPassword" placeholder="请输入确认密码" type="password"
                          clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template>
				<span class="dialog-footer">
					<el-button @click="resetPasswordDialog.isShowDialog = false" size="default">取 消</el-button>
					<el-button type="primary" @click="retrievePassword" :loading="resetPasswordDialog.loading"
                     size="default">重置密码</el-button>
				</span>
        </template>
      </div>
    </el-dialog>

    <el-dialog title="请输入图形验证码" class="dialogCaptcha" :visible.sync="checkCode.dialogCaptcha" width="300px"
               :modal-append-to-body="false">
      <img :src="checkCode.imgCaptchaSrc" class="captcha-img" alt="点击更换" title="点击更换"
           @click="debouncedGetCaptcha('img')"/>
      <span class="change" @click="debouncedGetCaptcha('img')">换一批</span>
      <el-input
          type="text"
          maxlength="6"
          placeholder="请输入图形验证码"
          prefix-icon="el-icon-position"
          v-model="checkCode.imgCaptcha"
          clearable
      />

      <div slot="footer">
        <el-button
            @click="
						checkCode.dialogCaptcha = false;
						checkCode.imgCaptcha = '';
					">
          取 消
        </el-button>
        <el-button type="primary" @click="debouncedGetCaptcha" @keyup.enter.native="debouncedGetCaptcha"
                   ref="dialogConfirmBtn">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {mapState} from 'vuex';
import {formatAxis, formatDate} from '@/utils/formatTime';
import {quotationsList} from './mock';

import loginForm from '@/components/loginForm/index.vue';
import mobileForm from '@/components/mobileForm/index.vue';
import emailForm from '@/components/emailForm/index.vue';

import {
  verifyPhone,
  verifyEmail,
} from '@/utils/toolsValidate';
import {Message} from "element-ui";
import {useListApi} from "@/api/user";
import {captchaApi} from "@/api/captcha";

export default {
  name: 'login',
  components: {loginForm, mobileForm,emailForm},
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
      registerDialog: {
        isShowDialog: false,
        loading: false,
      },
      resetPasswordDialog: {
        isShowDialog: false,
        loading: false,
      },
      resetPasswordForm:{
        type:1,
        mobile: '', // 手机号
        email: '', // 邮箱
        code: '', // 验证码
        password: '', // 账户密码
      },
      registerRuleForm:{
        username: '', // 用户名
        name: '', // 姓名
        mobile: '', // 手机号
        email: '', // 邮箱
        password: '', // 账户密码
      },
      confirmPassword: '', // 确认密码
      checkCode:{
        countdown: 0,
        imgCaptchaSrc: '',
        imgCaptcha: '',
        randomMobileStr: Math.floor(Math.random() * 999999999),
        randomCaptchaStr: Math.floor(Math.random() * 999999999),
        dialogCaptcha: false,
        // 防抖控制相关变量
        lastCaptchaTime: 0,
        captchaDebounceTime: 1000, // 验证码请求防抖时间（毫秒）
        isGettingCaptcha: false,
      }
    };
  },
  created() {
    this.initTime();
  },
  mounted() {
    this.initRandomQuotations();
  },
  methods: {
    getRandomStr() {
      this.checkCode.randomMobileStr = Math.floor(Math.random() * 999999999);
      this.checkCode.randomCaptchaStr = Math.floor(Math.random() * 999999999);
    },

    // 验证码请求防抖函数
    debouncedGetCaptcha(type = '') {
      const now = Date.now();
      if (now - this.checkCode.lastCaptchaTime < this.checkCode.captchaDebounceTime) return console.log('验证码请求过于频繁，已拦截');
      this.checkCode.lastCaptchaTime = now;
      this.getCaptcha(type);
    },

    // 获取验证码
    async getCaptcha(type = '') {
      // 防止重复提交
      if (this.checkCode.isGettingCaptcha) return;
      this.checkCode.isGettingCaptcha = true;

      try {
        if (type === 'img') {
          this.getRandomStr();
          this.checkCode.dialogCaptcha = true;
          this.checkCode.imgCaptcha = '';
          this.checkCode.imgCaptchaSrc = captchaApi().img(this.checkCode.randomCaptchaStr);
        } else {
          await captchaApi().email({
            type: 'phone_msg_register_sysUser',
            //email: this.checkCode.registerForm.username,
            time: this.checkCode.randomMobileStr,
            captcha: this.checkCode.imgCaptcha,
            randomStr: this.checkCode.randomCaptchaStr,
          });
          //this.registerForm.time = this.randomMobileStr;
          this.checkCode.dialogCaptcha = false;
          this.$message.success('邮件发送成功');
          this.startCountdown();
        }
      } catch (error) {
        console.error('获取验证码失败:', error);
      } finally {
        this.isGettingCaptcha = false;
      }
    },

    // 短信60秒倒计时
    startCountdown() {
      this.checkCode.countdown = 60;
      const timer = setInterval(() => {
        this.checkCode.countdown--;
        // 倒计时结束
        if (this.checkCode.countdown <= 0) {
          clearInterval(timer);
          this.checkCode.countdown = 0;
        }
      }, 1000);
    },

    //=================
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
    onRegisterSubmit(){
      if(!this.registerRuleForm.staffNumber){
        Message.error('工号不能为空');
        return;
      }
      if(!this.registerRuleForm.name){
        Message.error('姓名不能为空');
        return;
      }
      if(!this.registerRuleForm.mobile && !verifyPhone(this.registerRuleForm.mobile)){
        Message.error('手机号为空或格式错误');
        return;
      }
      if(!this.registerRuleForm.email && verifyEmail(this.registerRuleForm.email)){
        Message.error('邮箱为空或格式错误');
        return;
      }
      if(!this.registerRuleForm.password){
        Message.error('密码不能为空');
        return;
      }
      if(!this.confirmPassword){
        Message.error('确认密码不能为空');
        return;
      }
      if(this.registerRuleForm.password !== this.confirmPassword){
        Message.error('两次密码不一样');
        return;
      }
      this.registerDialog.loading = true;
      useListApi().register(this.registerRuleForm).then(response => {
        this.registerDialog.loading = false;
        this.registerDialog.isShowDialog = false;
        if(response.code === 0){
          Message.success(response.msg);
        }else {
          Message.error(response.msg);
        }
      }).catch(() => {
        this.registerDialog.loading = false;
      })
    },
    // 找回密码
    retrievePassword(){
      // 手机号
      if(this.resetPasswordForm.type === 1){
        if(!this.resetPasswordForm.mobile && !verifyPhone(this.resetPasswordForm.mobile)){
          Message.error('手机号为空或格式错误');
          return;
        }
      }else {
        // 邮箱
        if(!this.resetPasswordForm.email && verifyEmail(this.resetPasswordForm.email)){
          Message.error('邮箱为空或格式错误');
          return;
        }
      }

    }
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

        .register-row {
          display: flex;
          justify-content: space-between; /* 左右分布 */
          align-items: center;
        }

        .toRegister {
          color: var(--prev-color-text-secondary);
          font-size: 12px;
          text-decoration: none;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
