const routesListModule = {
	namespaced: true,
	state: {
		routesList: [],
	},
	mutations: {
		// 设置路由，菜单中使用到
		getRoutesList(state, data) {
			state.routesList = data;
		},
	},
	actions: {
		// 设置路由，菜单中使用到
		async setRoutesList({ commit }, data) {
			// eslint-disable-next-line no-console
			console.log("设置路由，菜单中使用到")
			commit('getRoutesList', data);
		},
	},
};

export default routesListModule;
