<template>
  <Toast position="bottom-left" />
  
  <div class="split left">
    <div>
      <h1>DUA Demo</h1>
      <div class="grid-container" v-for="[outerKey, headersMap] in requestsMap"> 
        <div>
          <i class="pi pi-user" v-if="outerKey.startsWith('request')"></i>
          <pre v-if="outerKey.startsWith('request')">You</pre>
        </div>
        <div>
          <div v-if="outerKey.startsWith('request')">
          <div class="middleColumn">
            <br v-if="!requestsMap.get(outerKey) != ''"/>
            <br v-if="!requestsMap.get(outerKey) != ''"/>
            <b>HTTP 1.1 GET /exampleResource</b>
            <div v-if="requestsMap.get(outerKey) != ''">
              <p>Headers:</p>
                <Accordion :dynamicHeight="true" :multiple="true" :key="outerKey">
                <AccordionTab v-for="[innerKey, innerValue] in headersMap" :key="innerKey" :header="innerKey">
                  <pre>{{ innerValue }}</pre>
                </AccordionTab>
                </Accordion><br/>
            </div>
          </div>  
          <img class="arrow" align="right" src="./assets/right_solid_arrow_lila.svg">
          </div>

          <div v-if="outerKey.startsWith('response')">
            <img class="arrow" align="left" src="./assets/left_dashed_arrow_lila.svg"><br/>
            <div class="middleColumn">
              <b>{{ this.responseText[outerKey.includes("5")?5:0] }}</b><br/>
              <p>Headers:</p>
              <Accordion :max-height="100" v-model:activeIndex="this.active[outerKey.includes('5') ? 5 : 0]" :multiple="true" :key="outerKey">
              <AccordionTab class="accordiontab" v-for="[innerKey, innerValue] in headersMap" :id="innerKey" :key="innerKey" :header="innerKey">
                <pre>{{ innerValue }}</pre>
              </AccordionTab>
              </Accordion><br/>
            </div>
          </div>
          <div class="spacer"><br/></div>
        </div>
        <div>
          <i class="pi pi-server" style="font-size: 4rem" v-if="outerKey.startsWith('request')"></i>
          <pre v-if="outerKey.startsWith('request')">Server</pre>
        </div>
      </div>
      <br/>
      <Fieldset align="left" v-if="this.counter == 3 || this.counter == 4" :toggleable="true" legend="Credential"><pre>{{ this.authnData }}</pre></Fieldset>
      <div>
        <Button id="addText" @click="addText">{{ this.buttonText[this.counter] }}</Button>
        <br/>
        <br/>
      </div>
    </div>
  </div>

  <div class="split right">
    <div class="vl">
      <div class="tutorial">
        <b>Walk through</b>
        <p class="tutorial-text">{{ this.tutorialText[this.counter] }}</p>
        <Button @click="doReset">Reset Demo</Button>      
      </div>
    </div>
  </div>
</template>

<script>
import { Parser, Store } from "n3";
import { toTTL } from "@/lib/n3Extensions";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";

