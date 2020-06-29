import Subscriber from './subscriber';

export enum Events {
  REGISTRATIONS = 'REGISTRATIONS',
  CALLS = 'CALLS',
  BOTH = 'BOTH',
}

interface MethodSubscribe {
  domain: string;
  url: string;
  events: Events;
}

interface MethodUnsubscribe {
  domain: string;
}

interface Lista {
  domain: string;
  subscriber: Subscriber;
}

let subscribeRunning: Lista[] = [];

class EventSubscriber {
  subscribe = ({ domain, url, events }: MethodSubscribe): void => {
    const subscriber = new Subscriber({
      domain,
      url,
      events,
    });

    subscribeRunning.push({
      domain,
      subscriber,
    });
  };

  unsubscribe = ({ domain }: MethodUnsubscribe): void => {
    const subscriber = subscribeRunning.find(
      SubscriberItem => SubscriberItem.domain === domain,
    );
    if (subscriber) {
      // console.log(`unsubscribe - ${domain}`);
      subscriber.subscriber.destroy();
      subscribeRunning = subscribeRunning.filter(
        item => item.domain !== domain,
      );
    }
  };
}

// const eventSubscriber = new EventSubscriber();
// eventSubscriber.subscribe({
//   domain: 'cloud.cloudcom.com.br',
//   url: 'http://localhost:90',
//   events: Events.BOTH,
// });
// eventSubscriber.subscribe({
//   domain: 'bpp.cloudcom.com.br',
//   url: 'http://localhost:90',
//   events: Events.REGISTRATIONS,
// });

// console.log(Object.keys(Events).indexOf('REGISTRATION'));

export default new EventSubscriber();
