import ChamadaBasixRepository from '../repository/chamadaBasixRepository';
import UserRepository from '../repository/userRepository';
import PublishPipedriveRepository from '../repository/publishPipedriveRepository';

class VerifyRunningCalls {
  public async execute(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      try {
        const userRepository = new UserRepository();
        const usuarios = await userRepository.find({ where: { active: 1 } });

        if (usuarios) {
          const chamadaBasixRepository = new ChamadaBasixRepository();

          usuarios.map(async usuario => {
            const calls = await chamadaBasixRepository.findLastOneHour({
              username: usuario.username,
              domain: usuario.domain,
            });

            if (calls) {
              const publishPipedriveRepository = new PublishPipedriveRepository();

              calls.map(async call => {
                if (
                  !(await publishPipedriveRepository.findOne({
                    callid: call.callid,
                  }))
                ) {
                  await publishPipedriveRepository.insert({
                    fk_user_id: usuario.id,
                    callid: call.callid,
                    calllogkey: call.calllogkey,
                    incall: call.termino.toString() === 'Invalid Date' ? 1 : 0,
                    ready: call.fileName.indexOf('.rar') > -1 ? 0 : 1,
                    uploaded: 0,
                  });
                }

                const atual = await publishPipedriveRepository.findOne({
                  callid: call.callid,
                });

                if (
                  call.termino.toString() !== 'Invalid Date' &&
                  atual?.incall === 1
                ) {
                  atual.incall = 0;
                  await publishPipedriveRepository.update(atual);
                }

                if (
                  call.fileName.indexOf('.rar') === -1 &&
                  atual?.ready === 0
                ) {
                  atual.ready = 1;
                  await publishPipedriveRepository.update(atual);
                }
              });
              resolve(true);
            } else {
              resolve(true);
            }
          });
        } else {
          resolve(true);
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default VerifyRunningCalls;
