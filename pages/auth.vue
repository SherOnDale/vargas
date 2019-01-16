<template>
  <div class="auth">
    <form @submit.prevent="onSubmit">
      <label v-if="!isLogin" for="email">
        Email Address
        <input id="email" type="text" v-model="email">
      </label>
      <label for="username">
        Username
        <input id="username" type="text" v-model="username">
      </label>
      <label for="password">
        Password
        <input id="password" type="text" v-model="password">
      </label>
      <input type="submit" :value="isLogin? 'Login' : 'Sign Up'">
      <button @click="isLogin = !isLogin">Switch to {{isLogin? 'Sign Up': 'Login'}}</button>
    </form>
  </div>
</template>

<script>
export default {
  layout: 'auth',
  data() {
    return {
      isLogin: true,
      email: '',
      password: '',
      username: ''
    }
  },
  methods: {
    onSubmit() {
      this.$store
        .dispatch('authenticateUser', {
          email: this.email,
          password: this.password,
          isLogin: this.isLogin
        })
        .then(() => this.$router.push('/'))
    }
  }
}
</script>

<style>
</style>
