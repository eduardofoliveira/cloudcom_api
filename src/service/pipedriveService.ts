import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';
import { format, addHours } from 'date-fns';

const api = axios.create({
  baseURL: 'https://api.pipedrive.com/v1',
});

interface MethodAddCallLog {
  tipo: string;
  subject: string;
  from_phone_number: string;
  to_phone_number: string;
  start_time: Date;
  end_time: Date;
  outcome: string;
  person_id: number;
}

interface MethodUploadRecord {
  path: string;
  pipedrive_calllog_id: string;
}

class PipedriveService {
  token: string;

  url: string;

  constructor({
    token,
    url,
  }: Omit<PipedriveService, 'searchPerson' | 'addCallLog' | 'uploadRecord'>) {
    this.token = token;
    this.url = url;
  }

  public async searchPerson({
    number,
  }: {
    number: string;
  }): Promise<number | undefined> {
    const { data } = await api.get('/itemSearch', {
      params: {
        api_token: this.token,
        term: number,
      },
    });

    if (data?.data?.items?.length > 0) {
      const lista = data?.data?.items;
      const [person] = lista.filter(
        (item: { item: { type: string } }) => item.item.type === 'person',
      );

      if (person) {
        return person.item.id;
      }

      return undefined;
    }
    return undefined;
  }

  public async addCallLog({
    tipo,
    subject,
    from_phone_number,
    to_phone_number,
    start_time,
    end_time,
    outcome,
    person_id,
  }: MethodAddCallLog): Promise<string> {
    let subjectFromDetails = null;

    if (!subject) {
      subjectFromDetails =
        tipo === 'Recebida'
          ? `Chamada recedida de ${to_phone_number}`
          : `Chamada originada para ${to_phone_number}`;
    } else {
      subjectFromDetails = subject;
    }

    let from_number = '';
    let to_number = '';

    if (tipo === 'Recebida') {
      to_number = from_phone_number;
      from_number = to_phone_number;
    } else {
      to_number = to_phone_number;
      from_number = from_phone_number;
    }

    const result = await api.post(
      `/callLogs`,
      {
        subject: subjectFromDetails,
        from_phone_number: from_number,
        to_phone_number: to_number,
        start_time: format(addHours(start_time, 3), 'yyyy-MM-dd HH:mm:ss'),
        end_time: format(addHours(end_time, 3), 'yyyy-MM-dd HH:mm:ss'),
        outcome,
        person_id,
      },
      {
        params: {
          api_token: this.token,
        },
      },
    );

    const { data } = result;
    return data.data.id;
  }

  public async uploadRecord({
    path,
    pipedrive_calllog_id,
  }: MethodUploadRecord): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        fs.readFile(path, async (err, imageData) => {
          if (err) {
            reject(err);
          }
          const form = new FormData();
          form.append('file', imageData, {
            filepath: path,
            contentType: 'audio/mpeg3',
          });

          const { data } = await api.post(
            `/callLogs/${pipedrive_calllog_id}/recordings`,
            form,
            {
              headers: form.getHeaders(),
              params: {
                api_token: this.token,
              },
            },
          );

          if (data.success === true) {
            fs.unlinkSync(path);
            resolve(pipedrive_calllog_id);
          }
          reject(new Error('Upload não finalizado'));
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default PipedriveService;
