import * as faker from 'faker';
import { AddressDto, EndpointDto } from './interfaces';

export class DispatcherService {
  pageSize = 10;

  constructor() {
    // This will ensure we always get the same results.
    faker.seed(24601);
  }

  validate(addr: AddressDto): AddressDto {
    const returnAddresss: AddressDto = Object.assign({}, addr);
    returnAddresss.addressLine1 = addr.addressLine1.toUpperCase();
    returnAddresss.addressLine2 = addr.addressLine2.toUpperCase();
    returnAddresss.city = addr.city.toUpperCase();
    returnAddresss.state = addr.state.toUpperCase();
    returnAddresss.addressStatus = 'GEOCODED';

    return returnAddresss;
  }

  addEndpoint(endpoint: EndpointDto): EndpointDto {
    return endpoint;
  }

  updateEndpoint(endpoint: EndpointDto): EndpointDto {
    return endpoint;
  }

  provisionEndpoint(endpoint: EndpointDto): EndpointDto {
    endpoint.address.addressStatus = 'PROVISIONED';
    return endpoint;
  }
}
