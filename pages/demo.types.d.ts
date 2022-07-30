export type Item = {
  name: string;
};

export type Point = {
  address: string;
  location: Pick<GeolocationCoordinates, `latitude` | `longitude`>;
  name: string;
  itemsTake?: Item[];
  itemsGive?: Item[];
};

export type Manifest = {
  name: string;
  points: Point[];
};
