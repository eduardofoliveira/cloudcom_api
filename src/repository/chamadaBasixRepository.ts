import { parse, format, subMinutes } from 'date-fns';
import { connectionOracle } from '../database/connection';

import ChamadaBasix from '../model/chamadaBasix';

interface RetornoDbFindOne {
  INT_CALLLOG_KEY: string;
  VCH_CALLID: string;
  INICIO: string;
  TERMINO: string;
  TIPO: string;
  ENDERECO: string;
  DDR: string;
  VCH_USERNAME: string;
  VCH_DOMAIN: string;
  VCH_PATH: string;
  VCH_RECFILENAME: string;
  BUCKET: string;
}

interface MethodFindLastTenMinutes {
  username: string;
  domain: string;
}

class ChamadaBasixRepository {
  public async findOne({
    calllogkey,
  }: {
    calllogkey: string;
  }): Promise<ChamadaBasix | undefined> {
    const [chamada] = await connectionOracle.raw<RetornoDbFindOne[]>(`
      select
          cl.int_calllog_key,
          cl.vch_callid,
          TO_CHAR(cl.dtm_from_date,'DD-MM-YYYY HH24:MI:SS') as inicio,
          TO_CHAR(cl.dtm_until_date,'DD-MM-YYYY HH24:MI:SS') as termino,
          replace(replace(cl.int_calltype, 7, 'Recebida'), 6, 'Discada') as tipo,
          cl.vch_display as endereco,
          cl.vch_myaddress as ddr,
          u.vch_username,
          d.vch_domain,
          rf.vch_path,
          rf.vch_recfilename,
          (select
              pbxp.vch_s3bucketname
          from
              tbl_pbx_pbx pbx,
              tbl_pbx_pbxpreference pbxp,
              tbl_sys_user suser
          where
              pbx.int_pbx_key = pbxp.int_pbx_key and
              pbx.int_user_key = suser.int_user_key and
              suser.int_domain_key = d.int_domain_key) as bucket
      from
          tbl_pbx_calllog cl,
          tbl_pbx_pbxuser pu,
          tbl_sys_user u,
          tbl_sys_domain d,
          tbl_sys_recordfile rf
      where
          d.int_domain_key = u.int_domain_key and
          u.int_user_key = pu.int_user_key and
          cl.int_pbxuser_key = pu.int_pbxuser_key and
          cl.int_calllog_key = rf.int_calllog_key and
          cl.int_calllog_key = '${calllogkey}'
    `);

    if (chamada) {
      const chamadaBasix = new ChamadaBasix({
        calllogkey: chamada.INT_CALLLOG_KEY,
        callid: chamada.VCH_CALLID,
        inicio: parse(chamada.INICIO, 'dd-MM-yyyy HH:mm:ss', new Date()),
        termino: parse(chamada.TERMINO, 'dd-MM-yyyy HH:mm:ss', new Date()),
        tipo: chamada.TIPO,
        endereco: chamada.ENDERECO,
        ddr: chamada.DDR,
        username: chamada.VCH_USERNAME,
        domain: chamada.VCH_DOMAIN,
        path: chamada.VCH_PATH,
        fileName: chamada.VCH_RECFILENAME,
        bucket: chamada.BUCKET,
      });

      return chamadaBasix;
    }

    return undefined;
  }

