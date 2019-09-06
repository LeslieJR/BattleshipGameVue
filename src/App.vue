<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" fixed right app>
      <v-list>
        <v-list-item>
          <router-link to="/registration">Login/Registration</router-link>
        </v-list-item>

        <v-list-item>
          <router-link to="/">Home</router-link>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-card color="grey lighten-4" flat height="50px" tile>
      <v-toolbar dense>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Battleship Game</v-toolbar-title>
      </v-toolbar>
    </v-card>
    <v-content>
      <transition mode="out-in">
        <router-view></router-view>
      </transition>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
  components: {},
  data: () => ({
    drawer: false,
    player: "guest"
  }),
  methods: {
    logout() {
      fetch("/api/logout", {
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
      })
        .then(data => {
          console.log("Request success: ", data);
          if (data.ok) {
            // if the request success and the data is ok, so the user is logged in, we want to change the view (from the login view to the home view (path: /s))

            this.$router.push("/");
          }
        })
        .catch(function(error) {
          console.log("Request failure: ", error);
        });
    }
  }
};
</script>
<style scoped>
.v-btn:not(.v-btn--round).v-size--small {
  padding: 0;
}
</style>
