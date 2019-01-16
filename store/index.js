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
        let authUrl = 'https://api.sherondale.me/joji/auth'
        let authBody = {
          username: authData.username,
          password: authData.password
        }
        if (!authData.isLogin) {
          authUrl = 'https://api.sherondale.me/joji/users'
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
            Cookie.set('jwt', result.idToken)
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
          token = req.headers.cookie
            .split(';')
            .find(c => c.trim().startsWith('jwt='))
            .split('=')[1]
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
          vuexContext.commit('setToken', token)
        }
      },
      logout(vuexContext) {
        vuexContext.commit('clearToken')
        Cookie.remove('jwt')
        Cookie.remove('tokenExpiration')
        if (process.client) {
          localStorage.removeItem('token')
          localStorage.removeItem('tokenExpiration')
        }
      }
    }
  })
}
export default createStore
