import { Router } from 'express';

import basixController from '../controller/basixController';
import pipedriveController from '../controller/pipedriveController';

const routes = Router();

routes.get('/integracao/pipedrive', pipedriveController.index);

routes.get(
  '/chamada/:from/:to/:username/:domain/:callid/:event',
  basixController.index,
);

export default routes;
