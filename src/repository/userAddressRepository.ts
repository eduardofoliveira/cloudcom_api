import { connectionOracle } from '../database/connection';

import UserAddress from '../model/userAddress';

interface RetornoDbList {
  USUARIO: string;
  RAMAL: string;
}

interface ListMethod {
  domain: string;
}

class UserAddressRepository {
  public async list({
    domain,
  }: ListMethod): Promise<UserAddress[] | undefined> {
    const result = await connectionOracle.raw<RetornoDbList[]>(`
      select
          u.vch_username as usuario,
          a.vch_address as ramal
      from
          tbl_sys_domain d,
          tbl_sys_user u,
          tbl_pbx_pbxuser pu
      FULL OUTER JOIN tbl_pbx_address a
        ON a.int_pbxuser_key = pu.int_pbxuser_key and a.int_type = 1
      where
          d.int_domain_key = u.int_domain_key and
          u.int_user_key = pu.int_user_key and
          u.int_agentuser = 0 and
          u.int_active = 1 and
          d.vch_domain = '${domain}'
      order by
          u.vch_username
    `);

    if (result.length > 0) {
      const listUserAddress = result.map(item => {
        return new UserAddress({
          usuario: item.USUARIO,
          ramal: item.RAMAL,
        });
      });

      return listUserAddress;
    }

    return undefined;
  }
}

export default UserAddressRepository;
