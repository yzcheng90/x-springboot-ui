<template>
	<div class="login-main">
		<el-form class="el-form login-form" :model="loginForm" :rules="loginRulesForm" ref="loginFormRef" @keyup.enter.native="submitForm">
			<el-form-item prop="username">
				<el-input
					type="text"
					:placeholder="$t('message.login.placeholder1')"
					prefix-icon="el-icon-user"
					v-model="loginForm.username"
					clearable
					autocomplete="off"
				/>
			</el-form-item>

			<el-form-item prop="password">
				<el-input
					type="password"
					:placeholder="$t('message.login.placeholder2')"
					prefix-icon="el-icon-lock"
					v-model="loginForm.password"
					clearable
					autocomplete="off"
					:show-password="true"
				/>
			</el-form-item>

			<el-form-item prop="captcha">
				<div class="el-row" span="24">
					<div class="el-col el-col-14">
						<el-input
							type="text"
							maxlength="5"
							:placeholder="$t('message.login.placeholder3')"
							prefix-icon="el-icon-position"
							v-model="loginForm.captcha"
							clearable
							autocomplete="off"
						/>
					</div>
					<div class="el-col el-col-10">
						<div class="login-code" @click="getIdentifyingCode(true)">
							<img id="imgIdentifyingCode" class="login-code-img" alt="点击更换" title="点击更换" />
						</div>
					</div>
				</div>
			</el-form-item>
			<el-form-item style="margin: 30px 0px 20px">
				<el-button type="primary" class="login-submit" @click="submitForm" :loading="submit.loading">
					<span>{{ $t('message.login.btnText') }}</span>
				</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import { Session } from '@/utils/storage';
import { formatAxis } from '@/utils/formatTime';
import { PrevLoading } from '@/utils/loading.js';
import { useLoginApi } from '@/api/login';

export default {
	name: 'loginForm',
	computed: {
		currentTime() {
			return formatAxis(new Date());
		},
	},
	data() {
		return {
			submit: {
				loading: false,
			},
			loginForm: {
				username: '',
				password: '',
				captcha: '',
				randomStr: Math.floor(Math.random() * 999999999),
			},
			loginRulesForm: {
				username: [
					{ required: true, message: '请输入手机号', trigger: 'blur' },
					// {
					// 	pattern: /^1[3-9]\d{9}$/,
					// 	message: '请输入正确的手机号格式',
					// 	trigger: 'blur',
					// },
				],
				password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
				captcha: [
					{ required: true, message: '请输入验证码', trigger: 'blur' },
					{ min: 5, max: 5, message: '验证码长度不正确', trigger: 'blur' },
				],
			},
			lastClickTime: 0,
			clickDebounce: 300,
		};
	},
	mounted() {
		this.getRandomStr();
		this.getIdentifyingCode(true);
	},
	methods: {
		// 生成随机字符串
		getRandomStr() {
			this.loginForm.randomStr = Math.floor(Math.random() * 999999999);
		},

		// 获取验证码图片
		getIdentifyingCode(bRefresh) {
			let identifyCodeSrc = 'sys/code/' + this.loginForm.randomStr;
			if (bRefresh) {
				this.getRandomStr();
				identifyCodeSrc = 'sys/code/' + this.loginForm.randomStr;
			}
			const objs = document.getElementById('imgIdentifyingCode');
			objs.src = identifyCodeSrc;
		},

		// 登录提交
		async submitForm() {
			const now = Date.now();

			if (now - this.lastClickTime < this.clickDebounce) return console.log('防抖拦截重复点击');

			this.lastClickTime = now;

			const valid = await this.$refs.loginFormRef.validate();
			if (!valid) return;

			this.submit.loading = true;
			useLoginApi()
				.signIn(this.loginForm)
				.then((res) => {
					// eslint-disable-next-line no-console
					this.$message.success(`${this.currentTime}，${this.$t('message.login.signInText')}`);
					// 存储 token 到浏览器缓存
					Session.set('token', res.token);
					localStorage.setItem('token', res.token);
					PrevLoading.start();
					this.$router.push('/');
				})
				.catch(() => {
					this.getIdentifyingCode(true);
				})
				.finally(() => {
					this.submit.loading = false;
				});
		},
	},
};
</script>
<style lang="scss" scoped>
.login-main {
	margin: 0 auto;

	.login-form {
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
</style>
