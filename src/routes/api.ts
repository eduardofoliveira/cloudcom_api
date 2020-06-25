import { Router } from 'express';

import basixController from '../controller/basixController';
import pipedriveController from '../controller/pipedriveController';

const routes = Router();

routes.get('/integracao/pipedrive', pipedriveController.index);

routes.get(
  '/chamada/:from/:to/:username/:domain/:callid/:event',
  basixController.index,
);

routes.post('/auth', (req, res) => {
  res.send();
  // retornar token JWT
});

routes.post('/subscribe', (req, res) => {
  res.send();
  // url = http://bpp.com.br/eventos - POST - Json body
  // events = registrations, calls, both
});

export default routes;
