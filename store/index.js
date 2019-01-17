import Vuex from 'vuex'
import Cookie from 'js-cookie'

const createStore = () => {
  return new Vuex.Store({
    state: {
      token: null,
      username: ''
    },
    mutations: {
      SET_STATE(state, payload) {
        state.token = payload.token
        state.username = payload.username
      },
      CLEAR_STATE(state) {
        state.token = null
        state.username = ''
      }
    },
    actions: {
      authenticateUser(vuexContext, authData) {
        let authUrl = '/auth'
        let authBody = {
          username: authData.username,
          password: authData.password
        }
        if (!authData.isLogin) {
          authUrl = '/users'
          authBody.email = authData.email
        }
        return this.$axios
          .$post(authUrl, authBody)
          .then(result => {
            vuexContext.commit('SET_STATE', result.payload)
            localStorage.setItem('token', result.payload.token)
            localStorage.setItem(
              'tokenExpiration',
              Date.now() + Number.parseInt(result.payload.expiresIn)
            )
            localStorage.setItem('username', result.payload.username)
            Cookie.set('token', result.payload.token)
            Cookie.set(
              'tokenExpiration',
              Date.now() + Number.parseInt(result.payload.expiresIn)
            )
            Cookie.set('username', result.payload.username)
          })
          .catch(error => alert(error))
      },
      initAuth(vuexContext, req) {
        let token, expirationTime, username
        if (req) {
          if (!req.headers.cookie) return
          if (req.headers.cookie.includes('token='))
            token = req.headers.cookie
              .split(';')
              .find(c => c.trim().startsWith('token='))
              .split('=')[1]
          if (req.headers.cookie.includes('tokenExpiration='))
            expirationTime = req.headers.cookie
              .split(';')
              .find(c => c.trim().startsWith('tokenExpiration='))
              .split('=')[1]
          if (req.headers.cookie.includes('username'))
            username = req.headers.cookie
              .split(';')
              .find(c => c.trim().startsWith('username='))
              .split('=')[1]
        } else if (process.client) {
          token = localStorage.getItem('token')
          expirationTime = localStorage.getItem('tokenExpiration')
          username = localStorage.getItem('cookie')
        }
        if (
          !token ||
          !expirationTime ||
          Date.now() > +expirationTime ||
          !username
        ) {
          vuexContext.dispatch('logout')
        } else {
          vuexContext.commit('SET_STATE', { token, username })
        }
      },
      logout(vuexContext) {
        vuexContext.commit('CLEAR_STATE')
        Cookie.remove('token')
        Cookie.remove('tokenExpiration')
        Cookie.remove('username')
        if (process.client) {
          localStorage.removeItem('token')
          localStorage.removeItem('tokenExpiration')
          localStorage.removeItem('username')
        }
      }
    },
    getters: {
      isAuthenticated(state) {
        return state.token !== null
      }
    }
  })
}
export default createStore
