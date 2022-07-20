import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { FormattedTime } from "react-intl";

import {
  Map,
  Marker,
  Polyline,
  geoPositionToLatLng,
  latLngsToBounds,
} from "../components/GoogleMap";
import classes from "./gps-tracking.module.scss";

const useCurrentPosition = () => {
  const [currentPosition, setCurrentPosition] = useState<
    GeolocationPosition | undefined
  >();
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPosition(position);
      },
      (error) => {
        console.error(`retrieving geolocation failed with an error:`, error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }, []);
  return currentPosition;
};

const useLatestPositions = () => {
  const [positions, setPositions] = useState<GeolocationPosition[]>([]);
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition((position) => {
      setPositions((oldPositions) => {
        return oldPositions.concat(position);
      });
    });
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);
  return positions;
};

const ContentPermissionGranted = ({
  position,
}: {
  position: GeolocationPosition;
}) => {
  const currentLatLng = geoPositionToLatLng(position);
  const latestPositions = useLatestPositions();
  const latestPositionsLatLngs = latestPositions.map(geoPositionToLatLng);
  return (
    <>
      <h3>Current position</h3>
      <p>
        The web geolocation API does not specify the source of the location
        information.{" "}
        <cite>
          The Geolocation API defines a high-level interface to location
          information associated only with the device hosting the
          implementation, such as latitude and longitude. The API itself is
          agnostic of the underlying location information sources. Common
          sources of location information include Global Positioning System
          (GPS) and location inferred from network signals such as IP address,
          RFID, WiFi and Bluetooth MAC addresses, and GSM/CDMA cell IDs, as well
          as user input. No guarantee is given that the API returns the
          device&apos;s actual location. --
          https://www.w3.org/2008/geolocation/PER-geolocation-API/#introduction
        </cite>
        On a device without GPS sensor the accuracy is unreliable.
      </p>
      <figure>
        <figcaption>
          Your position captured on the page start rendered in a map.
        </figcaption>
        <Map
          center={currentLatLng}
          style={{ blockSize: 300, inlineSize: 500 }}
          zoom={10}
        >
          <Marker position={currentLatLng} />
        </Map>
      </figure>
      <h3>Watch for position changes</h3>

      <figure>
        <figcaption>You real-time position plotted onto the map</figcaption>
        <Map
          center={currentLatLng}
          bounds={latLngsToBounds(latestPositionsLatLngs)}
          style={{ blockSize: 300, inlineSize: 500 }}
          zoom={17}
        >
          <Polyline
            path={latestPositions.map(geoPositionToLatLng)}
            strokeColor="#FF0000"
            strokeOpacity={1}
            strokeWeight={2}
          />
        </Map>
      </figure>
      <p>
        The watch callback is invoked even when there is no change in location,
        the table bellow thus contain duplicated rows. The altitude, heading and
        speed is only measured on supported devices.
      </p>
      <table className={classes.watchTable}>
        <caption>The list of captured location changes</caption>
        <thead>
          <tr>
            <th scope="col">Timestamp</th>
            <th scope="col">Latitude</th>
            <th scope="col">Longitude</th>
            <th scope="col">Accuracy</th>
            <th scope="col">Altitude</th>
            <th scope="col">Altitude Accuracy</th>
            <th scope="col">Heading</th>
            <th scope="col">Speed</th>
          </tr>
        </thead>
        <tbody>
          {latestPositions.map((pos, i) => {
            return (
              <tr key={i}>
                <td>
                  <FormattedTime
                    day="numeric"
                    fractionalSecondDigits={3}
                    hour12={false}
                    hour="2-digit"
                    minute="2-digit"
                    month="short"
                    second="2-digit"
                    value={pos.timestamp}
                  />
                </td>
                <td>{pos.coords.latitude}</td>
                <td>{pos.coords.longitude}</td>
                <td>{pos.coords.accuracy}</td>
                <td>{pos.coords.altitude}</td>
                <td>{pos.coords.altitudeAccuracy}</td>
                <td>{pos.coords.heading}</td>
                <td>{pos.coords.speed}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

const GPSTracking: NextPage = () => {
  const currentPosition = useCurrentPosition();

  return (
    <>
      <h2>GPS Tracking</h2>
      <p>
        The GPS location is accessible through the{" "}
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API">
          Geolocation API
        </a>
        . The API allows to query for current location as well as watch the
        changes of location.
      </p>
      <p>
        The <a href="https://caniuse.com/geolocation">API is well supported</a>{" "}
        even in old browsers. It only requires secure connection (HTTPS).
      </p>
      <p>
        The page must obtain a permission from the user to access location data.
        The browsers prompts user for granting this permission when the page
        calls geolocation API. A{" "}
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API">
          Permission API
        </a>{" "}
        exists for querying the state of permissions before accessing the
        Geolocation API which allows build a better UX for obtaining
        permissions, but the Permission API is still new and currently not
        supported in Safari.
      </p>
      <h2>Background geotracking</h2>
      <p>
        This is currently impossible, the page must be in foreground to use
        geolocation API.
      </p>
      <p>
        There is a{" "}
        <a href="https://github.com/w3c/geolocation-sensor">
          GeolocationSensor API
        </a>{" "}
        as a successor of geolocation API, which will allow background
        geotracking. This API is in very early stage and not supported by any
        browser.
      </p>
      {!currentPosition ? (
        <div>Please approve the page for accessing the location data.</div>
      ) : (
        <ContentPermissionGranted position={currentPosition} />
      )}
    </>
  );
};

export default GPSTracking;
