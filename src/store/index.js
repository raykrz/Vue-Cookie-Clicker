import { createStore } from 'vuex'

export default createStore({
  state: {
    cookies: 0,
    autoProduction: 0,
    upgrades: [
      { id: 1, name: 'Cursor', cost: 10, production: 1, owned: 0 },
      { id: 2, name: 'Grandma', cost: 50, production: 5, owned: 0 },
      { id: 3, name: 'Farm', cost: 200, production: 20, owned: 0 },
      { id: 4, name: 'Factory', cost: 1000, production: 100, owned: 0 },
    ],
  },
  mutations: {
    ADD_COOKIES(state, amount) {
      state.cookies += amount
    },
    BUY_UPGRADE(state, upgrade) {
      state.cookies -= upgrade.cost
      upgrade.owned += 1
      state.autoProduction += upgrade.production
      upgrade.cost = Math.ceil(upgrade.cost * 1.15)
    },
  },
  actions: {
    clickCookie({ commit }) {
      commit('ADD_COOKIES', 1)
    },
    buyUpgrade({ commit, state }, upgradeId) {
      const upgrade = state.upgrades.find((u) => u.id === upgradeId)
      if (upgrade && state.cookies >= upgrade.cost) {
        commit('BUY_UPGRADE', upgrade)
      }
    },
    startAutoProduction({ commit, state }) {
      setInterval(() => {
        if (state.autoProduction > 0) {
          commit('ADD_COOKIES', state.autoProduction)
        }
      }, 1000)
    },
  },
  getters: {
    totalCookies: (state) => state.cookies,
    productionPerSecond: (state) => state.autoProduction,
    upgrades: (state) => state.upgrades,
  },
})
