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
		register: (params) => {
			return request({
				url: '/register',
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
		audit: (params) => {
			return request({
				url: '/sys/user/audit',
				method: 'post',
				data: params
			});
		},
		password: (params) => {
			return request({
				url: '/sys/user/password',
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
