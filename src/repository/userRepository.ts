import { connectionZabbix } from '../database/connection';

import User from '../model/user';

interface FindOneMethod {
  id?: number;
  username?: string;
  domain?: string;
}

interface RetornoDbFindOne {
  id: number;
  username: string;
  domain: string;
  token: string;
  url_pipedrive: string;
  email: string;
  hash_password: string;
}

class UserRepository {
  public async findOne({
    id,
    username,
    domain,
  }: FindOneMethod): Promise<User | undefined> {
    let where = {};
    if (id) {
      where = { ...where, id };
    } else {
      where = { ...where, username, domain };
    }

    const [user] = await connectionZabbix
      .column<RetornoDbFindOne[]>(
        'id',
        'username',
        'domain',
        'token',
        'url_pipedrive',
        'email',
        'hash_password',
      )
      .select()
      .from('users')
      .where(where);

    if (user) {
      const usuario = new User({
        id: user.id,
        username: user.username,
        domain: user.domain,
        token: user.token,
        urlPipedrive: user.url_pipedrive,
        email: user.email,
        password: user.hash_password,
      });

      return usuario;
    }

    return undefined;
  }

  public async find({ where }: { where: any }): Promise<User[] | undefined> {
    const users = await await connectionZabbix
      .select<RetornoDbFindOne[]>('*')
      .from('users')
      .where(where);

    if (users.length > 0) {
      const usuarios = users.map(user => {
        const usuario = new User({
          id: user.id,
          username: user.username,
          domain: user.domain,
          token: user.token,
          urlPipedrive: user.url_pipedrive,
          email: user.email,
          password: user.hash_password,
        });

        return usuario;
      });

      return usuarios;
    }

    return undefined;
  }

  public async disable(user: User): Promise<boolean> {
    const [userExists] = await connectionZabbix
      .column<RetornoDbFindOne[]>(
        'id',
        'username',
        'domain',
        'token',
        'url_pipedrive',
        'email',
        'hash_password',
      )
      .select()
      .from('users')
      .where({
        id: user.id,
      });

    if (userExists) {
      await connectionZabbix('users')
        .update({ active: 0 })
        .where('id', userExists.id);
      return true;
    }

    return false;
  }

  public async remove(user: User): Promise<boolean> {
    const [userExists] = await connectionZabbix
      .column<RetornoDbFindOne[]>(
        'id',
        'username',
        'domain',
        'token',
        'url_pipedrive',
        'email',
        'hash_password',
      )
      .select()
      .from('users')
      .where({
        id: user.id,
      });

    if (userExists) {
      await connectionZabbix('users').where('id', userExists.id).del();
      return true;
    }

    return false;
  }
}

export default UserRepository;
