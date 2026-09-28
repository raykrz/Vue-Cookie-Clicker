<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const mode = ref('login')
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  const action = mode.value === 'login' ? 'login' : 'register'
  const result = await store.dispatch(action, { username: username.value, password: password.value })
  loading.value = false
  if (!result.success) {
    error.value = result.error
    return
  }
  username.value = ''
  password.value = ''
}

function toggleMode() {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  error.value = ''
}
</script>

<template>
  <div class="auth-view">
    <h1>Cookie Clicker</h1>
    <p class="auth-subtitle">{{ mode === 'login' ? 'Log in to save your progress' : 'Create an account to start baking' }}</p>

    <form class="auth-form" @submit.prevent="submit">
      <input v-model="username" type="text" placeholder="Username" autocomplete="username" required />
      <input v-model="password" type="password" placeholder="Password" autocomplete="current-password" required />
      <p v-if="error" class="auth-error">{{ error }}</p>
      <button type="submit" class="auth-submit" :disabled="loading">
        {{ mode === 'login' ? 'Log In' : 'Register' }}
      </button>
    </form>

    <button class="auth-toggle" @click="toggleMode">
      {{ mode === 'login' ? "Don't have an account? Register" : 'Already have an account? Log in' }}
    </button>

    <p class="auth-hint">Admin testing account: admin / admin</p>
  </div>
</template>

<style scoped>
.auth-view {
  text-align: center;
}

h1 {
  color: var(--color-heading);
  font-size: 2.2rem;
  font-weight: 700;
}

.auth-subtitle {
  color: var(--color-heading);
  margin-bottom: 1.5rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.auth-form input {
  font-family: inherit;
  font-size: 1rem;
  padding: 0.7rem 0.9rem;
  border-radius: 8px;
  border: 2px solid var(--color-progress-border);
  background: var(--color-bg);
  color: var(--color-heading);
}

.auth-error {
  color: #c0392b;
  background: #fdecea;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  margin: 0;
}

.auth-submit {
  background: linear-gradient(135deg, var(--color-badge), var(--color-button));
  color: var(--color-button-text);
  border: none;
  border-radius: 999px;
  padding: 0.8rem 1.5rem;
  font-family: inherit;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
}

.auth-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-toggle {
  background: none;
  border: none;
  color: var(--color-heading);
  text-decoration: underline;
  cursor: pointer;
  margin-top: 1rem;
  font-family: inherit;
  font-size: 0.9rem;
}

.auth-hint {
  margin-top: 1.5rem;
  font-size: 0.8rem;
  color: var(--color-card-text);
}
</style>
