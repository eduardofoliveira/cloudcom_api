class PublishPipedrive {
  id?: number;

  fk_user_id: number;

  callid: string;

  calllogkey: string;

  incall: number;

  ready: number;

  uploaded: number;

  pipedrive_calllog_id?: string;

  create_at?: Date;

  constructor({
    id,
    fk_user_id,
    callid,
    calllogkey,
    incall,
    ready,
    uploaded,
    pipedrive_calllog_id,
    create_at,
  }: PublishPipedrive) {
    this.id = id;
    this.fk_user_id = fk_user_id;
    this.callid = callid;
    this.calllogkey = calllogkey;
    this.incall = incall;
    this.ready = ready;
    this.uploaded = uploaded;
    this.pipedrive_calllog_id = pipedrive_calllog_id;
    this.create_at = create_at;
  }
}

export default PublishPipedrive;
