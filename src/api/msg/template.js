import request from '@/utils/request';

/**
 * 短信模板
 *
 * @author czx
 * @email object_czx@163.com
 * @date 2025-08-15 17:48:07
 */
export function useMsgTemplateApi() {
    return {
        list: (params) => {
            return request({
                url: '/msg/template/list',
                method: 'get',
                params
            });
        },
        select: (params) => {
            return request({
                url: '/msg/template/select',
                method: 'get',
                params
            });
        },
        add: (params) => {
            return request({
                url: '/msg/template/save',
                method: 'post',
                data: params
            });
        },
        update: (params) => {
            return request({
                url: '/msg/template/update',
                method: 'post',
                data: params
            });
        },
        delete: (params) => {
            return request({
                url: '/msg/template/delete',
                method: 'post',
                data: params
            });
        }
    };
}
