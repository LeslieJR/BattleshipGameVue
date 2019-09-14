<template>
  <div v-if="this.info" id="container">
    <h1>Game View for GamePlayer{{ gp }}</h1>
    <div v-for="gameplayer in this.info.gamePlayers" :key="gameplayer.id">
      <p v-if="gameplayer.id == gp">Email: {{ gameplayer.player.email }}</p>
      <p v-else>Opponent Email: {{ gameplayer.player.email }}</p>
    </div>
    <h2>Ships</h2>
    <div class="d-flex position">
      <h3>Position:</h3>
      <div>
        <input type="radio" id="one" value="Horizontal" v-model="position" />
        <label for="one">Horizontal</label>
      </div>

      <div>
        <input type="radio" id="two" value="Vertical" v-model="position" />
        <label for="two">Vertical</label>
      </div>
    </div>

    <div class="d-flex flex-row">
      <p>Destroyer:</p>
      <div
        id="Destroyer"
        draggable="true"
        @dragleave="check($event)"
        @dragstart="drag($event), setShip({ type: 'Destroyer', shipLength: 3 })"
      ></div>
    </div>

    <div class="d-flex flex-row">
      <p>Carrier:</p>
      <div
        id="Carrier"
        draggable="true"
        @dragstart="drag($event), setShip({ type: 'Carrier', shipLength: 5 })"
      ></div>
    </div>

    <div class="d-flex flex-row">
      <p>Battleship:</p>
      <div
        id="Battleship"
        draggable="true"
        @dragstart="
          drag($event), setShip({ type: 'Battleship', shipLength: 4 })
        "
      ></div>
    </div>

    <div class="d-flex flex-row">
      <p>Submarine:</p>
      <div
        id="Submarine"
        draggable="true"
        @dragstart="drag($event), setShip({ type: 'Submarine', shipLength: 3 })"
      ></div>
    </div>

    <div class="d-flex flex-row">
      <p>Patrol Boat:</p>
      <div
        id="Patrol"
        draggable="true"
        @dragstart="drag($event), setShip({ type: 'Patrol', shipLength: 2 })"
      ></div>
    </div>

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
                @drop="drop($event)"
                @dragenter="check($event)"
                @dragover="dropallow($event)"
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

    <!-- <v-btn @click="postShips">Ships</v-btn> -->
  </div>
</template>
<script>
import axios from "axios";

