import { Request, Response } from 'express';

import UserAddressRepository from '../repository/userAddressRepository';
import eventSubscriber, { Events } from '../service/eventSubscriber';

export default {
  async index(req: Request, res: Response): Promise<Response> {
    return res.json(eventSubscriber.list());
  },

  async subscribe(req: Request, res: Response): Promise<Response> {
    const { domain, url, events } = req.body;

    if (Object.keys(Events).indexOf(events) === -1) {
      return res
        .status(400)
        .json({ error: 'Evento inválido', 'eventos válidos': Events });
    }

    eventSubscriber.subscribe({
      domain,
      url,
      events: Events[Object.keys(Events)[Object.keys(Events).indexOf(events)]],
    });

    return res.send();
  },

  async unsubscribe(req: Request, res: Response): Promise<Response> {
    const { domain } = req.body;

    eventSubscriber.unsubscribe({
      domain,
    });

    return res.send();
  },

  async listUserAddress(req: Request, res: Response): Promise<Response> {
    const { domain } = req.body;

    if (!domain) {
      res.status(400).json({ error: 'domínio é necessário' });
    }

    const userAddressRepository = new UserAddressRepository();
    const userAddress = await userAddressRepository.list({ domain });

    if (userAddress) {
      return res.json(userAddress);
    }
    return res
      .status(404)
      .json({ error: 'lista não encontrada para este domínio' });
  },
};
