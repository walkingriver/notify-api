import * as faker from 'faker';
import { EmergencyEvent, Acknowledgement } from './interfaces';

export class EventsService {
  pageSize = 10;
  events: EmergencyEvent[] = [];

  constructor() {
    // This will ensure we always get the same results.
    faker.seed(24601);
    for (let index = 1; index <= 50; index++) {
      const e = this.generateEvent(index);
      this.events[index] = e;
    }
  }

  getLatest(): EmergencyEvent {
    const max = this.events.reduce((a, b) => this.events[Math.max(a.id, b.id)]);
    return max;
  }

  getSince(since: Date): number[] {
    return this.events
      .filter(x => x.created > since)
      .sort((a, b) => a.created < b.created ? -1 : 1)
      .map(x => {
        return x.id;
      });
  }

  getById(id: number) {
    this.events[id] = this.events[id] || this.generateEvent(id);
    return this.events[id];
  }

  generateEvent(id: number) {
    const event: EmergencyEvent = {
      id: id,
      created: faker.date.recent(-2),
      dialed: '911',
      caller: {
        id: faker.random.uuid(),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        phone: faker.phone.phoneNumber(),
        address: {
          street1: faker.address.streetAddress(),
          street2: faker.address.secondaryAddress(),
          city: faker.address.city(),
          state: faker.address.stateAbbr(),
          zip: faker.address.zipCode()
        }
      }
    };

    return event;
  }

  getAcknowledgements(id: number, since: Date): Acknowledgement[] {
    const max = faker.random.number({ min: 1, max: 7 });
    console.log('Making some fake acks', max);
    const result = [];
    for (let index = 0; index < max; index++) {
      result.push({
        timestamp: faker.date.between(since, new Date()),
        note: faker.lorem.sentence(),
        user: faker.internet.email()
      });
    }

    console.log(JSON.stringify(result));
    return result;
  }
}
