import request from '@/utils/request';

/**
 * 验证码api接口集合
 * @method img 图形验证码
 * @method signOut 短信验证码
 */
export function captchaApi() {
	return {
		img: (randomStr) => {
			return `/sys/code/${randomStr}`;
		},
		mobile: (params) => {
			return request({
				url: '/app/mobile/code',
				method: 'get',
				params,
			});
		},
	};
}
