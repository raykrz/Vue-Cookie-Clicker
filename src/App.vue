<script setup>
import { onMounted } from 'vue'
import { useStore } from 'vuex'
import cookieIcon from './assets/cookie.png'

const store = useStore()

onMounted(() => {
  store.dispatch('startAutoProduction')
})
</script>

<template>
  <div>
    <h1>{{ store.getters.totalCookies }} cookies</h1>
    <p class="cps">{{ store.getters.productionPerSecond }} per second</p>

    <button class="cookie-button" @click="store.dispatch('clickCookie')">
      <img :src="cookieIcon" alt="Cookie" />
    </button>

    <ul class="upgrades">
      <li v-for="upgrade in store.getters.upgrades" :key="upgrade.id" class="upgrade">
        <div class="upgrade-info">
          <span class="upgrade-name">{{ upgrade.name }}</span>
          <span class="upgrade-detail">owned: {{ upgrade.owned }} · +{{ upgrade.production }}/s</span>
        </div>
        <button
          class="buy-button"
          :disabled="store.getters.totalCookies < upgrade.cost"
          @click="store.dispatch('buyUpgrade', upgrade.id)"
        >
          Buy · {{ upgrade.cost }}
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
h1 {
  color: #cf7346;
  font-size: 2.5rem;
  font-weight: 700;
}

.cps {
  margin-bottom: 1.5rem;
  color: #cf7346;
}

.cookie-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.cookie-button img {
  width: 160px;
  height: 160px;
  transition: transform 0.1s;
}

.cookie-button:active img {
  transform: scale(0.92);
}

.upgrades {
  list-style: none;
  padding: 0;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.upgrade {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffac10;
  border-radius: 8px;
  padding: 0.75rem 1rem;
}

.upgrade-info {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.upgrade-name {
  font-weight: bold;
  color: #4a2f1c;
}

.upgrade-detail {
  font-size: 0.85rem;
  color: #4a2f1c;
}

.buy-button {
  background: #cf7346;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
}

.buy-button:disabled {
  background: #d9b79b;
  cursor: not-allowed;
}
</style>
