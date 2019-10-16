<template>
  <v-app>
    <v-navigation-drawer
      color="indigo darken-1"
      v-model="drawer"
      fixed
      right
      app
    >
      <v-list>
        <v-list-item>
          <router-link to="/"><v-icon>mdi-home </v-icon> Home</router-link>
        </v-list-item>

        <v-list-item>
          <router-link to="/registration"
            ><v-icon>mdi-account-arrow-left </v-icon>
            Login/Registration</router-link
          >
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-card color="indigo darken-1" flat height="50px" tile>
      <v-toolbar dense color="indigo darken-1">
        <v-app-bar-nav-icon
          color="white"
          @click="drawer = !drawer"
        ></v-app-bar-nav-icon>
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
  methods: {}
};
</script>
<style scoped>
.v-btn:not(.v-btn--round).v-size--small {
  padding: 0;
}
.v-application p {
  margin-bottom: 0;
}
.v-application a {
  text-decoration: none;
  color: white;
}
.v-toolbar__title {
  color: white;
}
</style>
