<template>
  <div>
    <div id="alert" style="display = none">
      <h1>{{ this.alert }}</h1>
    </div>
    <div v-if="this.info" id="container">
      <h1>Game View for GamePlayer{{ gp }}</h1>
      <div v-for="gameplayer in this.info.gamePlayers" :key="gameplayer.id">
        <p v-if="gameplayer.id == gp">Email: {{ gameplayer.player.email }}</p>
        <p v-else>Opponent Email: {{ gameplayer.player.email }}</p>
      </div>

      <div id="ships">
        <h2>Ships</h2>
        <div class="d-flex position">
          <h3>Position:</h3>
          <div>
            <input
              type="radio"
              id="one"
              value="Horizontal"
              v-model="position"
            />
            <label for="one">Horizontal</label>
          </div>

          <div>
            <input type="radio" id="two" value="Vertical" v-model="position" />
            <label for="two">Vertical</label>
          </div>
        </div>

        <div class="ships">
          <div>
            <p>Destroyer:</p>
            <div
              id="Destroyer"
              draggable="true"
              @dragleave="check($event)"
              @dragstart="
                drag($event), setShip({ type: 'Destroyer', shipLength: 3 })
              "
            ></div>
          </div>
          <div>
            <p>Battleship:</p>
            <div
              id="Battleship"
              draggable="true"
              @dragstart="
                drag($event), setShip({ type: 'Battleship', shipLength: 4 })
              "
            ></div>
          </div>

          <div>
            <p>Submarine:</p>
            <div
              id="Submarine"
              draggable="true"
              @dragstart="
                drag($event), setShip({ type: 'Submarine', shipLength: 3 })
              "
            ></div>
          </div>

          <div>
            <p>Patrol Boat:</p>
            <div
              id="Patrol"
              draggable="true"
              @dragstart="
                drag($event), setShip({ type: 'Patrol', shipLength: 2 })
              "
            ></div>
          </div>
          <div>
            <p>Carrier:</p>
            <div
              id="Carrier"
              draggable="true"
              @dragstart="
                drag($event), setShip({ type: 'Carrier', shipLength: 5 })
              "
            ></div>
          </div>
        </div>
      </div>

      <div class="d-flex" id="tables">
        <div v-if="this.info.status == 'Waiting for opponent'">
          <span>{{ this.info.status }}</span>
        </div>
        <div
          style="
      padding-right: 70px;
  "
          v-else
        >
          <br />
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
          <v-btn @click="postShips" id="postShips">Post Ships</v-btn>
        </div>

        <div id="salvoes">
          <div
            v-if="
              this.info.status == 'Waiting for opponent' ||
                this.info.status == 'Already two players, place your ships' ||
                this.info.status == 'Waiting for the ships of the opponent' ||
                this.info.status == 'Place your ships' ||
                this.info.status == 'Waiting for salvos of the opponent'
            "
          >
            <span>{{ this.info.status }}</span>
          </div>
          <div v-else>
            <span>{{ this.info.status }}</span>
            <h2>Salvoes</h2>
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
                    :data-counter="0"
                    @click="clickHandler($event)"
                  >
                    <span v-if="i == 0">{{ row }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
            <v-btn
              v-if="
                this.info.status == 'Waiting for your salvos' ||
                  this.info.status == 'Send salvos'
              "
              id="postSalvos"
              @click="postSalvoes"
              >Post Salvoes</v-btn
            >
            <span v-else></span>
          </div>
        </div>
      </div>
      <div id="sunkShips" v-if="this.sunk.length != 0">
        <h2>Sunk Opponent ships</h2>
        <p class="sunk" v-for="sunkShip in sunk" :key="sunkShip">
          {{ sunkShip }}
        </p>
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
      position: "",
      info: null,
      columns: ["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
      selectedShip: {},
      tdid: "",
      allowDrop: true,
      placedShips: [],
      salvoes: [],
      alreadyFired: [],
      turn: null,
      sunk: [],
      alert: ""
    };
  },

  mounted() {
    this.gettingGP();
  },

  methods: {
    // close() {},
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
      console.log("cells", cells);
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
      console.log("ship type", data);
      ev.target.appendChild(document.getElementById(data));
      this.colorCells();
    },

    setShip(ship) {
      this.selectedShip = ship;
    },

    clear(classe) {
      console.log("Ship type", classe);
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
        element.removeAttribute("class");
      }
    },
    colorCells() {
      console.log(this.tdid);
      var rowid = this.tdid.charAt(0);
      var number = parseInt(this.tdid.slice(1));
      console.log("rowid", rowid, "number", number);
      var cells = [];
      if (this.position == "Vertical") {
        //  numRow is the number for the letter
        var numbRow = rowid.charCodeAt(0);

        //   console.log(this.position);
        for (var j = 0; j < this.selectedShip.shipLength; j++) {
          console.log(
            "vertical positions:",
            String.fromCharCode(numbRow + j) + number
          );
          cells.push(String.fromCharCode(numbRow + j) + number);
          document
            .getElementById(String.fromCharCode(numbRow + j) + number)
            .setAttribute("class", this.selectedShip.type);
        }
      } else {
        for (var i = 0; i < this.selectedShip.shipLength; i++) {
          console.log("horizontal positions:", rowid + (number + i));
          cells.push(rowid + (number + i));
          document
            .getElementById(rowid + (number + i))
            .setAttribute("class", this.selectedShip.type);
        }
      }
      this.placedShips.push({
        shiptype: this.selectedShip.type,
        locations: cells
      });
      console.log(this.placedShips);
    },
    colorShips() {
      if (this.info.ships.length != 0) {
        console.log(this.info.ships.length);
        document.getElementById("postShips").style.display = "none";
        document.getElementById("ships").style.display = "none";
        this.info.ships.forEach(ship => {
          ship.locations.forEach(location => {
            // var loc = document.getElementById(location); or
            var loc = this.$refs[location][0];
            loc.setAttribute("class", ship.type);
          });
        });
        // document.getElementById("salvoes").style.display = "block";
      }
    },
    gettingGP() {
      console.log("fetching");
      axios
        .get(`/api/game_view/${this.gp}`)
        .then(response => {
          this.info = response.data;
          console.log(this.info);
          setTimeout(() => {
            this.colorShips();
          }, 0);
          setTimeout(() => {
            if (this.info.salvos.length !== 0) {
              this.salvoesCell();
            }
          }, 1);
          setTimeout(() => {
            if (this.info.hits) {
              this.hitsCells();
              this.sunkShips();
            }
          }, 2);
        })
        .catch(function(error) {
          // handle error
          console.log(error);
        });
    },
    postShips() {
      console.log("clicked");
      fetch(`/api/games/players/${this.gp}/ships`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(this.placedShips)
      })
        .then(result => {
          //Here body is not ready yet, throw promise
          if (!result.ok) throw result;
          return result.json();
        })
        .then(result => {
          //Successful request processing
          console.log("result:", result);
        })
        .catch(error => {
          //Here is still promise
          error.json().then(body => {
            alert(body.error);
          });
        });
    },

    // function to print the salvoes of the current user (second click remove the salvo placed, only 5 slavoes per turn)
    clickHandler(event) {
      var salvo = event.target.id;
      console.log(salvo);
      if (!this.alreadyFired.includes(salvo)) {
        event.target.dataset.counter++;
        var loc = this.$refs[salvo][1];
        loc.setAttribute("class", "salvo");
        loc.textContent = this.turn;
        console.log("you have clicked");
        var included = this.salvoes.includes(event.target.id);
        console.log(included);
        if (included) {
          console.log(this.salvoes);
          loc.removeAttribute("class");
          loc.textContent = "";
        } else if (this.salvoes.length < 5) {
          this.salvoes.push(salvo);
        } else if (this.salvoes.length == 5) {
          console.log("no more pushes");
          loc.removeAttribute("class");
          loc.textContent = "";
        } else {
          console.log("something wrong happened");
        }

        if (event.target.dataset.counter == 2) {
          console.log("remove the location");
          var index = this.salvoes.indexOf(event.target.id);
          var removed = this.salvoes.splice(index, 1);
          console.log(removed);
          console.log(this.salvoes);
        }
        console.log(this.salvoes);
      }
    },
    postSalvoes() {
      console.log("salvoes on the way");
      fetch(`/api/games/players/${this.gp}/salvos`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(this.salvoes)
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
        })
        .catch(res => {
          console.log(res);
        });
      this.alreadyFired = this.salvoes;
      console.log("already fired", this.alreadyFired);
      this.salvoes = [];
      console.log(this.salvoes);
      this.turn++;
      console.log(this.turn);
    },
    salvoesCell() {
      console.log(Object.entries(this.info.hits).length);
      console.log("object is not empty");
      var salvoShip = Object.keys(this.info.hits);
      console.log(salvoShip);
      for (var i = 0; i < salvoShip.length; i++) {
        var turns = Object.keys(this.info.hits[salvoShip[i]]);
        for (var j = 0; j < turns.length; j++) {
          this.info.hits[salvoShip[i]][turns[j]].hits.forEach(hit => {
            var loc = this.$refs[hit][1];
            console.log("loc", loc, "turn", turns[j]);
            loc.setAttribute("class", "hit");
            loc.textContent = turns[j];
          });
        }
      }
      for (var k = 0; k < this.info.salvos.length; k++) {
        var turn = Object.keys(this.info.salvos[k][this.gp]);
        var positions = this.info.salvos[k][this.gp][turn];
        for (var l = 0; l < positions.length; l++) {
          var pos = this.$refs[positions[l]][1];
          if (!pos.classList.contains("hit")) {
            pos.setAttribute("class", "fired");
            pos.textContent = turn;
          }
        }
      }
    },
    hitsCells() {
      this.info.oppSalvos.forEach(salvo => {
        Object.keys(salvo).forEach(key => {
          var id = salvo[key];
          var turns = Object.keys(id);
          id[turns].forEach(position => {
            var loc = this.$refs[position][0];
            loc.textContent = turns[0];
            if (
              loc.classList.contains("Patrol") ||
              loc.classList.contains("Submarine") ||
              loc.classList.contains("Destroyer") ||
              loc.classList.contains("Carrier") ||
              loc.classList.contains("Battleship")
            ) {
              loc.classList.add("hit");
            } else {
              loc.classList.add("fired");
            }
          });
        });
      });
    },
    sunkShips() {
      var keys = Object.keys(this.info.hits);
      // console.log(keys);
      var length;

      for (var i = 0; i < keys.length; i++) {
        if (keys[i] == "Destroyer") {
          length = 3;
        } else if (keys[i] == "Submarine") {
          length = 3;
        } else if (keys[i] == "Carrier") {
          length = 5;
        } else if (keys[i] == "Battleship") {
          length = 4;
        } else if (keys[i] == "Patrol") {
          length = 2;
        }
        // console.log("ship length", length);
        var turns = Object.keys(this.info.hits[keys[i]]);
        var hitsLength = [];
        for (var j = 0; j < turns.length; j++) {
          var hits = this.info.hits[keys[i]][turns[j]].hits.length;
          hitsLength.push(hits);
          console.log(keys[i], turns[j], hits);
        }
        console.log("hitLength", hitsLength);
        var hitted = 0;
        for (var k = 0; k < hitsLength.length; k++) {
          hitted = hitted + hitsLength[k];
        }
        console.log("hitted", hitted);
        if (hitted == length) {
          this.sunk.push(keys[i]);
        }
      }
      console.log(this.sunk);
    }
  }
};
</script>
<style scoped>
#alert {
  color: black;
  background-color: white;
  text-align: center;
}
button {
  padding-left: 5px;
  padding-right: 5px;
  margin-left: 120px;
  margin-top: 30px;
  margin-bottom: 30px;
}
.maindiv {
  width: 300px;
  height: 300px;
}
div.ships {
  display: inline-grid;
  grid-template-columns: auto auto;
  grid-gap: 5px 20px;
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
  border: 1px solid white;
  width: 30px;
  height: 30px;
}