export default {
  props: ["gp"],

  data() {
    return {
      position: "",
      info: null,
      columns: ["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
      selectedShip: {},
      tdid: "",
      allowDrop: true
    };
  },

  mounted() {
    this.gettingGP();
  },

  methods: {
    // *******************************************************************
    dropallow(ev) {
      if (this.allowDrop) {
        ev.preventDefault();
      }
    },
    // the check(ev) method checks if a cell (of the array cells) exists and if it does checks if it has attribute class
    check(ev) {
      this.tdid = ev.target.id;
      console.log("tdid", this.tdid);
      console.log(this.position);
      var rowid = this.tdid.charAt(0);
      var number = parseInt(this.tdid.slice(1));
      console.log("rowid", rowid, "number", number);
      var cells = [];
      if (this.position == "Vertical") {
        // numRow is the number for the letter
        var numbRow = rowid.charCodeAt(0);
        for (var j = 0; j < this.selectedShip.shipLength; j++) {
          cells.push(String.fromCharCode(numbRow + j) + number);
        }
        console.log(cells);
      } else {
        for (var i = 0; i < this.selectedShip.shipLength; i++) {
          cells.push(rowid + (number + i));
        }
        console.log(cells);
      }

      console.log(cells);

      // Array.prototype.some() => The some() method tests whether at least one element in the array passes the test implemented by the provided function. It returns a Boolean value.
      var allow = !cells.some(cell => {
        var celda = document.getElementById(cell);

        var noCell = celda == null;
        // in the following line if noCell is true then hasClass is true too that way the error of hasAttribute of'null' is avoided
        // ternary:
        var hasClass = noCell ? true : celda.hasAttribute("class");

        return hasClass;
      });

      this.allowDrop = allow;
      console.log(allow);
    },

    drag(ev) {
      ev.dataTransfer.setData("text", ev.target.id);
    },

    drop(ev) {
      ev.preventDefault();
      document.getElementById(this.selectedShip.type).style.width = "30px";
      this.clear(this.selectedShip.type);
      var data = ev.dataTransfer.getData("text");
      console.log("data:", data);
      ev.target.appendChild(document.getElementById(data));
      this.colorCells();
    },
    setShip(ship) {
      this.selectedShip = ship;
    },

    clear(classe) {
      console.log("Clase", classe);
      //***different ways to remove the class that colors de cells

      // [...document.querySelectorAll(`td.${classe}`)].forEach(c =>
      //   c.classList.remove(classe)
      // );

      // [...document.getElementsByClassName(classe)].forEach(c =>
      //   c.classList.remove(classe)
      // );

      //document.getElementByClassName returns an HTMLcollection so it needs to be converted in an array first **!!
      let celdas = [...document.getElementsByClassName(classe)];
      // console.log(celdas.length);
      for (let i = 0; i < celdas.length; i++) {
        const element = celdas[i];
        element.classList.remove(classe);
      }
    },
    colorCells() {
      console.log(this.tdid);
      var rowid = this.tdid.charAt(0);
      var number = parseInt(this.tdid.slice(1));
      console.log(rowid, number);

      if (this.position == "Vertical") {
        //   // numRow is the number for the letter
        var numbRow = rowid.charCodeAt(0);
        //   console.log(numbRow);
        //   console.log(this.position);

        for (var j = 0; j < this.selectedShip.shipLength; j++) {
          console.log(numbRow + j);
          document
            .getElementById(String.fromCharCode(numbRow + j) + number)
            .setAttribute("class", this.selectedShip.type);
        }
      } else {
        for (var i = 0; i < this.selectedShip.shipLength; i++) {
          document
            .getElementById(rowid + (number + i))
            .setAttribute("class", this.selectedShip.type);
        }
      }
      // console.log("something happen?");
    },
    gettingGP() {
      axios.get(`/api/game_view/${this.gp}`).then(response => {
        this.info = response.data;
        // setTimeout(() => {
        //   this.colorCell();
        // }, 0);
        // setTimeout(() => {
        //   this.salvoesCell();
        // }, 1);
        // setTimeout(() => {
        //   this.hitsCells();
        // }, 2);
      });
    }
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
  },
  //*****JavaScript function to construct and POST the JSON string for a list of ships to the controller
  postShips() {
    fetch(`/api/games/players/${this.gp}/ships`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify([
        { shiptype: "Destroyer", locations: ["A1", "B1", "C1"] },
        { shiptype: "Carrier", locations: ["H3", "H4", "H5", "H6", "H7"] }
      ])
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
      .catch(res => {
        console.log(res);
      });
  }
};
</script>
<style scoped>
.maindiv {
  width: 300px;
  height: 300px;
}
#Destroyer {
  width: 90px;
  height: 30px;
  background-color: red;
}
#Submarine {
  width: 90px;
  height: 30px;
  background-color: green;
}
#Patrol {
  width: 60px;
  height: 30px;
  background-color: blue;
}
#Battleship {
  width: 120px;
  height: 30px;
  background-color: orange;
}
#Carrier {
  width: 150px;
  height: 30px;
  background-color: blueviolet;
}
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
.Carrier {
  background-color: blueviolet;
}
.Battleship {
  background-color: orange;
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
.v-input--selection-controls {
  margin-top: 0px;
  padding-top: 0px;
  padding-left: 20px;
}
.position {
  border: 1px solid black;
  width: 270px;
  align-items: baseline;
  justify-content: space-evenly;
  margin-bottom: 10px;
}
</style>

