export type Item = {
    name: string;
};

export type Point = {
    location: Pick<GeolocationCoordinates, `latitude` | `longitude`>;
    itemsTake?: Item[];
    itemsGive?: Item[];
};

export type Manifest = {
    name: string;
    points: Point[];
};
