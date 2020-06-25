import { connectionOracle } from '../database/connection';

import UserStatus from '../model/userStatus';

interface RetornoDbStatus {
  USUARIO: string;
  USUARIO_TERMINAL: string;
  USERAGENT: string;
  DOMINIO: string;
  DESTINO: string;
  TIPO: string;
  ESTADO: string;
}

interface MethodGetStatusByDomain {
  domain: string;
}

class UserStatusRepository {
  public async getStatusByDomain({
    domain,
  }: MethodGetStatusByDomain): Promise<UserStatus[] | undefined> {
    const userStatusList = await connectionOracle.raw<RetornoDbStatus[]>(`
      select
          u.vch_username as usuario,
          u2.vch_username as usuario_terminal,
          ssl.vch_useragent as useragent,
          d.vch_domain as dominio,
          ac.vch_originalto as destino,
          replace(replace(ac.int_calltype, 6, 'Discada'), 7, 'Recebida') as tipo,
          replace(replace(replace(replace(replace(ac.int_state, 3, 'Conectado'), 2, 'Chamando'), 1, 'Tentando'), 0, 'Conexão'), 4, 'Espera') as estado
      from
          tbl_sys_user u,
          tbl_sys_domain d,
          tbl_pbx_pbxuser pu
      FULL OUTER JOIN tbl_pbx_terminal t
          ON t.int_pbxuser_key = pu.int_pbxuser_key
      FULL OUTER JOIN tbl_pbx_pbxuserterminal put
          ON put.int_terminal_key = t.int_terminal_key
      FULL OUTER JOIN tbl_pbx_pbxuser pu2
          ON pu2.int_pbxuser_key = put.int_pbxuser_key
      FULL OUTER JOIN tbl_sys_user u2
          ON u2.int_user_key = pu2.int_user_key
      FULL OUTER JOIN tbl_pbx_address a
          ON a.int_pbxuser_key = pu.int_pbxuser_key and a.int_type = 2
      FULL OUTER JOIN tbl_pbx_activecall ac
          ON ac.int_address_key = a.int_address_key,
          tbl_sys_sessionlog sl,
          tbl_sys_sipsessionlog ssl
      where
          u.int_user_key = pu.int_user_key and
          u.int_domain_key = d.int_domain_key and
          sl.int_user_key = u.int_user_key and
          ssl.int_sessionlog_key = sl.int_sessionlog_key and
          u.int_active = 1 and
          u.int_agentuser in (0, 7) and
          d.vch_domain = '${domain}'
      order by
          u.vch_name
    `);

    if (userStatusList.length > 0) {
      const lista = userStatusList.map(userStatusItem => {
        const User = new UserStatus({
          usuario: userStatusItem.USUARIO,
          usuarioTerminal: userStatusItem.USUARIO_TERMINAL,
          userAgent: userStatusItem.USERAGENT,
          dominio: userStatusItem.DOMINIO,
          destino: userStatusItem.DESTINO,
          tipo: userStatusItem.TIPO,
          estado: userStatusItem.ESTADO,
        });

        return User;
      });

      return lista;
    }

    return undefined;
  }
}

export default UserStatusRepository;
