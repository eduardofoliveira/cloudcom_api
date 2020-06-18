import { Request, Response } from 'express';
import axios from 'axios';

import Pipedrive from '../service/pipedrive';
import UserRepository from '../repository/userRepository';

const api = axios.create({
  baseURL: 'http://login.cloudcom.com.br/basix/webservices',
});

export default {
  async index(req: Request, res: Response): Promise<void> {
    const { from, to, deal_id, person_id, basix_id } = req.query;
    const [username, domain] = basix_id.toString().split('@');

    const userRepository = new UserRepository();

    const user = await userRepository.findOne({
      username,
      domain,
    });

    const token = Buffer.from(
      `${process.env.WS_BASIX_USER}:${process.env.WS_BASIX_PASS}`,
      'utf8',
    ).toString('base64');

    await api.get(`/call/makecall/${domain}/${username}/${to}`, {
      headers: {
        Authorization: `Basic ${token}`,
      },
    });

    if (user) {
      const pipedrive = new Pipedrive({
        token: user.token,
        url: user.urlPipedrive,
        from: from.toString(),
        dealId: parseInt(deal_id.toString(), 10),
        personId: parseInt(person_id.toString(), 10),
        to: to.toString(),
      });

      res.redirect(pipedrive.returnUrl());
    }
  },
};
