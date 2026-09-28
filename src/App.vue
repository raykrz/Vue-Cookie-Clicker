<script setup>
import { onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

onMounted(() => {
  store.dispatch('startAutoProduction')
})
</script>

<template>
  <div>
    <h1>{{ store.getters.totalCookies }} cookies</h1>
    <p>{{ store.getters.productionPerSecond }} per second</p>
    <button @click="store.dispatch('clickCookie')">Click me</button>

    <ul>
      <li v-for="upgrade in store.getters.upgrades" :key="upgrade.id">
        {{ upgrade.name }} (owned: {{ upgrade.owned }}) - cost: {{ upgrade.cost }} cookies
        <button
          :disabled="store.getters.totalCookies < upgrade.cost"
          @click="store.dispatch('buyUpgrade', upgrade.id)"
        >
          Buy
        </button>
      </li>
    </ul>
  </div>
</template>
