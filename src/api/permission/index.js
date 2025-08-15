import request from '@/utils/request';

/**
 * 接口权限管理
 *
 * @author czx
 * @email object_czx@163.com
 * @date 2023-05-17 14:48:21
 */
export function usePermissionApi() {
    return {
        list: (params) => {
            return request({
                url: '/sys/permission/list',
                method: 'get',
                params
            });
        },
        syncData: () => {
            return request({
                url: '/sys/permission/permissionSync',
                method: 'post'
            });
        },
        buildMenu: (params) => {
            return request({
                url: '/sys/permission/buildMenu',
                method: 'post',
                data: params
            });
        },
        unBuildMenu: (params) => {
            return request({
                url: '/sys/permission/unBuildMenu',
                method: 'post',
                data: params
            });
        },
        menuPermissionTree: () => {
            return request({
                url: '/sys/permission/menuPermissionTree',
                method: 'get'
            });
        }
    };
}