export default {

  created() {
    this.loadFile('src/assets/VP_policies.ttl');
  },
  data() {
    return {
      active: [[]],
      visible: false,
      counter: 0,
      url: "http://localhost:8080/jakarta-example/resource",
      displayedHeaders: ['date', 'content-type', 'www-authenticate', 'authn-data'],
      requestsMap: new Map([["request0", ""]]),
      responseText: [],
      buttonText: [
        "Send request",
        "View header",
        "Create credential",
        "Create request",
        "Attach credential",
        "Send request",
        "View agreements",
        "Reset",
      ],
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
      authnData: "",
      // authnDataRDF: "@prefix acl: <http://www.w3.org/ns/auth/acl#> . @prefix acp: <http://www.w3.org/ns/solid/acp#> . @prefix cred: <https://w3.org/2018/credentials#> . @prefix dc: <http://purl.org/dc/terms/> . @prefix dpv: <http://www.w3.org/ns/dpv#> . @prefix ex: <http://example.org> . @prefix oac: <https://w3id.org/oac#> . @prefix foaf: <http://xmlns.com/foaf/0.1/> . @prefix odrl: <http://www.w3.org/ns/odrl/2/> . @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> . @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> . @prefix schema: <http://schema.org/> . @prefix sec: <https://w3id.org/security#> . @prefix sh: <http://www.w3.org/ns/shacl#> . @prefix xsd: <http://www.w3.org/2001/XMLSchema#> . <#exampleStudentPresentation> a cred:VerifiablePresentation ; odrl:hasPolicy ex:agreementR; cred:verifiableCredential <#exampleStudentCredential> ; cred:holder <#exampleStudent> ; sec:proof <#presentationProofGraph> . <#exampleStudentCredential> a cred:VerifiableCredentialGraph ; schema:description 'An example credential, issued by an example university to an example student.' ; cred:credentialSubject <#exampleStudent> ; cred:holder <#exampleStudent> ; cred:validFrom '2023-12-06T11:05:44.403Z'^^xsd:dateTime ; cred:expirationDate '2024-12-06T11:05:44.403Z'^^xsd:dateTime ; cred:issuanceDate '2022-12-06T11:05:44.403Z'^^xsd:dateTime ; cred:issuer ex:exampleUniversity ; sec:proof <#proofGraph> . <#exampleStudent> a schema:Person , ex:Student ; foaf:name 'John Doe' ; schema:memberOf ex:exampleUniversity ; ex:degreeCourse ex:MechanicalEngineering ; ex:degree ex:BachelorOfScience ; ex:matriculationNumber 12345678 ; ex:enrolledSince '2018-08'^^xsd:gYearMonth . ex:agreementR a odrl:Agreement; odrl:profile odrl: ; dc:description 'Agreement between an University and a Student to read Teaching Content for Academic Research purposes.' ; dc:creator ex:exampleStudent ; dc:issued '2022-11-08T17:58:31'^^xsd:dateTime ; dc:valid 'P1Y0M0D0H0S'^^xsd:duration ; dc:references ex:offerR ; odrl:uid ex:agreementR ; sec:proof <#agreementProofGraph> ; odrl:permission [ a odrl:Permission ; odrl:assigner ex:exampleUniversity ; odrl:assignee ex:exampleStudent ; odrl:action odrl:Read ; odrl:target ex:exampleTeachingContent ; acp:grant acl:Read ; acp:context [ acp:agent ex:exampleStudent ; acp:target ex:exampleTeachingContent ] ; odrl:constraint [ a odrl:Constraint ; dc:title 'Permission to read teaching content for the purpose of academic research.' ; odrl:leftOperand dpv:Purpose ; odrl:operator odrl:isA ; odrl:rightOperand dpv:AcademicResearch ] ; odrl:duty [ a odrl:Duty ; odrl:action odrl:grantUse ; odrl:target <#exampleStudentPresentation> ; odrl:constraint [ a odrl:Constraint ; dc:title 'Grantee of use is exampleUniversity.' ; schema:grantee ex:exampleUniversity ] ] ] . ex:requirementVP a oac:RequirementPolicy ; odrl:profile oac: ; dc:description 'Requirement to read Verifiable Presentation attribute only for the purpose of identity verification based on legitimate interest.' ; dc:creator ex:exampleStudent ; dc:issued '2022-11-08T18:05:09'^^xsd:dateTime ; dc:valid 'P1Y0M0D0H0S'^^xsd:duration ; dpv:hasDataProtectionOfficer ex:exampleDataProtOfficer ; dpv:hasDataController ex:exampleUniversity ; odrl:uid ex:requirementVP ; sec:proof <#proofGraph> ; odrl:permission [ odrl:assigner ex:exampleStudent ; odrl:action oac:Read ; odrl:target [ rdf:subject [ ] ; rdf:predicate rdf:type ; rdf:object ex:Student ; dc:isRequiredBy ex:VerifiablePresentationShape ; dc:source ex:exampleStudent ] ; odrl:constraint [ odrl:and [ dc:title 'Purpose for access to Verifiable Credential attribute is to verify the identity of the assigner.' ; odrl:leftOperand dpv:Purpose ; odrl:operator odrl:isA ; odrl:rightOperand dpv:IdentityVerification ] , [ dc:title 'Legal basis for access is legitimate interest.' ; odrl:leftOperand oac:LegalBasis ; odrl:operator odrl:isA ; odrl:rightOperand dpv:LegitimateInterest ] ] ] . ex:exampleDataProtOfficer foaf:name 'John Muller' ; a dpv:DataProtectionOfficer ; schema:address [ a schema:PostalAddress ; schema:addressLocality 'Anytown' ; schema:postalCode '12345' ; schema:streetAddress '123 Main Street' ; schema:addressCountry 'CountryX' ; schema:telephone '012345' ; schema:email 'dataprotectionofficer@example.org' ] . ex:exampleDataController foaf:name 'University' ; a dpv:DataController ; a dpv:AcademicScientificorganisation ; schema:address [ a schema:PostalAddress ; schema:addressLocality 'Anytown' ; schema:postalCode '12345' ; schema:streetAddress '123 Main Street' ; schema:addressCountry 'CountryX' ; schema:telephone '012345' ; schema:email 'university@example.org' ] .",
      tutorialText: [
        "Welcome to the Data Usage Agreement (DUA) demo that is based on the RDF Framework and Verifiable Credentials. This demo will guide you (the client) through the process of accessing a resource on a server and viewing the agreements that are attached to the resource.\n\nTo start the demo by sending a HTTP GET request to the server, click the button \"Send request\".",
        "The server respondend with a 401 Unauthorized status code and a 'www-authenticate' header. The server tells the client that a Verifiable Credential proving the clients authenticity is missing. The missing credential is described by a SHACL Shape.\n\nClick the button \"View header\" to inspect the header.",
        "The 'www-authenticate' header contains a RDF graph. The SHACL shape of the graph defines the required Verifiable Credential. It defines shapes for a Verifiable Presentation and Verifiable Credential graphs, outlining their required properties such as policies, holders, issuers, and proofs. Additionally, it specifies constraints on credential subjects, issuance dates, and expiration dates. The graph also includes an example of permissions and requests, indicating actions such as reading teaching content for academic research and verifying identity based on legitimate interest. Furthermore, at the end of the graph an exemplary data protection officer and data controller is presented, providing their contact details and organizational affiliations.\n\nProceed to create the required credential matching the shape by clicking the button \"Create credential\".",
        "The Verifiable Credential was created and is displayed below the sequence diagram. The VC is based on a exemplary Student Credential. Now, the client has to create a new HTTP GET request to access the resource again. \n\nClick the button \"Create request\" to create the request.",
        "The new request needs to be attached with the created Verifiable Credential. The client has to attach the credential as a header to the request. \n\nClick the button \"Attach credential\" to attach the credential to the request.",
        "The credential was attached successfully and can be inspected in the authn-data header. The client can now send the request to the server. \n\nClick the button \"Send request\" to send the request.",
        "The server responded with a HTTP 200 OK status code and a response body. The response body contains the requested resource and the agreements that are attached to the resource. The server has validated the provided credential against the SHACL shape and allowed the client to access the data.\n\nClick the button \"View agreements\" to inspect the data usage agreements.",
        "The authn-data header contains the agreements that are attached to the exchanged resources. The client can inspect the usage agreements of the private data contained in his provided credential and the usage agreements of the data contained in the provided content by the server.\n\nClick the button \"Reset\" to reset the demo and start again.",
      ],
    };
  },

  methods: {


    async addText() {

      //Send request
      if (this.counter == 0) {
        this.requestsMap.set("response" + this.counter, new Map())
        await this.fetchData(this.counter, "response" + this.counter, this.url);
        this.updateTextCounter();
        return;
      }

      //View header
      else if (this.counter == 1) {
        this.active[0].push(2);
        this.updateTextCounter();
        return;
      }

      //Create credential
      else if (this.counter == 2) {
        this.active[0].pop(2);
        this.$toast.add({ severity: 'success', summary: 'Success', detail: 'Credential created', life: 3000 });
        this.updateTextCounter();
        return;
      }

      //Create request
      else if (this.counter == 3) { 
        this.requestsMap.set("request" + this.counter);
        this.updateTextCounter();
        return;
      }

      //Attach credential
      else if (this.counter == 4) {
        const rdfGraph = await this.parseRdfData(await this.loadFile('src/assets/VP_policies.ttl'));
        const formattedAuthnData = toTTL(rdfGraph.store, rdfGraph.prefixes)
        this.requestsMap.delete("request" + (this.counter - 1));
        this.requestsMap.set("request" + this.counter, new Map([["authn-data", formattedAuthnData]]));
        this.updateTextCounter();
        return;
      }

      //Send request
      else if (this.counter == 5) {
        this.requestsMap.set("response" + this.counter, new Map())
        let authnDataRDF = await this.loadFile('src/assets/VP_policies.ttl');
        authnDataRDF = authnDataRDF.replace(/(\r\n|\n|\r)/gm, "");
        const options = {
          method: "GET",
          headers: {
            "authn-data": authnDataRDF,
          },
        };
        await this.fetchData(this.counter, "response" + this.counter, this.url, options);
        for(let i = 0; i < 5; i++) {
          this.active.push([]);
        }
        this.updateTextCounter();
        return;
      }

      //View agreements
      else if (this.counter == 6) {
        this.active[5].push(2);
        document.getElementById('addText').style.display = "none";
        this.updateTextCounter();
        return;
      }
    },


    updateTextCounter() {
      this.counter += 1;
      if(this.disabledTutorial != true) this.visible = true;
      return;
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
      this.counter = 0;
      this.tempActionText = this.actionText[this.counter];
      this.tempButtonText = this.buttonText[this.counter];
      this.active = [[]];
      this.$toast.add({ severity: 'info', summary: 'Reset', detail: 'Demo was reset successfully', life: 3000 });
    },

    async loadFile(path) {
      try {
        const response = await fetch(path);
        if (!response.ok) {
          throw new Error('Failed to load file');
        }
        return this.authnData = await response.text();
      } catch (error) {
        console.error('Error loading file:', error);
      }
    }
  },
};
</script>

