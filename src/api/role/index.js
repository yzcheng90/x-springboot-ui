import request from '@/utils/request';


export function roleListApi() {
	return {
		list: (params) => {
			return request({
				url: '/sys/role/list',
				method: 'get',
				params
			});
		},
		add: (params) => {
			return request({
				url: '/sys/role/save',
				method: 'post',
				data: params
			});
		},
		update: (params) => {
			return request({
				url: '/sys/role/update',
				method: 'post',
				data: params
			});
		},
		delete: (params) => {
			return request({
				url: '/sys/role/delete',
				method: 'post',
				data: params
			});
		},
		select: () => {
			return request({
				url: '/sys/role/select',
				method: 'get'
			});
		}
	};
}
