<template>
    <div class="login">
        <div class="login-weaper">
            <div class="login-left">
                <div class="login-time">{{ time.txt }}</div>
                <div class="login-left-box">
                    <div>
                        <div class="logo">{{ getThemeConfig.globalViceTitle }}</div>
                        <h2 class="title">{{ getThemeConfig.globalViceDes }}</h2>
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
                <div class="login-main">
                    <h4 class="login-title">{{ getThemeConfig.globalTitle }}</h4>
                    <el-form class="el-form login-form">
                        <el-form-item style="margin-left: 0px" prop="username">
                            <el-input
                                    type="text"
                                    :placeholder="$t('message.login.placeholder1')"
                                    prefix-icon="el-icon-user"
                                    v-model="ruleForm.username"
                                    clearable
                                    autocomplete="off"
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item style="margin-left: 0px" prop="password">
                            <el-input
                                    type="password"
                                    :placeholder="$t('message.login.placeholder2')"
                                    prefix-icon="el-icon-lock"
                                    v-model="ruleForm.password"
                                    autocomplete="off"
                                    :show-password="true"
                            >
                            </el-input>
                        </el-form-item>
                        <el-form-item style="margin-left: 0px" prop="captcha">
                            <div class="el-row" span="24">
                                <div class="el-col el-col-14">
                                    <el-input
                                            type="text"
                                            maxlength="5"
                                            :placeholder="$t('message.login.placeholder3')"
                                            prefix-icon="el-icon-position"
                                            v-model="ruleForm.captcha"
                                            clearable
                                            autocomplete="off"
                                    ></el-input>
                                </div>
                                <div class="el-col el-col-10">
                                    <div class="login-code" @click="getIdentifyingCode(true)">
                                        <img id="imgIdentifyingCode" class="login-code-img" alt="点击更换" title="点击更换">
                                    </div>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item style="margin: 40px 0px 0">
                            <el-button type="primary" class="login-submit" @click="submitForm"
                                       :loading="submit.loading">
                                <span>{{ $t('message.login.btnText') }}</span>
                            </el-button>
                        </el-form-item>
                    </el-form>
                    <!--					<div class="login-menu">-->
                    <!--						<a href="javascript:;">{{ $t('message.login.link.one1') }}</a>-->
                    <!--						<a href="javascript:;">{{ $t('message.login.link.one2') }}</a>-->
                    <!--					</div>-->
                </div>
            </div>
        </div>
        <div class="vue-particles">
            <vue-particles color="#dedede" shapeType="star" linesColor="#dedede" hoverMode="grab" clickMode="push"
                           style="height: 100%"></vue-particles>
        </div>
    </div>
</template>

<script>
    import {Session} from '@/utils/storage';
    import {formatAxis, formatDate} from '@/utils/formatTime';
    import {PrevLoading} from '@/utils/loading.js';
    import {quotationsList} from './mock';
    import {useLoginApi} from '@/api/login';

    export default {
        name: 'login',
        data() {
            return {
                quotationsList,
                quotations: {},
                isView: false,
                submit: {
                    loading: false,
                },
                ruleForm: {
                    username: 'admin',
                    password: 'admin',
                    captcha: '',
                    randomStr: Math.floor(Math.random() * 999999999)
                },
                time: {
                    txt: '',
                    fun: null,
                },
            };
        },
        computed: {
            // 获取当前时间
            currentTime() {
                return formatAxis(new Date());
            },
            // 获取布局配置信息
            getThemeConfig() {
                return this.$store.state.themeConfig.themeConfig;
            },
        },
        created() {
            this.initTime();
        },
        mounted() {
            this.initRandomQuotations();
            this.getRandomStr()
            this.getIdentifyingCode(true)
        },
        methods: {
            getRandomStr() {
                this.ruleForm.randomStr = Math.floor(Math.random() * 999999999)
            },
            getIdentifyingCode(bRefresh) {
                let identifyCodeSrc = 'sys/code/' + this.ruleForm.randomStr
                if (bRefresh) {
                    this.getRandomStr()
                    identifyCodeSrc = 'sys/code/' + this.ruleForm.randomStr
                }
                const objs = document.getElementById('imgIdentifyingCode')
                objs.src = identifyCodeSrc
            },
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
            // 登录按钮点击
            submitForm() {
                this.submit.loading = true;
                useLoginApi().signIn(this.ruleForm).then((res) => {
                    // eslint-disable-next-line no-console
                    this.$message.success(`${this.currentTime}，${this.$t('message.login.signInText')}`);
                    // 存储 token 到浏览器缓存
                    Session.set('token', res.token);
                    PrevLoading.start();
                    this.$router.push('/');
                }).catch(() => {
                    this.submit.loading = false
                })
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
                align-items: center;
                display: flex;
                background-color: var(--prev-bg-white);
                border-top-right-radius: 4px;
                border-bottom-right-radius: 4px;

                .login-main {
                    margin: 0 auto;
                    width: 70%;

                    .login-title {
                        color: var(--prev-color-text-primary);
                        margin-bottom: 40px;
                        font-weight: 500;
                        font-size: 22px;
                        text-align: center;
                        letter-spacing: 4px;
                    }

                    .login-form {
                        margin: 10px 0;

                        i {
                            color: var(--prev-color-text-primary);
                        }

                        .el-form-item {
                            margin-bottom: 20px !important;

                            .login-code {
                                display: flex;
                                align-items: center;
                                justify-content: space-around;
                                margin: 0 0 0 10px;
                                user-select: none;

                                .login-code-img {
                                    margin-top: 2px;
                                    width: 120px;
                                    height: 38px;
                                    border: 1px solid var(--prev-border-color-base);
                                    color: var(--prev-color-text-primary);
                                    font-size: 14px;
                                    font-weight: 700;
                                    letter-spacing: 5px;
                                    line-height: 38px;
                                    text-indent: 5px;
                                    text-align: center;
                                    cursor: pointer;
                                    transition: all ease 0.2s;
                                    border-radius: 4px;

                                    &:hover {
                                        border-color: var(--prev-border-color-hover);
                                        transition: all ease 0.2s;
                                    }
                                }
                            }

                            .login-submit {
                                width: 100%;
                                letter-spacing: 2px;
                            }
                        }
                    }

                    .login-menu {
                        margin-top: 30px;
                        width: 100%;
                        text-align: left;

                        a {
                            color: var(--prev-color-text-secondary);
                            font-size: 12px;
                            margin: 0 8px;
                            text-decoration: none;

                            &:hover {
                                color: var(--prev-color-primary);
                                text-decoration: underline;
                            }
                        }
                    }
                }
            }
        }
    }
</style>
