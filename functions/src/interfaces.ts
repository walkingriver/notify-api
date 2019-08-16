export interface EventResponse {
  event: EmergencyEvent;
  links: Links;
}

export interface EmergencyEvent {
  id: number;
  created: Date;
  caller: Caller;
  dialed: string;
}

export interface Caller {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: Address;
}

export interface Address {
  street1: string;
  street2: string;
  city: string;
  state: string;
  zip: string;
}

export interface Acknowledgement {
  timestamp: Date;
  user: string;
  note: string;
}

export interface Links {
  self: string;
  next: string;
  acknowledgements: string;
}

export interface EndpointDto {
	id: string;
	name: string;
	elin: string;
	address: AddressDto;
}

export interface AddressDto {
	description?: string;
	addressLine1: string;
	addressLine2?: string;
	city: string;
	state: string;
	zipCode: string;

	addressId?: string; // Unique ID set in Gatekeeper
	placeId?: string; // Unique ID from Google

	addressStatus?: 'GEOCODED' | 'PROVISIONED'; // Status in Bandwidth
	latitude?: string;
	longitude?: string;
}
