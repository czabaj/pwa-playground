export type Sample = {
  name: string;
  id: string;
};

export type Point = {
  address: string;
  location: Pick<GeolocationCoordinates, `latitude` | `longitude`>;
  name: string;
  itemsTake: Sample[];
  itemsGive?: Sample[];
};

export type Manifest = {
  name: string;
  points: Point[];
};
