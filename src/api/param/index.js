import request from '@/utils/request';

/**
 * 参数管理
 *
 * @author czx
 * @email object_czx@163.com
 * @date 2023-04-03 09:19:41
 */
export function useParamApi() {
    return {
        list: (params) => {
            return request({
                url: '/param/manager/list',
                method: 'get',
                params
            });
        },
        query: (params) => {
            return request({
                url: '/param/manager/query',
                method: 'get',
                params
            });
        },
        selectParam: (params) => {
            return request({
                url: '/param/manager/selectParam',
                method: 'get',
                params
            });
        },
        add: (params) => {
            return request({
                url: '/param/manager/save',
                method: 'post',
                data: params
            });
        },
        update: (params) => {
            return request({
                url: '/param/manager/update',
                method: 'post',
                data: params
            });
        },
        copyDefaultParam: (params) => {
            return request({
                url: '/param/manager/copyDefaultParam',
                method: 'post',
                data: params
            });
        },
        copyParam: (params) => {
            return request({
                url: `/param/manager/copyParam`,
                method: 'post',
                data: params
            });
        },
        delete: (params) => {
            return request({
                url: '/param/manager/delete',
                method: 'post',
                data: params
            });
        }
    };
}
