<template>
  <div>
    <p>Welcome, {{ username }}</p>
    <button @click="onLogout">Logout</button>
    <nuxt/>
  </div>
</template>

<script>
export default {
  middleware: ['check-auth', 'auth'],
  data() {
    return {
      username: this.$state.getters.getUsername
    }
  },
  methods: {
    onLogout() {
      this.$store.dispatch('logout').then(() => this.$router.push('/auth'))
    }
  }
}
</script>


<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}
</style>
