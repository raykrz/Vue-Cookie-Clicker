<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import AuthView from './components/AuthView.vue'
import GameView from './components/GameView.vue'
import Leaderboard from './components/Leaderboard.vue'
import AdminPanel from './components/AdminPanel.vue'

const store = useStore()
const view = ref('game')

const THEMES = [
  {
    bg: '#ffe4b0',
    heading: '#cf7346',
    card: '#ffac10',
    cardText: '#4a2f1c',
    button: '#cf7346',
    buttonText: '#ffffff',
    progressTrack: '#ffe4b0',
    progressBorder: '#ffac10',
    progressFill: '#ffac10',
    disabled: '#d9b79b',
    badge: '#cf7346',
  },
  {
    bg: '#fff3d0',
    heading: '#8a6300',
    card: '#ffd700',
    cardText: '#4a3900',
    button: '#b8860b',
    buttonText: '#ffffff',
    progressTrack: '#fff3d0',
    progressBorder: '#ffd700',
    progressFill: '#ffd700',
    disabled: '#e6d9a8',
    badge: '#b8860b',
  },
  {
    bg: '#dff7e8',
    heading: '#0b6e4f',
    card: '#2ecc71',
    cardText: '#0b3d2e',
    button: '#0b6e4f',
    buttonText: '#ffffff',
    progressTrack: '#dff7e8',
    progressBorder: '#2ecc71',
    progressFill: '#2ecc71',
    disabled: '#b7e6c9',
    badge: '#0b6e4f',
  },
  {
    bg: '#e0f7ff',
    heading: '#1b6fa8',
    card: '#5dc9f1',
    cardText: '#0b3552',
    button: '#1b6fa8',
    buttonText: '#ffffff',
    progressTrack: '#e0f7ff',
    progressBorder: '#5dc9f1',
    progressFill: '#5dc9f1',
    disabled: '#bee7f5',
    badge: '#1b6fa8',
  },
  {
    bg: '#180b2e',
    heading: '#e9a6ff',
    card: '#8b5cf6',
    cardText: '#f3e8ff',
    button: '#d946ef',
    buttonText: '#ffffff',
    progressTrack: '#2a1750',
    progressBorder: '#d946ef',
    progressFill: '#d946ef',
    disabled: '#4b3b70',
    badge: '#d946ef',
  },
]

const theme = computed(() => THEMES[store.getters.rankIndex])
const themeStyle = computed(() => ({
  '--color-bg': theme.value.bg,
  '--color-heading': theme.value.heading,
  '--color-card': theme.value.card,
  '--color-card-text': theme.value.cardText,
  '--color-button': theme.value.button,
  '--color-button-text': theme.value.buttonText,
  '--color-progress-track': theme.value.progressTrack,
  '--color-progress-border': theme.value.progressBorder,
  '--color-progress-fill': theme.value.progressFill,
  '--color-disabled': theme.value.disabled,
  '--color-badge': theme.value.badge,
}))

onMounted(async () => {
  await store.dispatch('initAuth')
  store.dispatch('startAutoProduction')
  store.dispatch('startGordonChatter')
  store.dispatch('startAutoSave')
})

function logout() {
  store.dispatch('logout')
  view.value = 'game'
}

const showSaveToast = ref(false)
let saveToastTimeout = null

function saveGame() {
  store.dispatch('saveGame')
  showSaveToast.value = true
  clearTimeout(saveToastTimeout)
  saveToastTimeout = setTimeout(() => {
    showSaveToast.value = false
  }, 2000)
}
</script>

<template>
  <div class="theme-root" :style="themeStyle">
    <div class="content" :class="{ wide: view !== 'game' }">
      <AuthView v-if="!store.getters.isAuthenticated" />

      <template v-else>
        <div class="nav-bar">
          <div class="nav-user">
            {{ store.state.currentUser.username }}
            <span class="role-badge" :class="store.state.currentUser.role">{{ store.state.currentUser.role }}</span>
          </div>
          <div class="nav-actions">
            <button :class="{ active: view === 'game' }" @click="view = 'game'">
              <span class="material-symbols-outlined">cookie</span>
            </button>
            <button :class="{ active: view === 'leaderboard' }" @click="view = 'leaderboard'">
              <span class="material-symbols-outlined">leaderboard</span>
            </button>
            <button
              v-if="store.getters.isAdmin"
              :class="{ active: view === 'admin' }"
              @click="view = 'admin'"
            >
              <span class="material-symbols-outlined">admin_panel_settings</span>
            </button>
            <button @click="saveGame">
              <span class="material-symbols-outlined">save</span>
            </button>
            <button @click="logout">
              <span class="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>

        <GameView v-if="view === 'game'" />
        <Leaderboard v-else-if="view === 'leaderboard'" />
        <AdminPanel v-else-if="view === 'admin'" />
      </template>
    </div>

    <Transition name="toast">
      <div v-if="showSaveToast" class="save-toast">
        <span class="material-symbols-outlined">check_circle</span>
        Game saved!
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.theme-root {
  background: var(--color-bg);
  min-height: 100vh;
  transition: background-color 0.4s;
}

.content {
  max-width: 480px;
  margin: 0 auto;
  padding: 2rem 1rem;
  text-align: center;
}

.content.wide {
  max-width: 640px;
}

.nav-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  margin-bottom: 1.5rem;
}

.nav-user {
  flex: 1 1 auto;
}

.nav-actions {
  flex: 1 1 auto;
  justify-content: flex-end;
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: bold;
  color: var(--color-heading);
}

.role-badge {
  background: var(--color-badge);
  color: var(--color-button-text);
  font-size: 0.7rem;
  border-radius: 999px;
  padding: 0.1rem 0.5rem;
  text-transform: capitalize;
}

.role-badge.admin {
  background: #c0392b;
}

.nav-actions {
  display: flex;
  gap: 0.4rem;
}

.nav-actions button {
  background: var(--color-card);
  color: var(--color-card-text);
  border: none;
  border-radius: 999px;
  width: 2.4rem;
  height: 2.4rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.nav-actions button.active {
  background: var(--color-button);
  color: var(--color-button-text);
}

.save-toast {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-button);
  color: var(--color-button-text);
  border-radius: 999px;
  padding: 0.7rem 1.2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: bold;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
  z-index: 20;
}

.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 0.5rem);
}
</style>
