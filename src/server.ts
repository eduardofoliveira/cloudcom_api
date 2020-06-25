import express from 'express';
import { detailedDiff } from 'deep-object-diff';

// import VerifyPublishPipedrive from './service/verifyPublishPipedrive';
// import VerifyRunningCalls from './service/verifyRunningCalls';
// import PipedriveUpload from './service/pipedriveUploadFile';
import Axios from 'axios';
import { lastDayOfWeekWithOptions } from 'date-fns/fp';
import { FSx } from 'aws-sdk';
import UserStatusRepository from './repository/userStatusRepository';
import routes from './routes/api';

const app = express();
const port = process.env.PORT || 80;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

app.listen(port, async () => {
  process.stdout.write(`Server started on port ${port}\r\n`);
  const userStatusRepository = new UserStatusRepository();

  let inMemoryRegistrations = {};
  let inMemoryCalls = {};

  setInterval(async () => {
    const statusReturn = await userStatusRepository.getStatusByDomain({
      domain: 'cloud.cloudcom.com.br',
    });

    if (statusReturn && statusReturn?.length > 0) {
      // Checa e atualiza os registros
      const tempRegistrations = statusReturn
        .map(item => {
          if (item.usuarioTerminal) {
            return item.usuarioTerminal;
          }
          return item.usuario;
        })
        .reduce((retorno, item) => {
          if (retorno[item] === undefined) {
            const aux = { ...retorno, ...{ [item]: 'Registered' } };
            return aux;
          }
          return retorno;
        }, {});

      const { added, deleted } = detailedDiff(
        inMemoryRegistrations,
        tempRegistrations,
      );
      Object.keys(added).map(item => {
        console.log(`${item} Registrado - ${new Date().toLocaleString()}`);
      });
      Object.keys(deleted).map(item => {
        console.log(`${item} Desregistrado - ${new Date().toLocaleString()}`);
      });

      inMemoryRegistrations = tempRegistrations;

      // Checa e atualiza as chamadas ativas
      const emChamada = statusReturn
        .filter(item => {
          if (item.estado !== null) {
            return true;
          }
          return false;
        })
        .map(item => {
          if (/(.*)@.*/.test(item.destino)) {
            const destino = item.destino.match(/(.*)@.*/)[1];
            item.destino = destino;
          }
          if (/\d{4,5}(55\d{10,11})/.test(item.destino)) {
            const destino = item.destino.match(/\d{4,5}(55\d{10,11})/)[1];
            item.destino = destino;
          }
          return {
            usuario: item.usuario,
            destino: item.destino,
            tipo: item.tipo,
            estado: item.estado,
          };
        })
        .reduce((lista, item) => {
          const existe = lista.find(itemF => {
            if (
              itemF.usuario === item.usuario &&
              item.destino === itemF.destino &&
              item.estado === itemF.estado &&
              item.tipo === itemF.tipo
            ) {
              return true;
            }
            return false;
          });

          if (!existe) {
            return [...lista, item];
          }
          return lista;
        }, [])
        .reduce((retorno, item) => {
          retorno = {
            ...retorno,
            ...{ [`${item.usuario}-${item.destino}`]: item },
          };
          return retorno;
        }, {});

      const {
        added: addedCalls,
        deleted: deletedCalls,
        updated: updatedCalls,
      } = detailedDiff(inMemoryCalls, emChamada);

      Object.keys(addedCalls).map(item => {
        console.log('Added');
        console.log(addedCalls[item]);
      });
      Object.keys(updatedCalls).map(item => {
        console.log('Updated');
        console.log({ ...emChamada[item], ...updatedCalls[item] });
      });
      Object.keys(deletedCalls).map(item => {
        console.log('Deleted');
        console.log({ ...inMemoryCalls[item], ...{ estado: 'Desconectada' } });
      });

      inMemoryCalls = emChamada;
    }
  }, 1000);

  // const verifyPublishPipedrive = new VerifyPublishPipedrive();
  // const verifyRunningCalls = new VerifyRunningCalls();
  // const pipedriveUpload = new PipedriveUpload();

  // await verifyRunningCalls.execute();
  // await verifyPublishPipedrive.execute();
  // await pipedriveUpload.execute();

  // setInterval(async () => {
  //   await verifyRunningCalls.execute();
  //   await verifyPublishPipedrive.execute();
  //   await pipedriveUpload.execute();
  // }, 60000);
});
