import request from '@/utils/request';

/**
 * 文件上传配置
 *
 * @author czx
 * @email object_czx@163.com
 * @date 2024-12-02 09:34:46
 */
export function useOssSettingApi() {
    return {
        list: (params) => {
            return request({
                url: '/ossSetting/manager/list',
                method: 'get',
                params
            });
        },
        select: () => {
            return request({
                url: '/ossSetting/manager/select',
                method: 'get',
            });
        },
        add: (params) => {
            return request({
                url: '/ossSetting/manager/save',
                method: 'post',
                data: params
            });
        },
        update: (params) => {
            return request({
                url: '/ossSetting/manager/update',
                method: 'post',
                data: params
            });
        },
        setDefault: (params) => {
            return request({
                url: '/ossSetting/manager/setDefault',
                method: 'post',
                data: params
            });
        },
        delete: (params) => {
            return request({
                url: '/ossSetting/manager/delete',
                method: 'post',
                data: params
            });
        }
    };
}
