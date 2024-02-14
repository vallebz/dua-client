<template>
  <div>
    <h1>DUA Demo</h1>
    <h2>Click yourself through the protocol's sequence</h2>
    <div class="grid-container" v-for="[outerKey, headersMap] in requestsMap"> 
      <div>
        <img v-if="outerKey.startsWith('request')" src="./assets/self-employed_lila.png" alt="User Icon" width="50" height="50">
        <pre v-if="outerKey.startsWith('request')">You</pre>
      </div>
      <div>
        <div v-if="outerKey.startsWith('request')">
        <div class="middleColumn">
          <p>HTTP GET /exampleResource</p>
          <b v-if="requestsMap.get(outerKey) != ''">Headers:</b><br/>
          <details 
          v-for="[innerKey, innerValue] in headersMap"><summary>{{ innerKey }}</summary><pre>{{ innerValue }}</pre></details>
        </div>  
          <img class="arrow" src="./assets/right_solid_arrow_lila.svg" vertical-align="top"><br/><br/>
        </div>

        <div v-if="outerKey.startsWith('response')">
          <img class="arrow" src="./assets/left_dashed_arrow_lila.svg"><br/>
          <div class="middleColumn">
            {{ this.responseText[outerKey.includes("1")?1:0] }}<br/>
            <b>Headers:</b><br/>
            <details 
            v-for="[innerKey, innerValue] in headersMap" :id="innerKey"><summary>{{ innerKey }}</summary><pre>{{ innerValue }}</pre><br/></details>
          </div>
        </div>
      </div>
      <div>
        <img v-if="outerKey.startsWith('request')" src="./assets/cloud_lila.png" alt="Server Icon" width="50" height="50">
        <pre v-if="outerKey.startsWith('request')">Server</pre>
      </div>
    </div>
    <br/>
    <div>
      <div>
        <p>Next Action: {{this.buttonText}}</p>
        <button id="addText" @click="addText">Okay</button>       
        <button @click="doReset">Reset</button>
      </div>
    </div>
  </div>
</template>

<script>
import { Parser, Store } from "n3";
import { toTTL } from "@/lib/n3Extensions";


export default {

  data() {
    return {
      buttonText: "Send HTTP request",
      counter: 0,
      url: "http://localhost:8080/jakarta-example/resource",
      displayedHeaders: ['date', 'content-type', 'www-authenticate', 'authn-data'],
      requestsMap: new Map([["request0", ""]]),
      responseText: [],
      prefixes: {
        acl: 'http://www.w3.org/ns/auth/acl#',
        acp: 'http://www.w3.org/ns/solid/acp#',
        cred: 'https://w3.org/2018/credentials#',
        dc: 'http://purl.org/dc/terms/',
        dpv: 'http://www.w3.org/ns/dpv#',
        ex: 'http://example.org/' ,
        oac: 'https://w3id.org/oac#',
        foaf: 'http://xmlns.com/foaf/0.1/',
        odrl: 'http://www.w3.org/ns/odrl/2/',
        rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
        rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
        schema: 'http://schema.org/',
        sec: 'https://w3id.org/security#',
        sh: 'http://www.w3.org/ns/shacl#',
        xsd: 'http://www.w3.org/2001/XMLSchema#',
      },
      authnData: "@prefix ex: <http://example.org> . @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> . @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> . ex:Valentin a ex:Person ; a ex:Human .",
    };
  },


  methods: {


    async addText() {

      if (this.counter == 0) {
        this.requestsMap.set("response" + this.counter, new Map())
        await this.fetchData(this.counter, "response" + this.counter, this.url);
        this.buttonText = "View www-authenticate header";
        this.counter += 1;
        return;
      }

      else if (this.counter == 1) {
        const element = document.getElementById('www-authenticate');
        element.open = true;
        this.buttonText = "Create credential required by www-authenticate header";
        this.counter += 1;
        return;
      }

      else if (this.counter == 2) {
        this.buttonText = "Create new request";
        this.counter += 1;
        return;
      }

      else if (this.counter == 3) { 
        this.requestsMap.set("request" + this.counter)
        this.buttonText = "Attach required credential as a header";
        this.counter += 1;
        return;
      }

      else if (this.counter == 4) {
        const rdfGraph = await this.parseRdfData(this.authnData);
        const formattedAuthnData = toTTL(rdfGraph.store, rdfGraph.prefixes)
        this.requestsMap.delete("request" + (this.counter-1))
        this.requestsMap.set("request" + this.counter, new Map([["authn-data", formattedAuthnData]]))
        this.buttonText = "Send request with attached credential";
        this.counter += 1;
        return;
      }

      else if (this.counter == 5) {
        this.requestsMap.set("response" + this.counter, new Map())
        const options = {
          method: "GET",
          headers: {
            "authn-data": "@prefix ex: <http://example.org> . @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> . @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> . ex:Valentin a ex:Person ; a ex:Human .",
          },
        };
        await this.fetchData(this.counter, "response" + this.counter, this.url, options);
        this.buttonText = "View agreements in authn-data header";
        this.counter += 1;
        return;
      }

      else if (this.counter == 6) {
        const element = document.getElementById('authn-data');
        element.open = true;
        document.getElementById('addText').style.display = "none";
        this.buttonText = "Reached end of protocol. Reset?";
        return;
      }
    },


    async fetchData(counter, mapKey, url, options = {}) {
      try {
        const response = await fetch(url, options);
        this.responseText[counter] = await response.text();

        response.headers.forEach(async (value, name) => {
          if (this.displayedHeaders.includes(name)) {

            if (name == "authn-data" || name == "www-authenticate") {
              const rdfGraph = await this.parseRdfData(value);
              const formattedRdf = toTTL(rdfGraph.store, rdfGraph.prefixes) 
              value = formattedRdf;
            }
            this.requestsMap.get(mapKey).set(name, value);
          }
        });
        return;
      } catch (error) {
        console.error('Error during fetch:', error);
        this.displayText += ` Fetch-Fehler: ${error.message} `;
        return null;
      }
    },

    async parseRdfData(rdfString) {
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

    doReset() {
      this.requestsMap.clear();
      this.requestsMap.set("request0", "");
      document.getElementById('addText').style.display = "inline";
      this.buttonText = "Send HTTP request";
      this.counter = 0;
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
        grid-template-columns: 150px minmax(600px, 1fr) 150px;
        gap: 0px;
        padding: 0px;
    }
.grid-container > div {

    padding: 20px 0;
    border-left: 1px solid #646cff;
    border-right: 1px solid #646cff; 
    word-wrap: break-word;
    overflow-wrap: break-word;
}

.grid-container > div:first-child {
    border-left: none;
}
.grid-container > div:last-child {
    border-right: none;
}
.grid-container > div > p {
    margin-left: 20px;
}
.grid-container > .middleColumn {
    margin-left: 20px;
    text-align: left;
}
.grid-container > div > .middleColumn {
    margin-left: 20px;
    text-align: left;
}
.grid-container > div > div > .middleColumn {
    margin-left: 20px;
    text-align: left;
}


details{
  max-width: 600px;
}
.arrow {
  color: #646cff;
}
pre {
    white-space: pre-wrap;       /* Since CSS 2.1 */
    white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
    white-space: -pre-wrap;      /* Opera 4-6 */
    white-space: -o-pre-wrap;    /* Opera 7 */
    word-wrap: break-word;       /* Internet Explorer 5.5+ */
}
</style>
