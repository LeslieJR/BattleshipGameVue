<template>
  <div class="container">
    <v-app>
      <v-card>
        <v-card-title class="text-center justify-center py-6">
          <h1>Login/Registration Page</h1>
        </v-card-title>

        <v-tabs v-model="tab" background-color="transparent" grow>
          <v-tab v-for="item in items" :key="item">
            {{ item }}
          </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
          <v-tab-item v-for="(item, k) in items" :key="item">
            <v-card flat>
              <v-card-text v-if="k == 0">
                <!-- to differentiate login and registration -->
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
                <div class="flex-grow-1"></div>
                <v-btn color="primary" @click="login">Log In</v-btn>
              </v-card-text>
              <v-card-text v-else>
                <v-form>
                  <v-text-field
                    label="username"
                    name="userName"
                    type="text"
                    prepend-icon="mdi-account"
                    v-model="userName"
                  ></v-text-field>
                  <!-- v-model to update the data that is returned and after used to do the POST method during the fetch -->
                  <v-text-field
                    id="password"
                    label="password"
                    name="password"
                    type="password"
                    prepend-icon="mdi-lock"
                    v-model="password"
                  ></v-text-field>
                </v-form>
                <v-btn color="primary" @click="register">Sign Up</v-btn>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </v-app>
  </div>
</template>
<script>
export default {
  data() {
    return {
      userName: "",
      password: "",
      tab: null,
      items: ["Login", "Registration"]
    };
  },
  methods: {
    register() {
      fetch("/api/players", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: this.getBody({
          userName: this.userName,
          password: this.password
        })
      })
        .then(response => {
          if (response.ok) {
            this.login();
          }
          return response.json();
        })
        .then(json => {
          console.log("Response:", json);
          if (json) {
            this.$router.push("/");
          }
        })
        .catch(function(error) {
          console.log("Request failed", error);
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
    },
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
    }
  }
};
</script>
<style scoped>
.container {
  padding-left: 25%;
}
</style>