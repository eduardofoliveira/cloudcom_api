import { Router } from 'express';

import basixController from '../controller/basixController';
import pipedriveController from '../controller/pipedriveController';

const routes = Router();

routes.get('/integracao/pipedrive', pipedriveController.index);

routes.get(
  '/chamada/:from/:to/:username/:domain/:callid/:event',
  basixController.index,
);

routes.post('/users/list', basixController.listUserAddress);

routes.post('/auth', (req, res) => {
  res.send();
});

routes.post('/subscribe', basixController.subscribe);
routes.post('/unsubscribe', basixController.unsubscribe);

export default routes;
