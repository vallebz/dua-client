<template>
  <div>
    <h1>DUA Demo</h1>
    <h2>Example of the protocol sequence</h2>
    <!-- <details><summary>Summary</summary><p>Value</p><br></details> -->
    <div class="grid-container"></div>
    <!-- <div id="firstRequest">
      <div class="bodyText" id="firstRequestBody"></div>
      <div class="headerText" id="firstRequestHeaders"></div>
    </div>
    <br>
    <div id="secondRequest">
        <div class="bodyText" id="secondRequestBody"></div>
        <div class="headerText" id="secondRequestHeaders"></div>
    </div> -->
    <br>
    <button id="addText" @click="addText">{{ buttonText }}</button>
    <button @click="doReset">Reset</button>
    <!-- <button @click="addRow">addRow</button> -->
  </div>
</template>

<script>
import { Parser, Store, Writer } from "n3";


export default {

  data() {
    return {
      firstRequest: "",
      secondRequest: "",
      buttonText: "Send HTTP request",
      counter: 0,
      url: "http://localhost:8080/jakarta-example/resource",
      displayedHeaders: ['date', 'content-type', 'www-authenticate'],
    };
  },

  methods: {


    async addText() {

      if (this.counter == 0) {

        

        const { bodyData, headerData } = await this.fetchData(this.url);
        // document.getElementById('firstRequestBody').innerHTML = bodyData + "</br>";
        // document.getElementById('firstRequestHeaders').innerHTML += headerData;
        this.addRow(bodyData + "<br>" + headerData)
        this.buttonText = "Send HTTP request with credential attached";
        this.counter += 1;
        return;

      } else if (this.counter == 1) {
        const options = {
          method: "GET",
          headers: {
            "authn-data": "@prefix ex: <http://example.org> . @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> . @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> . ex:Valentin a ex:Person ; a ex:Human .",
          },
        };
        const { bodyData, headerData } = await this.fetchData(this.url, options);
        // document.getElementById('secondRequestBody').innerHTML += bodyData + "</br>";
        // document.getElementById('secondRequestHeaders').innerHTML += headerData;
        this.addRow(bodyData + "<br>" + headerData)
        document.getElementById('addText').style.display = "none";
        this.counter += 1;
        return;
      }
    },

    doReset() {
      // document.getElementById('firstRequest').innerHTML = "";
      // document.getElementById('secondRequest').innerHTML = "";
      document.querySelector('.grid-container').innerHTML = "";
      document.getElementById('addText').style.display = "inline";  
      this.buttonText = "Send HTTP request";
      this.counter = 0;
    },

    async fetchData(url, options = {}) {
      try {
        const response = await fetch(url, options);
        const bodyData = await response.text();
        let headerData = '<b>Headers:</b></br>';
        response.headers.forEach(async (value, name) => {
          if (this.displayedHeaders.includes(name)) {

            if (name == "authn-data" || name == "www-authenticate") {
              console.log("fetchData Method running " + name );
              const rdfGraph = await this.parseRdfData(value);
              const rdfStore = rdfGraph.store();
              const formattedRdf = await this.saveRdfGraphToString(rdfStore);
              console.log(formattedRdf)
              value = formattedRdf;
            }
            headerData += `<details><summary>${name}</summary><p>${value}</p></br></details>`;
          }
        });
        return { bodyData, headerData };
      } catch (error) {
        console.error('Error during fetch:', error);
        this.displayText += ` Fetch-Fehler: ${error.message} `;
        return null;
      }
    },

    addRow(messageText) {
      var container = document.querySelector('.grid-container');
      var newRow = `
                <div>Client</div>
                <div>` + messageText + `</div>
                <div>Server</div>
            `;
      container.innerHTML += newRow;
    },

    async parseRdfData(rdfString) {
      console.log("parse Method running");
      const parser = new Parser();
      const store = new Store();
      return new Promise((resolve, reject) => {
        parser.parse(rdfString, (error, quad, prefixes) => {
          if (error) reject(error);
          if (quad) store.addQuad(quad);
          else resolve({ store, prefixes });
        });
      });
    },

    async saveRdfGraphToString(rdfStore) {
      return new Promise((resolve, reject) => {
        const writer = new Writer({ format: 'Turtle' });
        rdfStore.getQuads().forEach(quad => {
          writer.addQuad(quad);
        });

        let rdfString = '';
        writer.end((error, result) => {
          if (error) reject(error);
          rdfString = result;
        });

        writer.on('end', () => {
          resolve(rdfString);
        });
      });
    },

  },
};
</script>

<style>
button {
      margin-right: 10px;
    }
.grid-container {
        display: grid;
        grid-template-columns: 150px auto 150px;
        gap: 0px;
        padding: 0px;
    }
.grid-container > div {
    text-align: center;
    padding: 20px 0;
    border: 1px solid white;
} 
</style>
