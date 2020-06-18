import { connectionZabbix } from '../database/connection';

import PublishPipedrive from '../model/publishPipedrive';

interface RetornoDbFindOne {
  id: number;
  fk_user_id: number;
  callid: string;
  calllogkey: string;
  incall: number;
  ready: number;
  uploaded: number;
  create_at: Date;
  pipedrive_calllog_id: string;
}

interface MethodFindOne {
  callid?: string;
  calllogkey?: string;
  pipedrive_calllog_id?: string;
}

class PublishPipedriveRepository {
  public async insert({
    fk_user_id,
    callid,
    calllogkey,
    incall,
    ready,
    uploaded,
    pipedrive_calllog_id = '',
  }: PublishPipedrive): Promise<PublishPipedrive | undefined> {
    const [id] = await connectionZabbix('publish_pipedrive').insert({
      fk_user_id,
      callid,
      calllogkey,
      incall,
      ready,
      uploaded,
      pipedrive_calllog_id,
    });

    if (id) {
      const [register] = await connectionZabbix
        .select<RetornoDbFindOne[]>('*')
        .from('publish_pipedrive')
        .where({
          id,
        });

      if (register) {
        const publishPipedrive = new PublishPipedrive({
          id: register.id,
          fk_user_id: register.fk_user_id,
          callid: register.callid,
          calllogkey: register.calllogkey,
          incall: register.incall,
          ready: register.ready,
          uploaded: register.uploaded,
          create_at: register.create_at,
          pipedrive_calllog_id: register.pipedrive_calllog_id,
        });

        return publishPipedrive;
      }
    }

    return undefined;
  }

  public async findOne({
    callid,
    calllogkey,
    pipedrive_calllog_id,
  }: MethodFindOne): Promise<PublishPipedrive | undefined> {
    let search = {};

    if (callid) {
      search = { ...search, callid };
    }
    if (calllogkey) {
      search = { ...search, calllogkey };
    }
    if (pipedrive_calllog_id) {
      search = { ...search, pipedrive_calllog_id };
    }

    const [register] = await connectionZabbix
      .select<RetornoDbFindOne[]>('*')
      .from('publish_pipedrive')
      .where(search);

    if (register) {
      const publishPipedrive = new PublishPipedrive({
        id: register.id,
        fk_user_id: register.fk_user_id,
        callid: register.callid,
        calllogkey: register.calllogkey,
        incall: register.incall,
        ready: register.ready,
        uploaded: register.uploaded,
        create_at: register.create_at,
        pipedrive_calllog_id: register.pipedrive_calllog_id,
      });

      return publishPipedrive;
    }
    return undefined;
  }

  public async listPendent(): Promise<PublishPipedrive[] | undefined> {
    const registers = await connectionZabbix
      .select<RetornoDbFindOne[]>('*')
      .from('publish_pipedrive')
      .where({
        ready: 1,
        pipedrive_calllog_id: '',
      });

    if (registers.length > 0) {
      const publishPipedrives = registers.map(register => {
        const publishPipedrive = new PublishPipedrive({
          id: register.id,
          fk_user_id: register.fk_user_id,
          callid: register.callid,
          calllogkey: register.calllogkey,
          incall: register.incall,
          ready: register.ready,
          uploaded: register.uploaded,
          create_at: register.create_at,
          pipedrive_calllog_id: register.pipedrive_calllog_id,
        });

        return publishPipedrive;
      });

      return publishPipedrives;
    }
    return undefined;
  }

  public async listPendentUpload(): Promise<PublishPipedrive[] | undefined> {
    const registers = await connectionZabbix
      .select<RetornoDbFindOne[]>('*')
      .from('publish_pipedrive')
      .where({ uploaded: 0, ready: 1 })
      .andWhereNot({
        pipedrive_calllog_id: '',
      });

    if (registers.length > 0) {
      const publishPipedrives = registers.map(register => {
        const publishPipedrive = new PublishPipedrive({
          id: register.id,
          fk_user_id: register.fk_user_id,
          callid: register.callid,
          calllogkey: register.calllogkey,
          incall: register.incall,
          ready: register.ready,
          uploaded: register.uploaded,
          create_at: register.create_at,
          pipedrive_calllog_id: register.pipedrive_calllog_id,
        });

        return publishPipedrive;
      });

      return publishPipedrives;
    }
    return undefined;
  }

  public async update(publishPipedrive: PublishPipedrive): Promise<boolean> {
    const [publishExists] = await connectionZabbix
      .select<RetornoDbFindOne[]>('*')
      .from('publish_pipedrive')
      .where({
        id: publishPipedrive.id,
      });

    if (publishExists) {
      await connectionZabbix('publish_pipedrive')
        .update({
          fk_user_id: publishPipedrive.fk_user_id,
          callid: publishPipedrive.callid,
          calllogkey: publishPipedrive.calllogkey,
          incall: publishPipedrive.incall,
          ready: publishPipedrive.ready,
          uploaded: publishPipedrive.uploaded,
          pipedrive_calllog_id: publishPipedrive.pipedrive_calllog_id,
        })
        .where({ id: publishPipedrive.id });

      return true;
    }

    return false;
  }

  public async updateUploaded({
    pipedrive_calllog_id,
  }: {
    pipedrive_calllog_id: string;
  }): Promise<boolean> {
    const [publishExists] = await connectionZabbix
      .select<RetornoDbFindOne[]>('*')
      .from('publish_pipedrive')
      .where({
        pipedrive_calllog_id,
      });

    if (publishExists) {
      await connectionZabbix('publish_pipedrive')
        .update({
          uploaded: 1,
        })
        .where({ pipedrive_calllog_id: publishExists.pipedrive_calllog_id });

      return true;
    }

    return false;
  }
}

export default PublishPipedriveRepository;
