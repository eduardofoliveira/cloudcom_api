import { detailedDiff } from 'deep-object-diff';
import axios from 'axios';

import UserStatusRepository from '../repository/userStatusRepository';

enum Events {
  REGISTRATIONS = 'REGISTRATIONS',
  CALLS = 'CALLS',
  BOTH = 'BOTH',
}

class Subscriber {
  public domain: string;

  public url: string;

  public events: Events;

  private intervalo: NodeJS.Timer;

  constructor({
    domain,
    url,
    events,
  }: Omit<Subscriber, 'destroy' | 'intervalo'>) {
    this.domain = domain;
    this.url = url;
    this.events = events;

    const userStatusRepository = new UserStatusRepository();
    let inMemoryRegistrations = {};
    let inMemoryCalls = {};
    this.intervalo = setInterval(async () => {
      const statusReturn = await userStatusRepository.getStatusByDomain({
        domain: this.domain,
      });

      if (statusReturn && statusReturn?.length > 0) {
        // Checa e atualiza os registros
        if (
          this.events === Events.BOTH ||
          this.events === Events.REGISTRATIONS
        ) {
          const tempRegistrations = statusReturn
            .map(item => {
              if (item.usuarioTerminal) {
                return item.usuarioTerminal;
              }
              return item.usuario;
            })
            .reduce((retorno, item) => {
              if (retorno[item] === undefined) {
                const aux = {
                  ...retorno,
                  ...{ [`${item}`]: { usuario: item, status: 'Registered' } },
                };
                return aux;
              }
              return retorno;
            }, {});

          // console.log(tempRegistrations);

          const { added, deleted } = detailedDiff(
            inMemoryRegistrations,
            tempRegistrations,
          );
          Object.keys(added).map(item => {
            // console.log('Added');
            // console.log(tempRegistrations[item]);
            axios.post(this.url, tempRegistrations[item]);
          });
          Object.keys(deleted).map(item => {
            // console.log('Deleted');
            // console.log({
            //   ...inMemoryRegistrations[item],
            //   status: 'Unregistered',
            // });
            axios.post(this.url, {
              ...inMemoryRegistrations[item],
              status: 'Unregistered',
            });
          });

          inMemoryRegistrations = tempRegistrations;
        }

        // Checa e atualiza as chamadas ativas
        if (this.events === Events.BOTH || this.events === Events.CALLS) {
          const emChamada = statusReturn
            .map(item => {
              if (item.usuarioTerminal) {
                item.usuario = item.usuarioTerminal;
              }
              return item;
            })
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
            // console.log('Added');
            // console.log(addedCalls[item]);
            axios.post(this.url, addedCalls[item]);
          });
          Object.keys(updatedCalls).map(item => {
            // console.log('Updated');
            // console.log({ ...emChamada[item], ...updatedCalls[item] });
            axios.post(this.url, { ...emChamada[item], ...updatedCalls[item] });
          });
          Object.keys(deletedCalls).map(item => {
            // console.log('Deleted');
            // console.log({
            //   ...inMemoryCalls[item],
            //   ...{ estado: 'Desconectada' },
            // });
            axios.post(this.url, {
              ...inMemoryCalls[item],
              ...{ estado: 'Desconectada' },
            });
          });

          inMemoryCalls = emChamada;
        }
      }
    }, 1000);
  }

  public destroy = (): void => {
    clearInterval(this.intervalo);
  };
}

export default Subscriber;
