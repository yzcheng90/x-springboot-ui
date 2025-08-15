import request from '@/utils/request';

/**
 * 渠道管理
 *
 * @author czx
 * @email object_czx@163.com
 * @date 2024-11-29 14:48:31
 */
export function useTenancyApi() {
    return {
        list: (params) => {
            return request({
                url: '/tenancy/manager/list',
                method: 'get',
                params
            });
        },
        getInfo: (params) => {
            return request({
                url: '/tenancy/manager/getInfo/' + params,
                method: 'get'
            });
        },
        add: (params) => {
            return request({
                url: '/tenancy/manager/save',
                method: 'post',
                data: params
            });
        },
        delete: (params) => {
            return request({
                url: '/tenancy/manager/delete',
                method: 'post',
                data: params
            });
        },
        update: (params) => {
            return request({
                url: '/tenancy/manager/update',
                method: 'post',
                data: params
            });
        },
        setDefault: (params) => {
            return request({
                url: '/tenancy/manager/setDefault',
                method: 'post',
                data: params
            });
        },
        select: () => {
            return request({
                url: '/tenancy/manager/select',
                method: 'get'
            });
        }
    };
}