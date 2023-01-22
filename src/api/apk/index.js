import request from '@/utils/request';

/**
 * APK版本管理
 *
 * @author czx
 * @email object_czx@163.com
 * @date 2023-01-22 17:15:11
 */
export function useApkApi() {
	return {
		list: (params) => {
			return request({
				url: '/sys/apk/list',
				method: 'get',
				params
			});
		},
		add: (params) => {
			return request({
				url: '/sys/apk/save',
		method: 'post',
						data: params
			});
		},
		update: (params) => {
			return request({
				url: '/sys/apk/update',
		method: 'post',
						data: params
			});
		},
		delete: (params) => {
			return request({
				url: '/sys/apk/delete',
		method: 'post',
						data: params
			});
		}
	};
}
