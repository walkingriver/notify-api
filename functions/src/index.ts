import * as functions from 'firebase-functions';
import { EventsService } from './event-service';

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

import * as express from 'express';
import * as cors from 'cors';
import { EventResponse, AddressDto, EndpointDto } from './interfaces';
import { DispatcherService } from './dispatcher-service';

const app = express();
const service = new EventsService();
const dispatcher = new DispatcherService();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// Add middleware to authenticate requests
// app.use(myMiddleware);

// build multiple CRUD interfaces:
app.get('/latest', (req, res) => {
  const event = service.getLatest();
  const id = event.id;
  const prevId = id - 1;
  const since = event.created.valueOf();
  const result: EventResponse = {
    event: event,
    links: {
      acknowledgements: `/acknowledgements/${id}/${since}`, 
      self: `/event/${id}`,
      next: prevId ? `/event/${prevId}` : null
    }
  };
  return res.send(result);
});

app.get('/since/:since', (req, res) => {
  const ms = +req.params.since;
  console.log(ms);
  const since = new Date(ms);
  const result = service.getSince(since);
  return res.send(result);
});

app.get('/event/:id', (req, res) => {
  const id = req.params.id;
  const prevId = id - 1;
  const event = service.getById(id);
  console.log('Got Event:', JSON.stringify(event));
  const since = event.created.valueOf();
  const result: EventResponse = {
    event: event,
    links: {
      acknowledgements: `/acknowledgements/${id}/${since}`, 
      self: `/event/${id}`,
      next: prevId ? `/event/${prevId}` : null
    }
  };

  return res.send(result);
});

app.get('/acknowledgements/:id/:since', (req, res) => {
  const ms = +req.params.since;
  console.log(ms);
  const since = new Date(ms);
  console.log('Acks Since:', since.toUTCString());
  return res.send(service.getAcknowledgements(req.params.id, since));
});

// app.get('/', (req, res) => res.send(service.list()));

app.post('/addresses/validate', (req, res) => {
  const address: AddressDto = JSON.parse(req.body);
  console.log('Validating Address: ', JSON.stringify(address));
  return res.send(dispatcher.validate(address));
});

app.post('/endpoints', (req,res) => {
  const endpoint: EndpointDto = JSON.parse(req.body);
  console.log('Creating Endpoint: ', JSON.stringify(endpoint));
  return res.send(dispatcher.addEndpoint(endpoint));
});

app.put('/endpoints/:id', (req,res) => {
  const endpoint: EndpointDto = JSON.parse(req.body);
  console.log('Updating Endpoint: ', JSON.stringify(endpoint));
  return res.send(dispatcher.updateEndpoint(endpoint));
});

app.put('/endpoints/:id/provision', (req,res) => {
  const endpoint: EndpointDto = JSON.parse(req.body);
  console.log('Provisioning Endpoint: ', JSON.stringify(endpoint));
  return res.send(dispatcher.provisionEndpoint(endpoint));
});

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);


