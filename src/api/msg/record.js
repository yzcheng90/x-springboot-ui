import request from '@/utils/request';

/**
 * 短信发送记录（按月分表）
 *
 * @author czx
 * @email object_czx@163.com
 * @date 2025-08-15 17:40:53
 */
export function useMsgRecordApi() {
    return {
        list: (params) => {
            return request({
                url: '/msg/record/list',
                method: 'get',
                params
            });
        },
        add: (params) => {
            return request({
                url: '/msg/record/save',
                method: 'post',
                data: params
            });
        },
        update: (params) => {
            return request({
                url: '/msg/record/update',
                method: 'post',
                data: params
            });
        },
        delete: (params) => {
            return request({
                url: '/msg/record/delete',
                method: 'post',
                data: params
            });
        }
    };
}
