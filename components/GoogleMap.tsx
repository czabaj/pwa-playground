import isEqual from "lodash/isEqual";
import {
  Children,
  cloneElement,
  CSSProperties,
  isValidElement,
  memo,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

export const geoPositionToLatLng = (
  position: GeolocationPosition
): google.maps.LatLngLiteral => ({
  lat: position.coords.latitude,
  lng: position.coords.longitude,
});

export const latLngsToBounds = (
  latLngs: google.maps.LatLngLiteral[]
): google.maps.LatLngBounds => {
  const bounds = new google.maps.LatLngBounds();
  for (const latLng of latLngs) {
    bounds.extend(latLng);
  }
  return bounds;
};

interface MapProps extends google.maps.MapOptions {
  bounds?: google.maps.LatLngBounds;
  children?: ReactNode;
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
  style: CSSProperties;
}

export const Map = ({
  bounds,
  onClick,
  onIdle,
  children,
  style,
  ...options
}: MapProps) => {
  const [map, setMap] = useState<google.maps.Map>();
  const previousOptionsRef = useRef<google.maps.MapOptions>();
  useEffect(() => {
    if (map && !isEqual(previousOptionsRef.current, options)) {
      map.setOptions(options);
    }
    previousOptionsRef.current = options;
  }, [map, options]);
  useEffect(() => {
    if (map) {
      ["click", "idle"].forEach((eventName) =>
        google.maps.event.clearListeners(map, eventName)
      );
      if (onClick) {
        map.addListener("click", onClick);
      }
      if (onIdle) {
        map.addListener("idle", () => onIdle(map));
      }
    }
  }, [map, onClick, onIdle]);
  useEffect(() => {
    if (map && bounds) {
      map.fitBounds(bounds);
    }
  }, [map, bounds]);
  return (
    <div
      ref={(node) => {
        if (!map && node) {
          setMap(new window.google.maps.Map(node, options));
        }
      }}
      style={style}
    >
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          // set the map prop on the child component
          return cloneElement(child, { map });
        }
      })}
    </div>
  );
};

export const Marker = memo((options: google.maps.MarkerOptions) => {
  const [marker, setMarker] = useState<google.maps.Marker>();

  useEffect(() => {
    setMarker(new google.maps.Marker());
    return () => marker?.setMap(null);
  }, []);
  useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  return null;
}, isEqual);

export const Polyline = memo((options: google.maps.PolylineOptions) => {
  const [polyline, setPolyline] = useState<google.maps.Polyline>();

  useEffect(() => {
    setPolyline(new google.maps.Polyline());
    return () => polyline?.setMap(null);
  }, []);
  useEffect(() => {
    if (polyline) {
      polyline.setOptions(options);
    }
  }, [polyline, options]);

  return null;
}, isEqual);
