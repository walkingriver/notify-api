import * as faker from 'faker';
import { AddressDto, EndpointDto } from './interfaces';

export class DispatcherService {
  endpoints = {};
  pageSize = 10;

  constructor() {
    // This will ensure we always get the same results.
    faker.seed(24601);
  }

  validate(addr: AddressDto): AddressDto {
    const returnAddresss: AddressDto = Object.assign({}, addr);
    returnAddresss.addressLine1 = ((addr.addressLine1) || '').toUpperCase();
    returnAddresss.addressLine2 = ((addr.addressLine2) || '').toUpperCase();
    returnAddresss.city = ((addr.city) || '').toUpperCase();
    returnAddresss.state = ((addr.state) || '').toUpperCase();
    returnAddresss.addressStatus = 'GEOCODED';

    return returnAddresss;
  }

  addEndpoint(endpoint: EndpointDto): EndpointDto {
    endpoint.id = faker.random.uuid();
    endpoint.address = { addressLine1: '', city: '', state: '', zipCode: '' };
    this.endpoints[endpoint.id] = endpoint;
    return endpoint;
  }
  
  updateEndpoint(endpoint: EndpointDto): EndpointDto {
    this.endpoints[endpoint.id] = endpoint;
    return endpoint;
  }

  provisionEndpoint(id: string): EndpointDto {
    const endpoint = this.endpoints[id];
    endpoint.address.addressStatus = 'PROVISIONED';
    return endpoint;
  }
}
