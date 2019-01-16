import Vuex from 'vuex'
import Cookie from 'js-cookie'

const createStore = () => {
  return new Vuex.Store({
    state: {
      token: null
    },
    mutations: {
      SET_TOKEN(state, token) {
        state.token = token
      },
      CLEAR_TOKEN(state) {
        state.token = null
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
            vuexContext.commit('SET_TOKEN', result.payload.token)
            localStorage.setItem('token', result.payload.token)
            localStorage.setItem(
              'tokenExpiration',
              Date.now() + Number.parseInt(result.payload.expiresIn)
            )
            Cookie.set('token', result.idToken)
            Cookie.set(
              'tokenExpiration',
              Date.now() + Number.parseInt(result.payload.expiresIn)
            )
          })
          .catch(error => alert(error))
      },
      initAuth(vuexContext, req) {
        let token, expirationTime
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
        } else if (process.client) {
          token = localStorage.getItem('token')
          expirationTime = localStorage.getItem('tokenExpiration')
        }
        if (!token || !expirationTime || Date.now() > +expirationTime) {
          vuexContext.dispatch('logout')
        } else {
          vuexContext.commit('SET_TOKEN', token)
        }
      },
      logout(vuexContext) {
        vuexContext.commit('CLEAR_TOKEN')
        Cookie.remove('token')
        Cookie.remove('tokenExpiration')
        if (process.client) {
          localStorage.removeItem('token')
          localStorage.removeItem('tokenExpiration')
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
