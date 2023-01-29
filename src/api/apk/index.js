import request from '@/utils/request';

/**
 * APK版本管理
 *
 * @author czx
 * @email object_czx@163.com
 * @date 2023-01-26 20:32:33
 */
export function useApkApi() {
	return {
		list: (params) => {
			return request({
				url: '/apk/version/list',
				method: 'get',
				params
			});
		},
		add: (params) => {
			return request({
				url: '/apk/version/save',
				method: 'post',
				data: params
			});
		},
		update: (params) => {
			return request({
				url: '/apk/version/update',
				method: 'post',
				data: params
			});
		},
		delete: (params) => {
			return request({
				url: '/apk/version/delete',
				method: 'post',
				data: params
			});
		}
	};
}
