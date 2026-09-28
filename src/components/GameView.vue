<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import cookieIcon from '../assets/cookie.png'
import cookieGold from '../assets/cookie-gold.png'
import cookieEmerald from '../assets/cookie-emerald.png'
import cookieDiamond from '../assets/cookie-diamond.png'
import cookieGod from '../assets/cookie-god.png'
import gordonImg from '../assets/gordon-ramsay.png'
import { formatNumber } from '../utils/format'

const store = useStore()

const rankIcons = [cookieIcon, cookieGold, cookieEmerald, cookieDiamond, cookieGod]
const cookieImage = computed(() => rankIcons[store.getters.rankIndex])

onMounted(() => {
  rankIcons.forEach((src) => {
    const preload = new Image()
    preload.src = src
  })
})

const showRankUpModal = ref(false)
const newUpgrades = computed(() =>
  store.state.upgrades.filter((upgrade) => upgrade.requiredRank === store.getters.rankIndex + 1),
)

function confirmRankUp() {
  store.dispatch('rankUp')
  showRankUpModal.value = false
}
</script>

<template>
  <div class="game-view">
    <div class="rank-badge">Rank: {{ store.getters.currentRank.name }}</div>

    <h1>{{ formatNumber(store.getters.totalCookies) }} cookies</h1>
    <p class="cps">{{ formatNumber(store.getters.productionPerSecond) }} per second</p>

    <div class="cookie-area">
      <button class="cookie-button" @click="store.dispatch('clickCookie')">
        <img :src="cookieImage" alt="Cookie" />
      </button>

      <div v-if="store.getters.gordonOwned" class="gordon">
        <div v-if="store.getters.gordonMessageVisible" class="gordon-bubble">
          {{ store.getters.gordonMessage }}
        </div>
        <img :src="gordonImg" alt="Gordon Ramsay" />
      </div>
    </div>

    <div class="rank-panel">
      <template v-if="store.getters.nextRank">
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: store.getters.rankProgress * 100 + '%' }" />
        </div>
        <p class="rank-detail">
          {{ formatNumber(store.getters.totalEarned) }} / {{ formatNumber(store.getters.nextRank.requiredCookies) }}
          to {{ store.getters.nextRank.name }}
        </p>
        <button
          class="rank-up-button"
          :disabled="!store.getters.canRankUp"
          @click="showRankUpModal = true"
        >
          <span class="material-symbols-outlined">star_shine</span>
          Rank Up to {{ store.getters.nextRank.name }}
        </button>
      </template>
      <p v-else class="rank-detail">Max rank reached!</p>
    </div>

    <div v-if="showRankUpModal && store.getters.nextRank" class="modal-overlay" @click.self="showRankUpModal = false">
      <div class="modal-card">
        <h2>Rank Up to {{ store.getters.nextRank.name }}?</h2>
        <p class="modal-warning">Are you sure? You will lose all your upgrades and cookies.</p>
        <ul class="modal-benefits">
          <li>
            <span class="material-symbols-outlined">bolt</span>
            {{ store.getters.currentRank.clickMultiplier }}x → {{ store.getters.nextRank.clickMultiplier }}x multiplier
          </li>
          <li>
            <span class="material-symbols-outlined">sell</span>
            {{ Math.round((1 - store.getters.nextRank.costDiscount) * 100) }}% cheaper upgrades
          </li>
          <li v-if="newUpgrades.length">
            <span class="material-symbols-outlined">new_releases</span>
            New upgrade{{ newUpgrades.length > 1 ? 's' : '' }}: {{ newUpgrades.map((u) => u.name).join(', ') }}
          </li>
        </ul>
        <div class="modal-actions">
          <button class="modal-cancel" @click="showRankUpModal = false">Cancel</button>
          <button class="modal-confirm" @click="confirmRankUp">Rank Up</button>
        </div>
      </div>
    </div>

    <ul class="upgrades">
      <li v-for="upgrade in store.getters.visibleUpgrades" :key="upgrade.id" class="upgrade">
        <div class="upgrade-info">
          <span class="upgrade-name">{{ upgrade.name }}</span>
          <span class="upgrade-detail">owned: {{ upgrade.owned }} · +{{ upgrade.production }}/s</span>
        </div>
        <button
          class="buy-button"
          :disabled="
            upgrade.owned >= upgrade.maxOwned ||
            store.getters.totalCookies < store.getters.effectiveCost(upgrade)
          "
          @click="store.dispatch('buyUpgrade', upgrade.id)"
        >
          <template v-if="upgrade.owned >= upgrade.maxOwned">Owned</template>
          <template v-else>
            <span class="material-symbols-outlined">add</span>
            {{ formatNumber(store.getters.effectiveCost(upgrade)) }}
          </template>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.rank-badge {
  display: inline-block;
  background: var(--color-badge);
  color: var(--color-button-text);
  border-radius: 999px;
  padding: 0.3rem 0.9rem;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  transition: background-color 0.4s;
}

