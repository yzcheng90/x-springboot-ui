import request from '@/utils/request';

/**
 * 注册api接口
 * @method register 用户注册
 */
export function emailOrMobileLogin(params) {
	return request({
		url: '/sys/emailOrMobileLogin/login',
		method: 'post',
		params,
	});
}
