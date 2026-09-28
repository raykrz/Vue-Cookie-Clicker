import { createStore } from 'vuex'
import { hashPassword } from '../utils/crypto'
import { loadUsers, saveUsers, loadSession, saveSession, clearSession } from '../utils/persistence'

export const RANKS = [
  { name: 'Baker', requiredCookies: 0, clickMultiplier: 1, costDiscount: 1 },
  { name: 'Gold', requiredCookies: 1000, clickMultiplier: 2, costDiscount: 0.9 },
  { name: 'Emerald', requiredCookies: 100000, clickMultiplier: 4, costDiscount: 0.8 },
  { name: 'Diamond', requiredCookies: 5000000, clickMultiplier: 8, costDiscount: 0.65 },
  { name: 'God', requiredCookies: 500000000, clickMultiplier: 16, costDiscount: 0.5 },
]

const GORDON_PHRASES = [
  "IT'S RAW!",
  'Where is the lamb sauce?!',
  'Finally, some good cookies!',
  'You donut!',
  'Get out of my kitchen!',
  'Wake up and bake!',
  'My nan could bake better than this!',
  'Beautiful! Just beautiful!',
  "This cookie's so raw it's still mooing!",
]

function createUpgrades() {
  return [
    { id: 1, name: 'Cursor', baseCost: 10, cost: 10, production: 1, owned: 0, requiredRank: 0, maxOwned: Infinity },
    { id: 2, name: 'Grandma', baseCost: 50, cost: 50, production: 5, owned: 0, requiredRank: 0, maxOwned: Infinity },
    { id: 3, name: 'Farm', baseCost: 200, cost: 200, production: 20, owned: 0, requiredRank: 0, maxOwned: Infinity },
    { id: 4, name: 'Factory', baseCost: 1000, cost: 1000, production: 100, owned: 0, requiredRank: 0, maxOwned: Infinity },
    { id: 5, name: 'Mine', baseCost: 5000, cost: 5000, production: 500, owned: 0, requiredRank: 0, maxOwned: Infinity },
    { id: 6, name: 'Bakery Truck', baseCost: 25000, cost: 25000, production: 2500, owned: 0, requiredRank: 0, maxOwned: Infinity },
    { id: 7, name: 'Gordon Ramsay', baseCost: 5000, cost: 5000, production: 250, owned: 0, requiredRank: 1, maxOwned: 1, isGordon: true },
    { id: 8, name: 'Gold Refinery', baseCost: 100000, cost: 100000, production: 10000, owned: 0, requiredRank: 1, maxOwned: Infinity },
    { id: 9, name: 'Cookie Bank', baseCost: 500000, cost: 500000, production: 50000, owned: 0, requiredRank: 1, maxOwned: Infinity },
    { id: 10, name: 'Golden Temple', baseCost: 2500000, cost: 2500000, production: 250000, owned: 0, requiredRank: 1, maxOwned: Infinity },
    { id: 11, name: 'Emerald Quarry', baseCost: 12000000, cost: 12000000, production: 1200000, owned: 0, requiredRank: 2, maxOwned: Infinity },
    { id: 12, name: 'Wizard Tower', baseCost: 60000000, cost: 60000000, production: 6000000, owned: 0, requiredRank: 2, maxOwned: Infinity },
    { id: 13, name: 'Cookie Portal', baseCost: 300000000, cost: 300000000, production: 30000000, owned: 0, requiredRank: 2, maxOwned: Infinity },
    { id: 14, name: 'Diamond Drill', baseCost: 1500000000, cost: 1500000000, production: 150000000, owned: 0, requiredRank: 3, maxOwned: Infinity },
    { id: 15, name: 'Time Machine', baseCost: 8000000000, cost: 8000000000, production: 800000000, owned: 0, requiredRank: 3, maxOwned: Infinity },
    { id: 16, name: 'Antimatter Condenser', baseCost: 40000000000, cost: 40000000000, production: 4000000000, owned: 0, requiredRank: 3, maxOwned: Infinity },
    { id: 17, name: 'Cosmic Prism', baseCost: 200000000000, cost: 200000000000, production: 20000000000, owned: 0, requiredRank: 4, maxOwned: Infinity },
    { id: 18, name: 'Reality Engine', baseCost: 1000000000000, cost: 1000000000000, production: 100000000000, owned: 0, requiredRank: 4, maxOwned: Infinity },
    { id: 19, name: 'Infinity Cookie', baseCost: 5000000000000, cost: 5000000000000, production: 500000000000, owned: 0, requiredRank: 4, maxOwned: Infinity },
  ]
}

