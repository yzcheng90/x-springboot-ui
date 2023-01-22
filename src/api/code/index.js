import request from '@/utils/request';


export function useCodeGenApi() {
	return {
		list: (params) => {
			return request({
				url: '/sys/gen/list',
				method: 'get',
				params: params
			});
		},
		create: (params) => {
			return request({
				url: '/sys/gen/create',
				method: 'post',
				data: params
			});
		}
	};
}
