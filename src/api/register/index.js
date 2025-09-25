import request from '@/utils/request';

/**
 * 注册api接口
 * @method register 用户注册
 */
export function register(params) {
	return request({
		url: '/sys/userRegister',
		method: 'post',
		params,
	});
}
