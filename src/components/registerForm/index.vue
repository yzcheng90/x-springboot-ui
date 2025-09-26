<template>
	<div class="register">
		<el-form
			class="el-form register-form"
			:model="registerForm"
			:rules="registerRulesForm"
			ref="registerForm"
			@keyup.enter.native="handleEnterKey"
		>
			<el-form-item prop="email">
				<el-input
					v-model="registerForm.email"
					placeholder="请输入电子邮箱"
					prefix-icon="el-icon-user"
					clearable
				/>
			</el-form-item>
			<el-form-item prop="mobile">
				<el-input
					type="number"
					maxlength="11"
					v-model="registerForm.mobile"
					placeholder="请输入手机号码"
					prefix-icon="el-icon-user"
					clearable
				/>
			</el-form-item>
			<el-form-item prop="password">
				<el-input
					type="password"
					v-model="registerForm.password"
					placeholder="请输入密码"
					prefix-icon="el-icon-lock"
					clearable
					:show-password="true"
				/>
			</el-form-item>
			<el-form-item prop="confirmPassword">
				<el-input
					type="password"
					v-model="registerForm.confirmPassword"
					placeholder="确认密码"
					prefix-icon="el-icon-lock"
					clearable
					:show-password="true"
				/>
			</el-form-item>
			<el-form-item style="margin: 30px 0px 0">
				<el-button
					type="primary"
					class="register-submit"
					:loading="isSubmitting"
					@click="debouncedSubmitForm('registerForm')"
					ref="submitButton"
				>
					<span>注册</span>
				</el-button>
			</el-form-item>
		</el-form>
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
        email: '',
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
				email: [
					{ required: true, message: '请输入电子邮箱', trigger: 'blur' },
					{
						pattern: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
						message: '请输入正确的电子邮箱格式',
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
			this.isSubmitting = true;
			try {
				const valid = await this.$refs[formName].validate();
				if (!valid) return;
				const { token } = await register(this.registerForm);
				this.$message.success(`注册成功！${this.currentTime} 欢迎回来!`);
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
}
</style>