function mergeUpgrades(savedUpgrades = []) {
  const savedById = new Map(savedUpgrades.map((upgrade) => [upgrade.id, upgrade]))
  return createUpgrades().map((template) => {
    const saved = savedById.get(template.id)
    return saved ? { ...template, owned: saved.owned, cost: saved.cost } : template
  })
}

function createGameState() {
  return {
    cookies: 0,
    totalEarned: 0,
    autoProduction: 0,
    rank: 0,
    upgrades: createUpgrades(),
  }
}

function snapshotGameState(state) {
  return {
    cookies: state.cookies,
    totalEarned: state.totalEarned,
    autoProduction: state.autoProduction,
    rank: state.rank,
    upgrades: state.upgrades.map((upgrade) => ({ ...upgrade })),
  }
}

export default createStore({
  state: {
    ...createGameState(),
    gordonMessage: '',
    gordonMessageVisible: false,
    currentUser: null,
    users: {},
  },
  mutations: {
    ADD_COOKIES(state, amount) {
      state.cookies += amount
      state.totalEarned += amount
    },
    BUY_UPGRADE(state, { upgrade, cost }) {
      state.cookies -= cost
      upgrade.owned += 1
      state.autoProduction += upgrade.production
      upgrade.cost = Math.ceil(upgrade.cost * 1.15)
    },
    RANK_UP(state) {
      state.rank += 1
      state.cookies = 0
      state.autoProduction = 0
      state.upgrades.forEach((upgrade) => {
        upgrade.owned = 0
        upgrade.cost = upgrade.baseCost
      })
    },
    SHOW_GORDON_MESSAGE(state, message) {
      state.gordonMessage = message
      state.gordonMessageVisible = true
    },
    HIDE_GORDON_MESSAGE(state) {
      state.gordonMessageVisible = false
    },
    SET_USERS(state, users) {
      state.users = users
    },
    SET_CURRENT_USER(state, user) {
      state.currentUser = user
    },
    LOAD_GAME_STATE(state, snapshot) {
      state.cookies = snapshot.cookies
      state.totalEarned = snapshot.totalEarned
      state.autoProduction = snapshot.autoProduction
      state.rank = snapshot.rank
      state.upgrades = mergeUpgrades(snapshot.upgrades)
      state.gordonMessageVisible = false
    },
  },
  actions: {
    clickCookie({ commit, getters }) {
      commit('ADD_COOKIES', getters.clickMultiplier)
    },
    buyUpgrade({ commit, state, getters }, upgradeId) {
      const upgrade = state.upgrades.find((u) => u.id === upgradeId)
      if (!upgrade || upgrade.owned >= upgrade.maxOwned) return
      const cost = getters.effectiveCost(upgrade)
      if (state.cookies < cost) return
      commit('BUY_UPGRADE', { upgrade, cost })
    },
    rankUp({ commit, getters }) {
      if (getters.canRankUp) commit('RANK_UP')
    },
    startAutoProduction({ commit, state, getters }) {
      setInterval(() => {
        if (state.autoProduction > 0) {
          commit('ADD_COOKIES', state.autoProduction * getters.clickMultiplier)
        }
      }, 1000)
    },
    startGordonChatter({ commit, getters }) {
      const scheduleNext = () => {
        const delay = 5000 + Math.random() * 10000
        setTimeout(() => {
          if (getters.gordonOwned) {
            const message = GORDON_PHRASES[Math.floor(Math.random() * GORDON_PHRASES.length)]
            commit('SHOW_GORDON_MESSAGE', message)
            setTimeout(() => commit('HIDE_GORDON_MESSAGE'), 3000)
          }
          scheduleNext()
        }, delay)
      }
      scheduleNext()
    },
    async initAuth({ commit }) {
      let users = loadUsers()
      if (!users.admin) {
        const passwordHash = await hashPassword('admin')
        users = { ...users, admin: { username: 'admin', passwordHash, role: 'admin', game: null } }
        saveUsers(users)
      }
      commit('SET_USERS', users)

      const sessionUsername = loadSession()
      if (sessionUsername && users[sessionUsername]) {
        commit('SET_CURRENT_USER', { username: sessionUsername, role: users[sessionUsername].role })
        commit('LOAD_GAME_STATE', users[sessionUsername].game || createGameState())
      }
    },
    async register({ commit, state }, { username, password }) {
      username = username.trim()
      if (!username || !password) return { success: false, error: 'Username and password are required.' }
      if (state.users[username]) return { success: false, error: 'Username already taken.' }

      const passwordHash = await hashPassword(password)
      const game = createGameState()
      const users = { ...state.users, [username]: { username, passwordHash, role: 'player', game } }
      saveUsers(users)
      commit('SET_USERS', users)
      commit('SET_CURRENT_USER', { username, role: 'player' })
      commit('LOAD_GAME_STATE', game)
      saveSession(username)
      return { success: true }
    },
    async login({ commit, state }, { username, password }) {
      username = username.trim()
      const user = state.users[username]
      if (!user) return { success: false, error: 'User not found.' }

      const passwordHash = await hashPassword(password)
      if (passwordHash !== user.passwordHash) return { success: false, error: 'Incorrect password.' }

      commit('SET_CURRENT_USER', { username, role: user.role })
      commit('LOAD_GAME_STATE', user.game || createGameState())
      saveSession(username)
      return { success: true }
    },
    logout({ commit, dispatch, state }) {
      if (state.currentUser) dispatch('saveGame')
      commit('SET_CURRENT_USER', null)
      commit('LOAD_GAME_STATE', createGameState())
      clearSession()
    },
    saveGame({ commit, state }) {
      if (!state.currentUser) return
      const snapshot = snapshotGameState(state)
      const existing = state.users[state.currentUser.username]
      const users = { ...state.users, [state.currentUser.username]: { ...existing, game: snapshot } }
      saveUsers(users)
      commit('SET_USERS', users)
    },
    startAutoSave({ dispatch, state }) {
      setInterval(() => {
        if (state.currentUser) dispatch('saveGame')
      }, 15000)
    },
    adminUpdateScore({ commit, state }, { username, cookies, totalEarned }) {
      if (state.currentUser?.role !== 'admin') return
      const target = state.users[username]
      if (!target) return
      const snapshot = { ...(target.game || createGameState()), cookies, totalEarned }
      const users = { ...state.users, [username]: { ...target, game: snapshot } }
      saveUsers(users)
      commit('SET_USERS', users)
      if (state.currentUser.username === username) commit('LOAD_GAME_STATE', snapshot)
    },
    adminResetPlayer({ commit, state }, username) {
      if (state.currentUser?.role !== 'admin') return
      const target = state.users[username]
      if (!target) return
      const freshGame = createGameState()
      const users = { ...state.users, [username]: { ...target, game: freshGame } }
      saveUsers(users)
      commit('SET_USERS', users)
      if (state.currentUser.username === username) commit('LOAD_GAME_STATE', freshGame)
    },
  },
  getters: {
    totalCookies: (state) => state.cookies,
    totalEarned: (state) => state.totalEarned,
    productionPerSecond: (state, getters) => state.autoProduction * getters.clickMultiplier,
    currentRank: (state) => RANKS[state.rank],
    rankIndex: (state) => state.rank,
    nextRank: (state) => RANKS[state.rank + 1] || null,
    clickMultiplier: (state) => RANKS[state.rank].clickMultiplier,
    canRankUp: (state, getters) => getters.nextRank !== null && state.totalEarned >= getters.nextRank.requiredCookies,
    rankProgress: (state, getters) => {
      if (!getters.nextRank) return 1
      return Math.min(state.totalEarned / getters.nextRank.requiredCookies, 1)
    },
    effectiveCost: (state) => (upgrade) => Math.ceil(upgrade.cost * RANKS[state.rank].costDiscount),
    visibleUpgrades: (state) => state.upgrades.filter((upgrade) => upgrade.requiredRank <= state.rank),
    gordonOwned: (state) => state.upgrades.find((upgrade) => upgrade.isGordon)?.owned > 0,
    gordonMessage: (state) => state.gordonMessage,
    gordonMessageVisible: (state) => state.gordonMessageVisible,
    isAuthenticated: (state) => !!state.currentUser,
    isAdmin: (state) => state.currentUser?.role === 'admin',
    allUsers: (state) => Object.values(state.users),
    leaderboard: (state) =>
      Object.values(state.users)
        .map((user) => ({
          username: user.username,
          role: user.role,
          cookies: user.game?.cookies ?? 0,
          totalEarned: user.game?.totalEarned ?? 0,
          rankIndex: user.game?.rank ?? 0,
          rankName: RANKS[user.game?.rank ?? 0].name,
        }))
        .sort((a, b) => b.totalEarned - a.totalEarned),
  },
})
