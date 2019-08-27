<template>
  <div class="input">
    <h1>Player Manager</h1>
    <v-flex xs12 sm6 md3 row>
      <v-text-field
        outlined
        id="email"
        type="text"
        label="Email"
        placeholder="User name"
        v-model="email"
      >
      </v-text-field>
      <v-btn id="add_player" v-on:click="addPlayer(email)">Add</v-btn>
    </v-flex>
    <br />
    <pre id="output"></pre>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      email: ""
    };
  },
  methods: {
    //handler for when user clicks add person
    // addPlayer(email) {
    //   if (email) {
    //     this.postPlayer(email);
    //   }
    // },
    // // code to post a new player using AJAX
    // // on success, reload and display the updated data from the server
    // postPlayer(userName) {
    //   axios
    //     .post({
    //       url: "/rest/players",
    //     })
    //     .then(function(response) {
    //       console.log(response);
    //     })
    //     .catch(function(error) {
    //       console.log(error);
    //     });
    // }
  }
};
</script>
<style  scoped>
.input {
  padding-left: 40px;
  padding-top: 20px;
}
</style>

