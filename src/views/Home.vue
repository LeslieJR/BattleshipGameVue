<template>
  <div>
    <h1>Game Manager</h1>
    <div v-if="player != 'guest'" class="d-flex">
      <p>
        Welcome <b>{{ player.email }}!</b>
      </p>
      <v-btn class="logout" @click="logout">Log Out</v-btn>
    </div>

    <div v-else>
      <p>You're not logged in (Guest view)</p>
      <p>
        Go to
        <router-link to="/registration">Login/Registration</router-link> to
        Login or Create an account
      </p>
    </div>
    <v-table :data="results">
      <thead slot="head">
        <th>Game id</th>
        <th>Creation</th>
        <th>GamePlayer</th>
        <th>Opponent</th>
        <th v-if="player != 'guest'"></th>
      </thead>
      <tbody slot="body">
        <tr v-for="result in results" :key="result.id">
          <td>
            {{ result.id }}
          </td>
          <td>
            {{ result.creation | moment("dddd, MMMM Do YYYY, h:mm:ss a") }}
          </td>
          <td>
            {{ result.gamePlayers[0].player.email }}
          </td>
          <td v-if="result.gamePlayers.length > 1">
            {{ result.gamePlayers[1].player.email }}
          </td>
          <td v-else>Waiting for opponent</td>
          <td v-if="player != 'guest'">
            <!-- checkIfPlayerIn(result) when result is equivalent of a game so result.gamePlayer.forEach goes for each gp of the game -->
            <v-btn
              v-if="checkIfPlayerIn(result)"
              :to="'/game_view/' + checkIfPlayerIn(result)"
              >ENTER</v-btn
            >
            <v-btn
              v-else-if="result.gamePlayers.length == 1"
              @click="joinGame(result)"
              >JOIN</v-btn
            >
          </td>
        </tr>
      </tbody>
    </v-table>
    <v-btn v-if="player != 'guest'" class="create" @click="createGame"
      >CREATE A GAME</v-btn
    >

    <h1>Leaderboard</h1>
    <table>
      <thead>
        <th>Name</th>
        <th>Total</th>
        <th>Won</th>
        <th>Lost</th>
        <th>Tie</th>
      </thead>
      <tbody>
        <tr v-for="(score, index) in sortedScores" :key="index">
          <td>{{ score.player }}</td>
          <td>{{ score.total }}</td>
          <td>{{ score.wins }}</td>
          <td>{{ score.loses }}</td>
          <td>{{ score.ties }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// import { METHODS } from "http";
export default {
  components: {},
  data() {
    return {
      results: [],
      scores: [],
      player: "guest" //if there is not a user logged in --> guest
    };
  },
  created() {
    this.fetchGames();
  },
  mounted() {
    this.getScores();
  },
  methods: {
    fetchGames() {
      fetch("/api/games", { method: "GET" })
        .then(response => {
          return response.json();
        })
        .then(json => {
          this.results = json.games;
          this.player = json.player; //is there is a user logged in
        });
    },
    getScores() {
      fetch("/api/scores", { method: "GET" })
        .then(response => {
          return response.json();
        })
        .then(json => {
          this.scores = json;
          console.log(json);
        });
    },
    createGame() {
      fetch("/api/games", {
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
      })
        .then(data => {
          if (data.ok) {
            this.fetchGames();
          }
        })
        .catch(function(error) {
          console.log("Request failure: ", error);
        });
    },
    joinGame(result) {
      fetch(`/api/game/${result.id}/players`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
      })
        .then(data => {
          console.log("Request success: ", data);
          if (data.ok) {
            console.log("created");
            return data.json();
          }
        })
        .then(json => {
          var gpId = json.gpId;
          this.$router.push(`/game_view/${gpId}`);
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
        .then(data => {
          console.log("Request success: ", data);
          if (data.ok) {
            // if the request success and the data is ok, so the user is logged in, we want to change the view (from the login view to the home view (path: /s))
            this.$router.push("/");
            this.fetchGames();
          }
        })
        .catch(function(error) {
          console.log("Request failure: ", error);
        });
    },
    // checkIfPlayerIn method => to compare if the id of the player(user) that is logged in is equal to one of the id of the gameplayers in each of the games
    // when the ids are equals the var found equals the id and is returned
    checkIfPlayerIn(game) {
      let found = false;
      game.gamePlayers.forEach(gp => {
        if (gp.player.id == this.player.id) found = gp.id;
      });
      return found;
    }
  },
  computed: {
    sortedScores() {
      return this.scores.sort(function(a, b) {
        var result = b.total - a.total;
        if (result === 0) {
          result = a.wins + a.loses + a.ties - (b.wins + b.loses + b.ties); //to compare by the games played
        }
        return result;
      });
    }
  }
};
</script>
<style scoped>
/* .container {
  background-image: url("../img/ships.jpg");
  background-size: cover;
} */
div:first-child {
  padding: 5%;
  background-color: #83a6bb;
}
a {
  color: black;
  font-weight: 600;
}

table {
  border: 2px solid black;
  border-collapse: collapse;
  background-color: white;
}
td,
th {
  border: 2px solid black;
  padding: 10px;
}
/* div.container {
  padding: 0 10%;
} */

td:first-child {
  text-align: center;
}
.logout {
  margin-left: 570px;
}
.create {
  margin-top: 2%;
  margin-bottom: 2%;
}

/* .d-flex {
  padding-right: 10%;
} */
</style>

