import { Router } from 'express';
// import axios from 'axios';
// import { format, addMinutes, addHours } from 'date-fns';

import basixController from '../controller/basixController';
import pipedriveController from '../controller/pipedriveController';

// const api = axios.create({
//   baseURL: 'https://api.pipedrive.com/v1',
// });

const routes = Router();

routes.get('/integracao/pipedrive', pipedriveController.index);
// routes.get(
//   '/integracao/pipedrive',
//   async (req, res): Promise<Response | undefined | void> => {
//     // const { from, to, deal_id, person_id, basix_id } = req.query;
//     const { from, to, deal_id, person_id } = req.query;

//     if (deal_id && deal_id !== 'undefined') {
//       await api.post(
//         `/callLogs`,
//         {
//           user_id: from,
//           subject: `Click to Call para ${to}`,
//           from_phone_number: '551137115000',
//           to_phone_number: to,
//           start_time: format(addHours(new Date(), 3), 'yyyy-MM-dd HH:mm:ss'),
//           end_time: format(
//             addHours(addMinutes(new Date(), 2), 3),
//             'yyyy-MM-dd HH:mm:ss',
//           ),
//           outcome: 'connected',
//           deal_id,
//         },
//         {
//           params: {
//             api_token: 'f40e7b20625455a47957b45fac582f23f3a7a24d',
//           },
//         },
//       );

//       return res.redirect(
//         // Retornar para o ID do negocio
//         `https://cloudcomunicacao.pipedrive.com/deal/${deal_id}`,
//       );
//     }

//     if (person_id && person_id !== 'undefined') {
//       await api.post(
//         `/callLogs`,
//         {
//           user_id: '11566003',
//           subject: `Click to Call para ${to}`,
//           from_phone_number: '551137115000',
//           to_phone_number: to,
//           start_time: format(addHours(new Date(), 3), 'yyyy-MM-dd HH:mm:ss'),
//           end_time: format(
//             addHours(addMinutes(new Date(), 2), 3),
//             'yyyy-MM-dd HH:mm:ss',
//           ),
//           outcome: 'connected',
//           person_id,
//         },
//         {
//           params: {
//             api_token: 'f40e7b20625455a47957b45fac582f23f3a7a24d',
//           },
//         },
//       );

//       return res.redirect(
//         // Retornar para o ID do contato
//         `https://cloudcomunicacao.pipedrive.com/person/${person_id}`,
//       );
//     }

//     if (deal_id === 'undefined' && person_id === 'undefined') {
//       // Procurar o ID do lead e direcionar para o Inbox
//       // Neste caso fazer somente a chamada porem não salvar a gravação no Pipedrive pois lead não possui gravação.

//       return res.redirect(
//         `https://cloudcomunicacao.pipedrive.com/leads/inbox/b4559b80-ac28-11ea-b67e-0d7b8516cbb9`,
//       );
//     }

//     return res.send();
//   },
// );

routes.get(
  '/chamada/:from/:to/:username/:domain/:callid/:event',
  basixController.index,
);

export default routes;
