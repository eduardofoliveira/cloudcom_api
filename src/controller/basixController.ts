import { Request, Response } from 'express';

import UserAddressRepository from '../repository/userAddressRepository';
import eventSubscriber, { Events, Lista } from '../service/eventSubscriber';

export default {
  index(req: Request, res: Response): Response {
    const lista = eventSubscriber.list();
    const returnList = lista.map((item: Lista) => {
      return {
        domain: item.domain,
        subscriber: {
          events: item.subscriber.events,
          url: item.subscriber.url,
        },
      };
    });
    if (returnList.length > 0) {
      return res.json(returnList);
    }
    return res.status(404).json({ message: 'Não há event subscribers' });
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
