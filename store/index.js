import Vue from 'vue'
import Vuex from 'vuex'
import firebase from '~/plugins/firebase'
import {firebaseMutations, firebaseAction } from 'vuexfire'
const db = firebase.database()
const usersRef = db.ref('/users')
const postsRef = db.ref('/posts')
const provider = new firebase.auth.GoogleAuthProvider()

Vue.use(Vuex)

const createStore = () => {
  return new Vuex.Store({
    state: {
      user:null,
      post:null,
      users:[],
      posts:[]
    },
    getters: {
      posts: state => {
        return state.posts.filter((element, index, array) => {
          return state.user.email === element.from
        }).map((post) => {
          post.user = state.users.find((user) => user.email === post.from)
          return post
        }).reverse()
      },
      post: state => {
        const post = state.post
        if(!post) return null
        post.user = state.users.find((user) => user.email === post.from)
        return post
      },
      users:state => state.users,
      user: state => state.user
    },
    mutations: {
      setCredential(state, {user}) {
        state.user = user
      },
      savePost(state,{post}) {
        state.post = post
      },
      ...firebaseMutations
    },
    actions: {
      async SET_CREDENTIAL ({commit}, { user }) {
        if (!user) return
        await usersRef.child(user.email.replace('@', '_at_').replace(/\./g, '_dot_')).set({
          name: user.displayName,
          email: user.email,
          icon: user.photoURL
        })
        commit('setCredential', { user })
      },
      /*
      async INIT_SINGLE ({commit}, { id }) {
        const snapshot = await postsRef.child(id).once('value')
        commit('savePost', { post: snapshot.val() })
      },
      */
      INIT_USERS: firebaseAction(({ bindFirebaseRef }) => {
        bindFirebaseRef('users', usersRef)
      }),
      INIT_POSTS: firebaseAction(({ bindFirebaseRef }) => {
        bindFirebaseRef('posts', postsRef)
      }),
      ADD_POST: firebaseAction((ctx, { email, title, anniv_at }) => {
        console.log(anniv_at)
        postsRef.push({
          from: email,
          title:  title,
          anniv_at: anniv_at
        })
      }),
      REMOVE_POST: firebaseAction((ctx, {post}) => {
        postsRef.child(post['.key']).remove()
      }),
      callSignIn() {
        firebase.auth().signInWithRedirect(provider)
      },
      callSignOut() {
        firebase.auth().signOut()
        window.location.reload()
      }
    }
  })
}
export default createStore
