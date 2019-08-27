<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" fixed right app>
      <v-list>
        <v-list-item>
          <router-link to="/game_view/:gp">Game</router-link>
        </v-list-item>
        <v-list-item>
          <router-link to="/manager">Manager</router-link>
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
    drawer: false
  })
};
</script>
