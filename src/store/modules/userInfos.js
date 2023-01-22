import { Session } from '@/utils/storage.js';

const userInfosModule = {
	namespaced: true,
	state: {
		userInfos: {},
	},
	mutations: {
		// 获取用户信息
		getUserInfos(state, data) {
			// eslint-disable-next-line no-console
			console.log("获取用户信息")
			state.userInfos = data;
		},
	},
	actions: {
		// 设置用户信息
		async setUserInfos({ commit }, data) {
			// eslint-disable-next-line no-console
			console.log("设置用户信息")
			if (data) {
				commit('getUserInfos', data);
			} else {
				if (Session.get('userInfo')) commit('getUserInfos', Session.get('userInfo'));
			}
		},
	},
};

export default userInfosModule;
