<template>
  <div v-if="this.info" id="container">
    <h1>Game View for GamePlayer{{ gp }}</h1>
    <div v-for="gameplayer in this.info.gamePlayers" :key="gameplayer.id">
      <p v-if="gameplayer.player.id == gp">
        Email: {{ gameplayer.player.email }}
      </p>
      <p v-else>Opponent Email: {{ gameplayer.player.email }}</p>
    </div>
    <h2>Ships</h2>
    <table id="shipInfo">
      <thead>
        <th>Ship ID</th>
        <th>Type</th>
        <th>Locations</th>
      </thead>
      <tbody>
        <tr v-for="ship in this.info.ships" :key="ship.id">
          <td>{{ ship.id }}</td>
          <td>{{ ship.type }}</td>
          <td :id="ship.id">{{ ship.locations }}</td>
        </tr>
      </tbody>
    </table>

    <div class="d-flex" id="tables">
      <div
        style="
    padding-right: 70px;
"
      >
        <h2>Ship Grid</h2>
        <table id="shipGrid">
          <thead>
            <th v-for="column in columns" :key="column">{{ column }}</th>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row">
              <td
                v-for="(column, i) in columns"
                :key="column + i"
                :ref="row + i"
                :id="row + i"
              >
                <span v-if="i == 0">{{ row }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <h2>Salvoes fired</h2>
        <table id="salvoGrid">
          <thead>
            <th v-for="column in columns" :key="column">{{ column }}</th>
          </thead>
          <tbody>
            <tr v-for="row in rows" :key="row">
              <td
                v-for="(column, i) in columns"
                :key="column + i"
                :ref="row + i"
                :id="row + i"
              >
                <span v-if="i == 0">{{ row }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  props: ["gp"],
  data() {
    return {
      info: null,
      columns: ["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
    };
  },

  mounted() {
    this.gettingGP();
  },

  methods: {
    gettingGP() {
      axios.get(`/api/game_view/${this.gp}`).then(response => {
        this.info = response.data;
        setTimeout(() => {
          this.colorCell();
        }, 0);
        setTimeout(() => {
          this.salvoesCell();
        }, 1);
        setTimeout(() => {
          this.hitsCells();
        }, 2);
      });
    },
    colorCell() {
      this.info.ships.forEach(ship => {
        ship.locations.forEach(location => {
          // var loc = document.getElementById(location); or
          var loc = this.$refs[location][0];
          loc.setAttribute("class", ship.type);
        });
      });
    },

    salvoesCell() {
      this.info.salvoes.forEach(salvo => {
        Object.keys(salvo).forEach(key => {
          var id = salvo[key];
          var turns = Object.keys(id);
          id[turns].forEach(position => {
            var loc = this.$refs[position][1];
            loc.setAttribute("class", turns[0]);
            loc.textContent = turns[0];
          });
        });
      });
    },

    hitsCells() {
      this.info.oppSalvoes.forEach(salvo => {
        Object.keys(salvo).forEach(key => {
          var id = salvo[key];
          var turns = Object.keys(id);
          id[turns].forEach(position => {
            var loc = this.$refs[position][0];
            loc.textContent = turns[0];
            if (
              loc.classList.contains("Patrol") ||
              loc.classList.contains("Submarine") ||
              loc.classList.contains("Destroyer")
            ) {
              loc.classList.add("hit");
            }
          });
        });
      });
    }
  }
};
</script>
<style scoped>
#shipGrid,
#salvoGrid {
  border-collapse: collapse;
}

#shipGrid td,
#salvoGrid td {
  border: 1px solid black;
  width: 30px;
  height: 30px;
}

#shipGrid td:first-child,
#salvoGrid td:first-child {
  border: none;
  font-weight: 600;
}
#shipInfo {
  border-collapse: collapse;
  margin-bottom: 30px;
  margin-top: 30px;
}

#shipInfo td,
#shipInfo th {
  border: 1px solid black;
}

#shipInfo td {
  padding: 5px;
}

span {
  font-weight: 600;
}

#container {
  padding-left: 10%;
}
.Patrol {
  background-color: blue;
}
.Submarine {
  background-color: green;
}
.Destroyer {
  background-color: red;
}

.\31 {
  background-color: rgb(255, 210, 127);
  text-align: center;
}

.\32 {
  background-color: rgb(43, 226, 98);
  text-align: center;
}

.hit {
  background-image: linear-gradient(
    to bottom right,
    transparent calc(50% - 2px),
    red,
    transparent calc(50% + 2px)
  );
  text-align: center;
}
</style>

