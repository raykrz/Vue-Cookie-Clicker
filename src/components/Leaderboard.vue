<script setup>
import { useStore } from 'vuex'
import { formatNumber } from '../utils/format'

const store = useStore()
</script>

<template>
  <div class="leaderboard">
    <h2>Leaderboard</h2>
    <p class="subtitle">Ranked by total cookies collected</p>

    <ul class="board">
      <li
        v-for="(entry, index) in store.getters.leaderboard"
        :key="entry.username"
        class="row"
        :class="{ self: entry.username === store.state.currentUser?.username }"
      >
        <span class="position">#{{ index + 1 }}</span>
        <span class="name">
          {{ entry.username }}
          <span v-if="entry.role === 'admin'" class="role-badge">Admin</span>
        </span>
        <span class="rank-name">{{ entry.rankName }}</span>
        <span class="score">{{ formatNumber(entry.totalEarned) }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.leaderboard {
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

.board {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.row {
  display: grid;
  grid-template-columns: 2.5rem 1fr auto auto;
  align-items: center;
  gap: 0.75rem;
  background: var(--color-card);
  color: var(--color-card-text);
  border-radius: 8px;
  padding: 0.6rem 1rem;
  text-align: left;
}

.row.self {
  outline: 3px solid var(--color-button);
}

.position {
  font-weight: bold;
}

.name {
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.role-badge {
  background: var(--color-button);
  color: var(--color-button-text);
  font-size: 0.7rem;
  font-weight: normal;
  border-radius: 999px;
  padding: 0.1rem 0.5rem;
}

.rank-name {
  font-size: 0.85rem;
  opacity: 0.85;
}

.score {
  font-weight: bold;
}
</style>
