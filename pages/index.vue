<template>
  <div class="dashboard">
    <button>Buy</button>
    <button @click="onSend">Send</button>
  </div>
</template>

<script>
export default {
  methods: {
    onSend() {
      console.log('send clicked')
    }
  }
}
</script>

<style>
</style>
