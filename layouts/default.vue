<template>
  <div>
    <b-navbar toggleable="md" type="dark" variant="info" style="margin-bottom: 16px;">

      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand href="/">{{title}}</b-navbar-brand>

      <b-collapse is-nav id="nav_collapse">

        <b-navbar-nav>
          <b-nav-item href="/about">About</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto" v-if="user">
          <b-nav-text>SignInAccount: {{user.displayName}}</b-nav-text>
          <b-nav-item @click="callSignOut" v-if="user">SignOut</b-nav-item>
        </b-navbar-nav>

      </b-collapse>
    </b-navbar>

    <nuxt/>
  </div>
</template>

<script>
  import config from '../nuxt.config'
  import auth from '~/plugins/auth'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data() {
      return {
        title: config.head.title
      }
    },
    async mounted () {
      if(process.browser) {
        let user
        if(!this.user) user = await auth()
        await Promise.all([
          this.user ? Promise.resolve():this.$store.dispatch('SET_CREDENTIAL', {user: user || null}),
        ])
      }
    },
    computed: {
      ...mapGetters(['user']),
    },
    methods: {
      ...mapActions(['callSignOut']),
    }
  }
</script>