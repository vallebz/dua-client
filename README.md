# Data Usage Agreement Demo

This is a demonstration of the Data Usage Agreement (DUA) system, based on the RDF Framework and Verifiable Credentials. The demo guides you through the process of accessing a resource on a server and viewing the agreements attached to the resource.

## Features

- HTTP Requests: Send HTTP requests to the server to access resources.
- View Headers: Inspect headers received from the server, including Verifiable Credentials.
- Create Credentials: Generate Verifiable Credentials based on predefined shapes.
- Attach Credentials: Attach created credentials to subsequent requests.
- View Agreements: Examine data usage agreements attached to exchanged resources.
- Reset Demo: Reset the demo to its initial state.

## How to Use

- Click the "Send request" button to initiate the demo.
- Follow the guided steps to interact with the demo interface.
- Use the buttons to progress through the demo stages.
- Inspect headers, create credentials, attach them to requests, and view agreements as instructed.
- Click the "Reset" button to restart the demo from the beginning.

## Installation

1. Clone this repository to your local machine.
2. Install dependencies using npm install.
3. Run the demo using npm run serve.
4. Install the local server from https://github.com/vallebz/dua_server
5. Access the demo in your browser at the specified URL.


## Dependencies

- Vue.js
- PrimeVue
- N3
- Fetch API

## License

This project is licensed under the MIT License.

## Acknowledgements

- Vue.js
- PrimeVue
- N3.js
- Fetch API
- n3extensions.ts by Christoph Braun https://github.com/uvdsl

## Authors

- Valentin Betz
- Christoph Braun https://github.com/uvdsl