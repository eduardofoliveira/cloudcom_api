import { connectionOracle } from '../database/connection';

interface Request {
  calllogkey?: string;
  callid?: string;
  username?: string;
}

interface RetornoDB {
  CALLLOG_KEY: string;
  CALLERID: string;
  CALLEDNUM: string;
  USERNAME: string;
  DOMAIN: string;
  RECORD_ENABLE: string;
  PATH: string;
  FILE_NAME: string;
}

class CallDetail {
  public getDetailCallID({ callid }: Request): Promise<RetornoDB[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const detalhes = await connectionOracle.raw<RetornoDB[]>(`
            select
                cl.int_calllog_key as calllog_key,
                cl.vch_display as callerid,
                cl.vch_myaddress as callednum,
                u.vch_username as username,
                d.vch_domain as domain,
                c.int_allowedrecordcall as record_enable,
                rf.vch_path as path,
                rf.vch_recfilename as file_name
            from
                tbl_pbx_calllog cl
            FULL OUTER JOIN tbl_sys_recordfile rf
                ON rf.int_calllog_key = cl.int_calllog_key,
                tbl_pbx_pbxuser pu,
                tbl_sys_user u,
                tbl_pbx_config c,
                tbl_sys_domain d
            where
                cl.int_pbxuser_key = pu.int_pbxuser_key and
                pu.int_user_key = u.int_user_key and
                pu.int_config_key = c.int_config_key and
                u.int_domain_key = d.int_domain_key and
                cl.vch_callid = '${callid}'
          `);
        resolve(detalhes);
      } catch (error) {
        reject(error);
      }
    });
  }

  public getDetail({ calllogkey }: Request): Promise<RetornoDB[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const detalhes = await connectionOracle.raw<RetornoDB[]>(`
            select
                cl.int_calllog_key as calllog_key,
                cl.vch_display as callerid,
                cl.vch_myaddress as callednum,
                u.vch_username as username,
                d.vch_domain as domain,
                c.int_allowedrecordcall as record_enable,
                rf.vch_path as path,
                rf.vch_recfilename as file_name
            from
                tbl_pbx_calllog cl
            FULL OUTER JOIN tbl_sys_recordfile rf
                ON rf.int_calllog_key = cl.int_calllog_key,
                tbl_pbx_pbxuser pu,
                tbl_sys_user u,
                tbl_pbx_config c,
                tbl_sys_domain d
            where
                cl.int_pbxuser_key = pu.int_pbxuser_key and
                pu.int_user_key = u.int_user_key and
                pu.int_config_key = c.int_config_key and
                u.int_domain_key = d.int_domain_key and
                cl.int_calllog_key = '${calllogkey}'
          `);
        resolve(detalhes);
      } catch (error) {
        reject(error);
      }
    });
  }

  public getDetailClickToCall({ username }: Request): Promise<RetornoDB[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const detalhes = await connectionOracle.raw<RetornoDB[]>(`
            select
                cl.int_calllog_key as calllog_key,
                cl.vch_display as callerid,
                cl.vch_myaddress as callednum,
                u.vch_username as username,
                d.vch_domain as domain,
                c.int_allowedrecordcall as record_enable,
                rf.vch_path as path,
                rf.vch_recfilename as file_name
            from
                tbl_pbx_calllog cl
            FULL OUTER JOIN tbl_sys_recordfile rf
                ON rf.int_calllog_key = cl.int_calllog_key,
                tbl_pbx_pbxuser pu,
                tbl_sys_user u,
                tbl_pbx_config c,
                tbl_sys_domain d
            where
                cl.int_pbxuser_key = pu.int_pbxuser_key and
                pu.int_user_key = u.int_user_key and
                pu.int_config_key = c.int_config_key and
                u.int_domain_key = d.int_domain_key and
                cl.dtm_until_date is null and
                u.vch_username = '${username}'
          `);
        resolve(detalhes);
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default new CallDetail();
