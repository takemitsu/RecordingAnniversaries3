<template>
  <section class="container">

    <div class="row" v-if="isLoaded">
      <div class="col-sm-3">
        <div class="media" v-if="user">
          <figure class="media-left">
            <p class="image is-64x64">
              <img :src="user.photoURL">
            </p>
          </figure>
          <div class="media-content">
            <div class="content">
              <p>
                <strong>{{user.displayName}}</strong>
              </p>
            </div>
          </div>
        </div>
        <div v-if="user">
          <el-button @click="callSignOut">SignOut</el-button>
        </div>
        <div class="media" v-else>
          <el-button @click="callSignIn">Sign in With Google</el-button>
        </div>
      </div>
      <div class="col-sm-9">
        <el-form ref="form" :model="form" label-width="120px" v-if="user">
          <el-form-item label="title">
            <el-input placeholder="title" v-model="form.body"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="doPost">Post</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="timeline" v-if="isLoaded">
      <ul class="posts">
        <li class="media" :post="post" :key="post['.key']" v-for="post in posts" v-if="post.user">
          <figure class="media-left">
            <p class="image is-64x64">
              <img :src="post.user.icon">
            </p>
          </figure>
          <div class="media-content">
            <div class="content">
              <p>
                <strong>{{post.user.name}}</strong>
                <br>
                <span>{{post.body}}</span>
              </p>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <div class="loading-wrapper" v-else>
      <div class="loading">
        Loading...
      </div>
    </div>
  </section>
</template>

<script>
import auth from '~/plugins/auth'
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      isLoaded: false,
      form: {
        body: ''
      }
    }
  },
  async mounted () {
    if(process.browser) {
      let user
      if(!this.user) user = await auth()
      await Promise.all([
        this.user ? Promise.resolve():this.$store.dispatch('SET_CREDENTIAL', {user: user || null}),
        this.posts.length ? Promise.resolve() : this.$store.dispatch('INIT_POSTS'),
        this.users.length ? Promise.resolve() : this.$store.dispatch('INIT_USERS')
      ])
      this.isLoaded = true
    }
  },
  computed: {
    ...mapGetters(['user', 'users', 'posts']),
  },
  methods: {
    async doPost () {
      await this.$store.dispatch('ADD_POST', {
        email: this.user.email,
        body: this.form.body
      })
      this.form.body = ''
    },
    ...mapActions(['callSignIn', 'callSignOut'])
  }
}
</script>

<style>
  p.is-64x64 img {
      max-height: 64px;
      max-width: 64px;
  }
  ul.posts {
    padding-left: 0;
  }
</style>
