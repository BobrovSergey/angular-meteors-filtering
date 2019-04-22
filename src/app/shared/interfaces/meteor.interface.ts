export interface Geolocation {
  type: string;
  coordinates: [number, number];
}

export interface MeteorInterface {
  fall: string;
  geolocation: Geolocation;
  id: string;
  mass: string;
  name: string;
  nametype: string;
  recclass: string;
  reclat: string;
  reclong: string;
  year: string;
}
