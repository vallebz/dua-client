<template>
  <div>
    <h1>Demo Button :)</h1>
    <p>{{ displayText }}</p>
    <button @click="addText">Nächster Request</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      displayText: "",
    };
  },
  methods: {
    async addText() {
      console.log("addText");
      try {
        const response = await fetch('http://localhost:8080/jakarta-example/resource', {
          method: "GET",
          headers: {
            "authn-data": "@prefix ex: <http://example.org> . @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> . @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> . ex:Valentin a ex:Person ; a ex:Human .",
          },
        });
        console.log("try response");

        const data = await response.text();

        this.displayText += ` ${data} `;
      } catch (error) {
        console.error += ('Error during fetch:', error);
        this.displayText += ` Fetch-Fehler: ${error.message} `;
      }
    },
  },
};
</script>