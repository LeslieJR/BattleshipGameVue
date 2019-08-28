<template>
  <div>
    <h1>Game Manager</h1>
    <p v-if="player != 'guest'">Welcome {{ player.email }}</p>
    <p v-else>You're not logged in (Guest view)</p>
    <v-table :data="results">
      <thead slot="head">
        <th>Game id</th>
        <th>Creation</th>
        <th>GamePlayer</th>
        <th>Opponent</th>
      </thead>
      <tbody slot="body">
        <tr v-for="result in results" :key="result.id">
          <td>{{ result.id }}</td>
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
        </tr>
      </tbody>
    </v-table>
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
    fetch("/api/games", { method: "GET" })
      .then(response => {
        return response.json();
      })
      .then(json => {
        this.results = json.games;
        this.player = json.player; //is there is a user logged in
        console.log(json);
      });
  },
  mounted() {
    this.getScores();
  },
  methods: {
    getScores() {
      fetch("/api/scores", { method: "GET" })
        .then(response => {
          return response.json();
        })
        .then(json => {
          this.scores = json;
          console.log(json);
        });
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
table {
  border: 2px solid black;
  border-collapse: collapse;
}
td,
th {
  border: 2px solid black;
  padding: 10px;
}
div {
  margin: 0 100px;
}
td:first-child {
  text-align: center;
}
</style>

