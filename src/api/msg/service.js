import request from '@/utils/request';

/**
 * 短信服务
 *
 * @author czx
 * @email object_czx@163.com
 * @date 2025-08-15 17:51:27
 */
export function useMsgServiceApi() {
    return {
        list: (params) => {
            return request({
                url: '/msg/service/list',
                method: 'get',
                params
            });
        },
        add: (params) => {
            return request({
                url: '/msg/service/save',
                method: 'post',
                data: params
            });
        },
        update: (params) => {
            return request({
                url: '/msg/service/update',
                method: 'post',
                data: params
            });
        },
        delete: (params) => {
            return request({
                url: '/msg/service/delete',
                method: 'post',
                data: params
            });
        }
    };
}
