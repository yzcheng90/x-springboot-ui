<template>
	<div class="register">
		<el-form
			class="el-form register-form"
			:model="registerForm"
			:rules="registerRulesForm"
			ref="registerForm"
			@keyup.enter.native="handleEnterKey"
		>
			<el-form-item prop="mobile">
				<el-input
					type="number"
					maxlength="11"
					v-model="registerForm.mobile"
					:placeholder="$t('message.register.mobile')"
					prefix-icon="el-icon-user"
					clearable
				/>
			</el-form-item>
			<el-form-item prop="password">
				<el-input
					type="password"
					v-model="registerForm.password"
					:placeholder="$t('message.register.password')"
					prefix-icon="el-icon-lock"
					clearable
					:show-password="true"
				/>
			</el-form-item>
			<el-form-item prop="confirmPassword">
				<el-input
					type="password"
					v-model="registerForm.confirmPassword"
					:placeholder="$t('message.register.confirmPassword')"
					prefix-icon="el-icon-lock"
					clearable
					:show-password="true"
				/>
			</el-form-item>
			<el-form-item prop="code">
				<div class="register-captcha">
					<el-input
						type="text"
						maxlength="6"
						:placeholder="$t('message.register.captcha')"
						prefix-icon="el-icon-position"
						v-model="registerForm.code"
						clearable
						autocomplete="off"
					/>
					<el-button @click="debouncedGetCaptcha('img')" :disabled="countdown > 0 || isGettingCaptcha">
						{{ countdown > 0 ? `${countdown}秒后重新获取` : '获取验证码' }}
					</el-button>
				</div>
			</el-form-item>
			<el-form-item style="margin: 30px 0px 0">
				<el-button
					type="primary"
					class="register-submit"
					:loading="isSubmitting"
					@click="debouncedSubmitForm('registerForm')"
					ref="submitButton"
				>
					<span>{{ $t('message.register.btnText') }}</span>
				</el-button>
			</el-form-item>
		</el-form>

		<el-dialog title="请输入图形验证码" class="dialogCaptcha" :visible.sync="dialogCaptcha" width="300px" :modal-append-to-body="false">
			<img :src="imgCaptchaSrc" class="captcha-img" alt="点击更换" title="点击更换" @click="debouncedGetCaptcha('img')" />
			<span class="change" @click="debouncedGetCaptcha('img')">换一批</span>
			<el-input
				type="text"
				maxlength="6"
				:placeholder="$t('message.register.captcha')"
				prefix-icon="el-icon-position"
				v-model="imgCaptcha"
				clearable
			/>

			<div slot="footer">
				<el-button
					@click="
						dialogCaptcha = false;
						imgCaptcha = '';
					"
				>
					取 消
				</el-button>
				<el-button type="primary" @click="debouncedGetCaptcha" @keyup.enter.native="debouncedGetCaptcha" ref="dialogConfirmBtn">
					确 定
				</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import { captchaApi } from '@/api/captcha';
