import request from '@/utils/request';


export function useListApi() {
	return {
		list: (params) => {
			return request({
				url: '/sys/user/list',
				method: 'get',
				params
			});
		},
		add: (params) => {
			return request({
				url: '/sys/user/save',
				method: 'post',
				data: params
			});
		},
		update: (params) => {
			return request({
				url: '/sys/user/update',
				method: 'post',
				data: params
			});
		},
		delete: (params) => {
			return request({
				url: '/sys/user/delete',
				method: 'post',
				data: params
			});
		}
	};
}
