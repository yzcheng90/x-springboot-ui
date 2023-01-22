import request from '@/utils/request';

/**
 * 登录api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function useLoginApi() {
	return {
		signIn: (params) => {
			return request({
				url: '/token/login',
				method: 'post',
				params: params
			});
		},
		signOut: () => {
			return request({
				url: '/token/logout',
				method: 'post'
			});
		},
	};
}
