<template>
  <div>状态: {{ state.value }}</div>
  <div>上下文: {{ state.context }}</div>

  <div class="result-text" v-if="state.matches('ended')">
    <div v-if="state.matches('ended.win')">恭喜!您赢了😄</div>
    <div v-if="state.matches('ended.lose')">你没超过50分, 好可惜~😭</div>

    <button v-if="state.can('CONTINUE')" @click="send('CONTINUE')">继续游戏</button>
  </div>

  <div>
    <button v-if="state.can('TOGGLE') && state.matches('ready')" @click="send('TOGGLE')">
      开始游戏
    </button>

    <button v-if="state.matches('playing')" @click="send('GUESS')">竞猜</button>
  </div>
</template>

<script setup lang="ts">
import { useMachine } from '@xstate/vue'
import { gameMachine } from '@/machines/game'

const { send, state, service } = useMachine(gameMachine)
service.start()
</script>

<style scoped>
button {
  margin: 20px 0;
  padding: 6px;
}

.result-text {
  margin-top: 30px;
  color: blue;
  font-size: 24px;
}
</style>
