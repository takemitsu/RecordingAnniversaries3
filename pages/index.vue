<template>
  <section class="container">
    <div v-if="isLoaded">
      <div class="media" v-if="!user">
        <el-button @click="callSignIn">Sign in With Google</el-button>
      </div>
      <div v-if="user">
        <el-form ref="form" :model="form" label-width="60px" v-if="user">
          <el-form-item label="Title">
            <el-input placeholder="title" v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="Date">
            <el-date-picker
              v-model="form.anniv_at"
              type="date"
              placeholder="Pick a day">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button @click="doPost" type="primary" plain>Post</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="timeline" v-if="isLoaded">
      <div class="card-columns" >
        <div class="card"  :key="post['.key']" v-for="post in posts" v-if="post.user">
          <div class="card-body">
            <h5 class="card-title">{{post.title}}</h5>
            <p class="card-text">{{dispDate(post.anniv_at)}}</p>
            <a href="#" class="btn btn-primary">Update</a>
            <el-button size="mini" type="danger" plain @click="removePost(post)">X</el-button>
          </div>
        </div>
      </div>
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
import moment from 'moment'

export default {

  data() {
    return {
      isLoaded: false,
      form: {
        title: '',
        anniv_at: ''
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

      if(this.form.title === '') {
        this.$message.error('Title 入れてね');
        return
      }
      if(this.form.anniv_at === '') {
        this.$message.error('Date 入れてね');
        return
      }

      await this.$store.dispatch('ADD_POST', {
        email: this.user.email,
        title: this.form.title,
        anniv_at: moment(this.form.anniv_at).toISOString()
      })
      this.form.title = ''
      this.form.anniv_at = ''
    },
    async removePost(post) {
      await this.$store.dispatch('REMOVE_POST', {
        post: post
      })
    },
    ...mapActions(['callSignIn', 'callSignOut']),
    dispDate(anniv_at) {
      return moment(anniv_at).format('YYYY-MM-DD')
    }
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