<style>

.tutorial {
  align-items: center;
  text-align: left;
  padding: 20px;
  margin: 0;
  margin-bottom: 20px;
  height: 100%;
  
}

.tutorial-text {
  color: gray;
  white-space: pre-wrap;       /* Since CSS 2.1 */
  white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
  white-space: -pre-wrap;      /* Opera 4-6 */
  white-space: -o-pre-wrap;    /* Opera 7 */
}

.vl {
  border-left: 3px solid lightgrey;
  height: 100%;
}

/* Split the screen in half */
.split {
  height: 100%;
  width: 75%;
  position: fixed;
  top: 0;
  overflow: auto;
  padding-top: 0px;
}

/* Control the left side */
.left {
  left: 0;
  max-width: 1200px;
}

/* Control the right side */
.right {
  right: 0;
  width: 25%;
}

.centered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center
}

button {
  margin-right: 10px;
}

fieldset {
  margin: 30px;
  margin-top: 0;
}

.grid-container {
  display: grid;
  grid-template-columns: 150px minmax(700px, 1fr) 150px;
  gap: 0px;
  padding: 0px;
  overflow: hidden;
}

.grid-container > div {

    padding: 20px 0;
    border-left: 1px solid rgb(108 44 230);
    border-right: 1px solid rgb(108 44 230); 
    word-wrap: break-word;
    overflow-wrap: break-word;
    z-index: 5;
}

.grid-container > div:first-child {
    border-left: none;
    background-color: white;
    z-index: 10;
}

.grid-container > div:last-child {
    border-right: none;
    background-color: white;
    z-index: 10;
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

i {
  font-size: 4rem ;
  color: #6C2CE6;
}

pre {
    white-space: pre-wrap;       /* Since CSS 2.1 */
    white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
    white-space: -pre-wrap;      /* Opera 4-6 */
    white-space: -o-pre-wrap;    /* Opera 7 */
    word-wrap: break-word;
    max-width: 700px;    /* Internet Explorer 5.5+ */
    font-size: medium;
}

b {
  white-space: pre-wrap;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}
#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}
</style>
