import fs from 'fs';
import path from 'path';

import AWS from 'aws-sdk';

import PublishPipedriveRepository from '../repository/publishPipedriveRepository';
import ChamadaBasixRepository from '../repository/chamadaBasixRepository';
import UserRepository from '../repository/userRepository';
import PipedriveService from './pipedriveService';

const s3 = new AWS.S3({
  signatureVersion: 'v4',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

class PipedriveUploadFile {
  public async execute(): Promise<void> {
    const publishPipedriveRepository = new PublishPipedriveRepository();
    const publishPipedrives = await publishPipedriveRepository.listPendentUpload();

    if (publishPipedrives) {
      const chamadaBasixRepository = new ChamadaBasixRepository();
      const userRepository = new UserRepository();

      interface MapItem {
        gravacao: string;
        token: string;
        url: string;
        path: string;
        pipedrive_calllog_id: string;
      }

      const baixando = publishPipedrives.map<Promise<MapItem>>(
        publishPipedrive => {
          return new Promise(async (resolve, reject) => {
            const chamadaBasix = await chamadaBasixRepository.findOne({
              calllogkey: publishPipedrive.calllogkey,
            });

            const user = await userRepository.findOne({
              id: publishPipedrive.fk_user_id,
            });

            const Bucket = chamadaBasix?.bucket ?? 'gravacoesbasix';

            s3.getObject(
              {
                Bucket,
                Key: `mp3/${chamadaBasix?.path}/${chamadaBasix?.fileName}.mp3`,
              },
              (error, data) => {
                if (error) {
                  reject(error);
                }
                fs.writeFileSync(
                  path.resolve(
                    __dirname,
                    '..',
                    'records',
                    `${chamadaBasix?.fileName}.mp3`,
                  ),
                  data.Body,
                );
                resolve({
                  gravacao: 'OK',
                  token: user?.token ?? '',
                  url: user?.urlPipedrive ?? '',
                  pipedrive_calllog_id:
                    publishPipedrive.pipedrive_calllog_id ?? '',
                  path: path.resolve(
                    __dirname,
                    '..',
                    'records',
                    `${chamadaBasix?.fileName}.mp3`,
                  ),
                });
              },
            );
          });
        },
      );

      const gravacoesProntas = await Promise.all(baixando);

      if (gravacoesProntas.length > 0) {
        const fazendoUpload = gravacoesProntas.map(async gravacao => {
          const pipedriveService = new PipedriveService({
            token: gravacao.token,
            url: gravacao.url,
          });

          const uploaded = pipedriveService.uploadRecord({
            path: gravacao.path,
            pipedrive_calllog_id: gravacao.pipedrive_calllog_id,
          });

          return uploaded;
        });

        const uploadTerminado = await Promise.all(fazendoUpload);

        if (uploadTerminado) {
          const atualizando = uploadTerminado.map(pipedrive_id => {
            return publishPipedriveRepository.updateUploaded({
              pipedrive_calllog_id: pipedrive_id,
            });
          });

          await Promise.all(atualizando);
        }
      }
    }
  }
}

export default PipedriveUploadFile;
