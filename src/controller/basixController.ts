import { Request, Response } from 'express';

export default {
  async index(req: Request, res: Response): Promise<void> {
    res.send();
  },
};
