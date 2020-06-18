/* eslint-disable no-param-reassign */
import PublishPipedriveRepository from '../repository/publishPipedriveRepository';
import ChamadaBasixRepository from '../repository/chamadaBasixRepository';
import UserRepository from '../repository/userRepository';
import PipedriveService from './pipedriveService';

class VerifyPublishPipedrive {
  public execute(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const publishPipedriveRepository = new PublishPipedriveRepository();
        const publishPipedrives = await publishPipedriveRepository.listPendent();

        if (publishPipedrives) {
          const chamadaBasixRepository = new ChamadaBasixRepository();
          const userRepository = new UserRepository();

          const awaitingPublish = publishPipedrives.map(publishPipedrive => {
            return new Promise(async (resolvePublish, rejectPublish) => {
              try {
                const chamadaBasix = await chamadaBasixRepository.findOne({
                  calllogkey: publishPipedrive.calllogkey,
                });

                if (chamadaBasix) {
                  const user = await userRepository.findOne({
                    id: publishPipedrive.fk_user_id,
                  });

                  if (user) {
                    const pipedriveService = new PipedriveService({
                      token: user.token,
                      url: user.urlPipedrive,
                    });

                    const person_id = await pipedriveService.searchPerson({
                      number: chamadaBasix.endereco,
                    });

                    if (person_id) {
                      const pipedrive_calllog_id = await pipedriveService.addCallLog(
                        {
                          tipo: chamadaBasix.tipo,
                          start_time: chamadaBasix.inicio,
                          end_time: chamadaBasix.termino,
                          from_phone_number: chamadaBasix.ddr,
                          to_phone_number: chamadaBasix.endereco,
                          outcome: 'connected',
                          subject: '',
                          person_id,
                        },
                      );

                      if (pipedrive_calllog_id) {
                        publishPipedrive.pipedrive_calllog_id = pipedrive_calllog_id;
                        publishPipedriveRepository.update(publishPipedrive);
                      }
                      resolvePublish(true);
                    } else {
                      resolvePublish(true);
                    }
                  } else {
                    resolvePublish(true);
                  }
                } else {
                  resolvePublish(true);
                }
              } catch (error) {
                rejectPublish(error);
              }
            });
          });

          await Promise.all(awaitingPublish);
          resolve(true);
        } else {
          resolve(true);
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default VerifyPublishPipedrive;
