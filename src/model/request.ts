import { connectionZabbix } from '../database/connection';

interface RequestObj {
  callid: string;
  callLogKey: string;
  callerID: string;
  calledNum: string;
  username: string;
  domain: string;
  recordEnable: string;
  path: string;
  fileName: string;
  clickToCall: string;
  pipedrive_calllog_id: string | null;
}

interface Retorno {
  id: string;
  callid: string;
  calllogkey: string;
  callerid: string;
  callednum: string;
  username: string;
  domain: string;
  record_enable: string;
  path: string;
  file_name: string;
  incall: string;
  click_to_call: string;
  pipedrive_calllog_id: string | null;
}

interface CallsProcessing {
  callid: string;
  calllogkey?: string;
  click_to_call: number;
}

interface UpdateFileName {
  calllogkey: string;
  path: string;
  fileName: string;
}

class Request {
  public insert({
    callid,
    callLogKey,
    callerID,
    calledNum,
    username,
    domain,
    recordEnable,
    path,
    fileName,
    clickToCall,
    pipedrive_calllog_id,
  }: RequestObj): Promise<number[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const request = await connectionZabbix<Retorno>('request').insert({
          callid,
          calllogkey: callLogKey,
          callerid: callerID,
          callednum: calledNum,
          username,
          domain,
          record_enable: recordEnable,
          path,
          file_name: fileName,
          click_to_call: clickToCall,
          pipedrive_calllog_id,
        });

        resolve(request);
      } catch (error) {
        reject(error);
      }
    });
  }

  public setEndCall(id: string): Promise<number> {
    return new Promise(async (resolve, reject) => {
      try {
        const request = await connectionZabbix('request')
          .where({ callid: id })
          .update({
            incall: 0,
          });
        resolve(request);
      } catch (error) {
        reject(error);
      }
    });
  }

  public listCallRecordProcessing(): Promise<CallsProcessing[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const naoProcessadas = await connectionZabbix
          .select('calllogkey', 'click_to_call')
          .from('request')
          .where({
            record_enable: 1,
            incall: 0,
            ready: 0,
            uploaded: 0,
          });

        resolve(naoProcessadas);
      } catch (error) {
        reject(error);
      }
    });
  }

  public updateFileName({
    calllogkey,
    path,
    fileName,
  }: UpdateFileName): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await connectionZabbix('request')
          .where({
            calllogkey,
          })
          .update({
            path,
            file_name: fileName,
            ready: 1,
          });
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default new Request();
