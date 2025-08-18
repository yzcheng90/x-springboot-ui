import request from '@/utils/request';

/**
 * 应用服务
 *
 * @author czx
 * @email object_czx@163.com
 * @date 2025-08-15 16:34:08
 */
export function useApplicationApi() {
    return {
        list: (params) => {
            return request({
                url: '/application/manager/list',
                method: 'get',
                params
            });
        },
        generateKey: () => {
            return request({
                url: '/application/manager/generateKey',
                method: 'get'
            });
        },
        select: () => {
            return request({
                url: '/application/manager/select',
                method: 'get'
            });
        },
        add: (params) => {
            return request({
                url: '/application/manager/save',
                method: 'post',
                data: params
            });
        },
        update: (params) => {
            return request({
                url: '/application/manager/update',
                method: 'post',
                data: params
            });
        },
        delete: (params) => {
            return request({
                url: '/application/manager/delete',
                method: 'post',
                data: params
            });
        }
    };
}
