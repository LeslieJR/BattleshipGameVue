<template>
  <div class="input">
    <h1>Login/Logout Page</h1>
    <v-card max-width="400">
      <v-card-text>
        <v-form>
          <v-text-field
            label="Login"
            name="login"
            type="text"
            prepend-icon="mdi-account"
            v-model="userName"
          ></v-text-field>
          <!-- v-model to update the data that is returned and after used to do the POST method during the fetch -->
          <v-text-field
            id="password"
            label="Password"
            name="password"
            type="password"
            prepend-icon="mdi-lock"
            v-model="password"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <div class="flex-grow-1"></div>
        <v-btn color="primary" @click="login">Login</v-btn>
      </v-card-actions>
    </v-card>
    <v-card max-width="400">
      <v-card-actions>
        <div class="flex-grow-1"><p>If you're already logged in:</p></div>
        <v-btn color="primary" @click="logout">Log out</v-btn>
      </v-card-actions>
    </v-card>
    <v-card max-width="400">
      <v-card-actions>
        <div class="flex-grow-1">
          <p>To create an account:</p>
          <router-link to="/registration">Registration</router-link>
        </div>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userName: "",
      password: ""
    };
  },
  methods: {
    login() {
      fetch("/api/login", {
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        body: this.getBody({
          userName: this.userName,
          password: this.password
        })
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
    },
    logout() {
      fetch("/api/logout", {
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
      })
        .then(function(data) {
          console.log("Request success: ", data);
        })
        .catch(function(error) {
          console.log("Request failure: ", error);
        });
    },

    getBody(json) {
      var body = [];
      for (var key in json) {
        var encKey = encodeURIComponent(key);
        var encVal = encodeURIComponent(json[key]);
        body.push(encKey + "=" + encVal);
      }
      return body.join("&");
    }
  }
};
</script>
<style scoped>
.input {
  padding-left: 30%;
}
</style>>