h1 {
  color: var(--color-heading);
  font-size: 2.5rem;
  font-weight: 700;
  transition: color 0.4s;
}

.cps {
  margin-bottom: 1.5rem;
  color: var(--color-heading);
  transition: color 0.4s;
}

.cookie-area {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 1rem;
  margin-top: 4rem;
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
  object-fit: contain;
  transition: transform 0.1s;
}

.cookie-button:active img {
  transform: scale(0.92);
}

.gordon {
  position: relative;
}

.gordon img {
  width: 90px;
}

.gordon-bubble {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  color: #4a2f1c;
  border: 2px solid var(--color-button);
  border-radius: 10px;
  padding: 0.4rem 0.6rem;
  font-size: 0.75rem;
  width: 140px;
  text-align: center;
  margin-bottom: 0.5rem;
}

.rank-panel {
  margin-top: 1.5rem;
}

.progress-track {
  background: var(--color-progress-track);
  border: 2px solid var(--color-progress-border);
  border-radius: 999px;
  height: 14px;
  overflow: hidden;
  transition: background-color 0.4s, border-color 0.4s;
}

.progress-fill {
  background: var(--color-progress-fill);
  height: 100%;
  transition: width 0.3s, background-color 0.4s;
}

.rank-detail {
  font-size: 0.85rem;
  color: var(--color-heading);
  margin: 0.4rem 0;
  transition: color 0.4s;
}

.rank-up-button {
  background: linear-gradient(135deg, var(--color-badge), var(--color-button));
  color: var(--color-button-text);
  border: none;
  border-radius: 999px;
  padding: 0.8rem 1.5rem;
  font-family: inherit;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  transition: background-color 0.4s, transform 0.15s, box-shadow 0.15s;
}

.rank-up-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
}

.rank-up-button:not(:disabled):active {
  transform: translateY(0);
}

.rank-up-button:disabled {
  background: var(--color-disabled);
  box-shadow: none;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 10;
}

.modal-card {
  background: var(--color-bg);
  color: var(--color-heading);
  border-radius: 16px;
  padding: 1.5rem;
  max-width: 340px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.35);
}

.modal-card h2 {
  margin: 0 0 0.5rem;
  color: var(--color-heading);
}

.modal-warning {
  font-size: 0.9rem;
  color: var(--color-card-text);
  background: var(--color-card);
  border-radius: 8px;
  padding: 0.6rem 0.75rem;
  margin: 0 0 1rem;
}

.modal-benefits {
  list-style: none;
  padding: 0;
  margin: 0 0 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: left;
}

.modal-benefits li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-heading);
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
}

.modal-cancel,
.modal-confirm {
  flex: 1;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  font-family: inherit;
  font-weight: bold;
  cursor: pointer;
}

.modal-cancel {
  background: var(--color-disabled);
  color: var(--color-card-text);
}

.modal-confirm {
  background: var(--color-button);
  color: var(--color-button-text);
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
  background: var(--color-card);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  transition: background-color 0.4s;
}

.upgrade-info {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.upgrade-name {
  font-weight: bold;
  color: var(--color-card-text);
  transition: color 0.4s;
}

.upgrade-detail {
  font-size: 0.85rem;
  color: var(--color-card-text);
  transition: color 0.4s;
}

.buy-button {
  background: var(--color-button);
  color: var(--color-button-text);
  border: none;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.15rem;
  transition: background-color 0.4s;
}

.buy-button .material-symbols-outlined {
  font-size: 1.1rem;
}

.buy-button:disabled {
  background: var(--color-disabled);
  cursor: not-allowed;
}
</style>