#shipGrid td:first-child,
#salvoGrid td:first-child {
  border: none;
  font-weight: 600;
}

span {
  font-weight: 600;
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

.salvo {
  background-image: url("../img/bomb.png");
  background-size: cover;
  color: white;
  text-align: center;
}
.fired {
  background-image: url("../img/splash.png");
  background-size: cover;
  color: black;
  text-shadow: 2px 2px 2px white;
  text-align: center;
}

.hit {
  color: black;
  background-image: url("../img/boom.png");
  background-size: contain;
  text-align: center;
}
.v-input--selection-controls {
  margin-top: 0px;
  padding-top: 0px;
  padding-left: 20px;
}
.position {
  border: 2px solid white;
  width: 270px;
  align-items: baseline;
  justify-content: space-evenly;
  margin-bottom: 10px;
}
/* #salvoes {
  display: none;
} */
/* #card {
  display: none;
  position: absolute;
  left: 69px;
  top: 150px;
} */
#container {
  height: 130vh;
  color: white;
  text-shadow: 2px 2px 4px #000000;
  padding-left: 10%;
  background-image: linear-gradient(
      to bottom,
      rgba(110, 115, 255, 0.1),
      rgba(80, 140, 255, 0.6)
    ),
    url("../img/background2.jpg");
  background-size: cover;
  padding: 0 15%;
}
.sunk {
  text-decoration: line-through;
}
/* #sunkShips {
  display: none;
} */
.sunkBtn {
  color: black;
  padding: 0;
  margin: 0;
}
</style>

