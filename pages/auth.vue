<template>
  <div class="auth">
    <form @submit.prevent="onSubmit">
      <label v-if="!isLogin" for="email">
        Email Address
        <input id="email" v-model="email" type="text">
      </label>
      <label for="username">
        Username
        <input id="username" v-model="username" type="text">
      </label>
      <label for="password">
        Password
        <input id="password" v-model="password" type="text">
      </label>
      <input :value="isLogin? 'Login' : 'Sign Up'" type="submit">
    </form>
    <button @click="isLogin = !isLogin">Switch to {{ isLogin? 'Sign Up': 'Login' }}</button>
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
          username: this.username,
          isLogin: this.isLogin
        })
        .then(() => this.$router.push('/'))
    }
  }
}
</script>

<style>
</style>
