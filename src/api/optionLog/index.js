import request from '@/utils/request';


export function useOptionLogApi() {
	return {
		list: (params) => {
			return request({
				url: '/sys/log/list',
				method: 'get',
				params: params
			});
		},
		loginList: (params) => {
			return request({
				url: '/sys/log/loginList',
				method: 'get',
				params: params
			});
		}
	};
}
