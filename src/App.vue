<template>
  <div>
    <h1>DUA Demo</h1>
    <h2>Example of the protocol sequence</h2>
    <div id="firstRequest"></div>
    <br>
    <div id="secondRequest"></div>
    <br>
    <button id="addText" @click="addText">{{ buttonText }}</button>
    <button @click="doReset">Reset</button>
  </div>
</template>

<script>
export default {

  data() {
    return {
      firstRequest: "",
      secondRequest: "",
      buttonText: "Send HTTP request",
      counter: 0,
      url: "http://localhost:8080/jakarta-example/resource",
    };
  },

  methods: {

    async addText() {

      if (this.counter == 0) {

        const { bodyData, headerData } = await this.fetchData(this.url);
        document.getElementById('firstRequest').innerHTML += bodyData + "</br>";
        document.getElementById('firstRequest').innerHTML += headerData;
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
        document.getElementById('secondRequest').innerHTML += bodyData + "</br>";
        document.getElementById('secondRequest').innerHTML += headerData;
        document.getElementById('addText').style.display = "none";
        this.counter += 1;
        return;
      }
    },

    doReset() {
      document.getElementById('firstRequest').innerHTML = "";
      document.getElementById('secondRequest').innerHTML = "";
      document.getElementById('addText').style.display = "inline";
      this.buttonText = "Send HTTP request";
      this.counter = 0;
    },

    async fetchData(url, options = {}) {
      try {
        const response = await fetch(url, options);
        const bodyData = await response.text();
        let headerData = '<b>Headers:</b></br>';
        response.headers.forEach((value, name) => {
          headerData += `${name}: ${value}</br>`;
        });
        return { bodyData, headerData };
      } catch (error) {
        console.error('Error during fetch:', error);
        this.displayText += ` Fetch-Fehler: ${error.message} `;
        return null;
      }
    },
  },
};
</script>

<style>
button {
      margin-right: 10px;
    }
</style>