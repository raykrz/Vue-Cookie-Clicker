<script setup>
import { reactive } from 'vue'
import { useStore } from 'vuex'
import { formatNumber } from '../utils/format'

const store = useStore()

const edits = reactive({})

function getEdit(user) {
  if (!edits[user.username]) {
    edits[user.username] = {
      cookies: user.game?.cookies ?? 0,
      totalEarned: user.game?.totalEarned ?? 0,
    }
  }
  return edits[user.username]
}

function saveScore(username) {
  const edit = edits[username]
  store.dispatch('adminUpdateScore', {
    username,
    cookies: Number(edit.cookies) || 0,
    totalEarned: Number(edit.totalEarned) || 0,
  })
}

function resetPlayer(username) {
  delete edits[username]
  store.dispatch('adminResetPlayer', username)
}
</script>

<template>
  <div class="admin-panel">
    <h2>Admin Panel</h2>
    <p class="subtitle">Modify player scores or reset their game</p>

    <div class="user-card" v-for="user in store.getters.allUsers" :key="user.username">
      <div class="user-header">
        <span class="username">{{ user.username }}</span>
        <span class="role-badge" :class="user.role">{{ user.role }}</span>
      </div>

      <div class="fields">
        <label>
          Cookies
          <input type="number" v-model="getEdit(user).cookies" />
        </label>
        <label>
          Total earned
          <input type="number" v-model="getEdit(user).totalEarned" />
        </label>
      </div>

      <div class="current">Currently: {{ formatNumber(user.game?.cookies ?? 0) }} cookies · {{ formatNumber(user.game?.totalEarned ?? 0) }} earned</div>

      <div class="actions">
        <button class="save-button" @click="saveScore(user.username)">
          <span class="material-symbols-outlined">save</span>
          Save
        </button>
        <button class="reset-button" @click="resetPlayer(user.username)">
          <span class="material-symbols-outlined">restart_alt</span>
          Reset
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-panel {
  text-align: center;
}

h2 {
  color: var(--color-heading);
  margin-bottom: 0.2rem;
}

.subtitle {
  color: var(--color-card-text);
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
}

.user-card {
  background: var(--color-card);
  color: var(--color-card-text);
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  text-align: left;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.username {
  font-weight: bold;
  font-size: 1.1rem;
}

.role-badge {
  background: var(--color-button);
  color: var(--color-button-text);
  font-size: 0.7rem;
  border-radius: 999px;
  padding: 0.1rem 0.5rem;
  text-transform: capitalize;
}

.role-badge.admin {
  background: #c0392b;
}

.fields {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.fields label {
  flex: 1;
  display: flex;
  flex-direction: column;
  font-size: 0.8rem;
  gap: 0.25rem;
}

.fields input {
  font-family: inherit;
  padding: 0.5rem;
  border-radius: 6px;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  border: 2px solid var(--color-progress-border);
}

.current {
  font-size: 0.8rem;
  opacity: 0.8;
  margin-bottom: 0.75rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.save-button,
.reset-button {
  flex: 1;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-family: inherit;
  font-weight: bold;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
}

.save-button {
  background: var(--color-button);
  color: var(--color-button-text);
}

.reset-button {
  background: #c0392b;
  color: white;
}

.save-button .material-symbols-outlined,
.reset-button .material-symbols-outlined {
  font-size: 1.1rem;
}
</style>
