<template>
  <form @submit.prevent="onSubmit">
    <label for="address">
      Address
      <input id="address" type="text">
    </label>
    <label for="amount">
      Amount
      <input id="amount" type="text">
    </label>
    <input type="submit" value="Send">
  </form>
</template>

<script>
export default {
  methods: {
    onSubmit() {
      alert('sending vargas')
    }
  }
}
</script>

<style>
</style>