import { register } from '@/api/register';
import { Session } from '@/utils/storage';
import { formatAxis } from '@/utils/formatTime';
import { PrevLoading } from '@/utils/loading.js';
export default {
	name: 'registerForm',
	computed: {
		// 获取当前时间
		currentTime() {
			return formatAxis(new Date());
		},
	},
	data() {
		return {
			registerForm: {
				mobile: '',
				password: '',
				confirmPassword: '',
				code: '',
				time: null,
			},
			registerRulesForm: {
				mobile: [
					{ required: true, message: '请输入手机号', trigger: 'blur' },
					{
						pattern: /^1[3-9]\d{9}$/,
						message: '请输入正确的手机号格式',
						trigger: 'blur',
					},
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					// { min: 6, max: 20, message: '密码长度在6-20个字符之间', trigger: 'blur' }
				],
				confirmPassword: [
					{ required: true, message: '请确认密码', trigger: 'blur' },
					{
						validator: (rule, value, callback) => {
							if (value !== this.registerForm.password) {
								callback(new Error('两次输入的密码不一致'));
							} else {
								callback();
							}
						},
						trigger: 'blur',
					},
				],
				code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
			},

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

			lastSubmitTime: 0,
			submitDebounceTime: 2000,
			isSubmitting: false,
		};
	},
	mounted() {},
	methods: {
		getRandomStr() {
			this.randomMobileStr = Math.floor(Math.random() * 999999999);
			this.randomCaptchaStr = Math.floor(Math.random() * 999999999);
		},

		// 验证码请求防抖函数
		debouncedGetCaptcha(type = '') {
			const now = Date.now();

			if (now - this.lastCaptchaTime < this.captchaDebounceTime) return console.log('验证码请求过于频繁，已拦截');

			this.lastCaptchaTime = now;
			this.getCaptcha(type);
		},

		// 获取验证码
		async getCaptcha(type = '') {
			// 防止重复提交
			if (this.isGettingCaptcha) return;

			const phoneReg = /^1[3-9]\d{9}$/;

			if (!this.registerForm.mobile) {
				this.$message.warning('请先输入手机号');
				return;
			} else if (!phoneReg.test(this.registerForm.mobile)) {
				this.$message.warning('请输入正确的手机号格式');
				return;
			}

			this.isGettingCaptcha = true;

			try {
				if (type === 'img') {
					this.getRandomStr();
					this.dialogCaptcha = true;
					this.imgCaptcha = '';
					this.imgCaptchaSrc = captchaApi().img(this.randomCaptchaStr);
				} else {
					await captchaApi().mobile({
						type: 'phone_msg_register_sysUser',
						mobile: this.registerForm.mobile,
						time: this.randomMobileStr,
						captcha: this.imgCaptcha,
						randomStr: this.randomCaptchaStr,
					});
					this.registerForm.time = this.randomMobileStr;
					this.dialogCaptcha = false;
					this.$message.success('短信发送成功');
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
			this.countdown = 60;
			const timer = setInterval(() => {
				this.countdown--;
				// 倒计时结束
				if (this.countdown <= 0) {
					clearInterval(timer);
					this.countdown = 0;
				}
			}, 1000);
		},

		// 处理表单回车事件
		handleEnterKey() {
			if (this.dialogCaptcha) {
				this.$nextTick(() => {
					if (this.$refs.dialogConfirmBtn) this.$refs.dialogConfirmBtn.$el.click();
				});
			} else {
				this.$refs.submitButton.$el.click();
			}
		},

		// 注册提交防抖
		debouncedSubmitForm(formName) {
			const now = Date.now();

			if (now - this.lastSubmitTime < this.submitDebounceTime) return console.log('注册提交过于频繁，已拦截');

			this.lastSubmitTime = now;
			this.submitForm(formName);
		},

		// 提交注册
		async submitForm(formName) {
			if (this.isSubmitting) return;

			if (!this.registerForm.time) return this.$message.warning('请获取验证码');

			this.isSubmitting = true;

			try {
				const valid = await this.$refs[formName].validate();
				if (!valid) return;

				const { token } = await register(this.registerForm);
				this.$message.success(`注册成功！${this.currentTime}，${this.$t('message.register.signInText')}`);
				Session.set('token', token);
				localStorage.setItem('token', token);
				PrevLoading.start();
				this.$router.push('/');
			} catch (error) {
				console.error('注册失败:', error);
			} finally {
				this.isSubmitting = false;
			}
		},
	},
};
</script>
<style lang="scss" scoped>
.register-form {
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

		.register-submit {
			width: 100%;
			letter-spacing: 2px;
		}
	}

	::v-deep input[type='number']::-webkit-outer-spin-button,
	::v-deep input[type='number']::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	::v-deep input[type='number'] {
		-moz-appearance: textfield;
	}
	.register-captcha {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: space-between;
		gap: 11px;
	}
}

::v-deep .dialogCaptcha {
	.el-dialog__body {
		display: flex;
		flex-flow: column nowrap;
		align-items: right;
		.captcha-img {
			// width: 100%;
		}
		.change {
			text-align: right;
			cursor: pointer;
			margin: 10px 0;
			text-decoration: underline;
		}
	}
}
</style>