  public async findLastTenMinutes({
    username,
    domain,
  }: MethodFindLastTenMinutes): Promise<ChamadaBasix[] | undefined> {
    const agora = new Date();
    const inicio = format(subMinutes(agora, 10), 'dd-MM-yyyy HH:mm:ss');
    const termino = format(agora, 'dd-MM-yyyy HH:mm:ss');

    const chamadas = await connectionOracle.raw<RetornoDbFindOne[]>(`
      select
          cl.int_calllog_key,
          cl.vch_callid,
          TO_CHAR(cl.dtm_from_date,'DD-MM-YYYY HH24:MI:SS') as inicio,
          TO_CHAR(cl.dtm_until_date,'DD-MM-YYYY HH24:MI:SS') as termino,
          replace(replace(cl.int_calltype, 7, 'Recebida'), 6, 'Discada') as tipo,
          cl.vch_display as endereco,
          cl.vch_myaddress as ddr,
          u.vch_username,
          d.vch_domain,
          rf.vch_path,
          rf.vch_recfilename,
          (select
              pbxp.vch_s3bucketname
          from
              BASIXBRASTEL.tbl_pbx_pbx pbx,
              BASIXBRASTEL.tbl_pbx_pbxpreference pbxp,
              BASIXBRASTEL.tbl_sys_user suser
          where
              pbx.int_pbx_key = pbxp.int_pbx_key and
              pbx.int_user_key = suser.int_user_key and
              suser.int_domain_key = d.int_domain_key) as bucket
      from
          tbl_pbx_calllog cl,
          tbl_pbx_pbxuser pu,
          tbl_sys_user u,
          tbl_sys_domain d,
          tbl_sys_recordfile rf
      where
          d.vch_domain = '${domain}' and
          d.int_domain_key = u.int_domain_key and
          u.int_user_key = pu.int_user_key and
          cl.int_pbxuser_key = pu.int_pbxuser_key and
          cl.dtm_from_date BETWEEN TO_DATE('${inicio}', 'DD-MM-YYYY HH24:MI:SS') and
          TO_DATE('${termino}', 'DD-MM-YYYY HH24:MI:SS') and
          cl.int_calllog_key = rf.int_calllog_key and
          u.VCH_USERNAME in ('${username}')
    `);

    if (chamadas.length > 0) {
      const chamadasBasix = chamadas.map(chamada => {
        const chamadaBasix = new ChamadaBasix({
          calllogkey: chamada.INT_CALLLOG_KEY,
          callid: chamada.VCH_CALLID,
          inicio: parse(chamada.INICIO, 'dd-MM-yyyy HH:mm:ss', new Date()),
          termino: parse(chamada.TERMINO, 'dd-MM-yyyy HH:mm:ss', new Date()),
          tipo: chamada.TIPO,
          endereco: chamada.ENDERECO,
          ddr: chamada.DDR,
          username: chamada.VCH_USERNAME,
          domain: chamada.VCH_DOMAIN,
          path: chamada.VCH_PATH,
          fileName: chamada.VCH_RECFILENAME,
          bucket: chamada.BUCKET,
        });

        return chamadaBasix;
      });

      return chamadasBasix;
    }

    return undefined;
  }

  public async findLastOneHour({
    username,
    domain,
  }: MethodFindLastTenMinutes): Promise<ChamadaBasix[] | undefined> {
    const agora = new Date();
    const inicio = format(subMinutes(agora, 60), 'dd-MM-yyyy HH:mm:ss');
    const termino = format(agora, 'dd-MM-yyyy HH:mm:ss');

    const chamadas = await connectionOracle.raw<RetornoDbFindOne[]>(`
      select
          cl.int_calllog_key,
          cl.vch_callid,
          TO_CHAR(cl.dtm_from_date,'DD-MM-YYYY HH24:MI:SS') as inicio,
          TO_CHAR(cl.dtm_until_date,'DD-MM-YYYY HH24:MI:SS') as termino,
          replace(replace(cl.int_calltype, 7, 'Recebida'), 6, 'Discada') as tipo,
          cl.vch_display as endereco,
          cl.vch_myaddress as ddr,
          u.vch_username,
          d.vch_domain,
          rf.vch_path,
          rf.vch_recfilename,
          (select
              pbxp.vch_s3bucketname
          from
              BASIXBRASTEL.tbl_pbx_pbx pbx,
              BASIXBRASTEL.tbl_pbx_pbxpreference pbxp,
              BASIXBRASTEL.tbl_sys_user suser
          where
              pbx.int_pbx_key = pbxp.int_pbx_key and
              pbx.int_user_key = suser.int_user_key and
              suser.int_domain_key = d.int_domain_key) as bucket
      from
          tbl_pbx_calllog cl,
          tbl_pbx_pbxuser pu,
          tbl_sys_user u,
          tbl_sys_domain d,
          tbl_sys_recordfile rf
      where
          d.vch_domain = '${domain}' and
          d.int_domain_key = u.int_domain_key and
          u.int_user_key = pu.int_user_key and
          cl.int_pbxuser_key = pu.int_pbxuser_key and
          cl.dtm_from_date BETWEEN TO_DATE('${inicio}', 'DD-MM-YYYY HH24:MI:SS') and
          TO_DATE('${termino}', 'DD-MM-YYYY HH24:MI:SS') and
          cl.int_calllog_key = rf.int_calllog_key and
          u.VCH_USERNAME in ('${username}')
    `);

    if (chamadas.length > 0) {
      const chamadasBasix = chamadas.map(chamada => {
        const chamadaBasix = new ChamadaBasix({
          calllogkey: chamada.INT_CALLLOG_KEY,
          callid: chamada.VCH_CALLID,
          inicio: parse(chamada.INICIO, 'dd-MM-yyyy HH:mm:ss', new Date()),
          termino: parse(chamada.TERMINO, 'dd-MM-yyyy HH:mm:ss', new Date()),
          tipo: chamada.TIPO,
          endereco: chamada.ENDERECO,
          ddr: chamada.DDR,
          username: chamada.VCH_USERNAME,
          domain: chamada.VCH_DOMAIN,
          path: chamada.VCH_PATH,
          fileName: chamada.VCH_RECFILENAME,
          bucket: chamada.BUCKET,
        });

        return chamadaBasix;
      });

      return chamadasBasix;
    }

    return undefined;
  }
}

export default ChamadaBasixRepository;
