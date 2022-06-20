import type { NextPage } from "next";
import { useEffect, useState } from "react";

const positionOptions: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

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
      positionOptions
    );
  }, []);
  return currentPosition;
};

const useLatestPositions = () => {
  const [positions, setPositions] = useState<GeolocationPosition[]>([]);
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition((position) => {
      setPositions((oldPositions) => oldPositions.concat(position));
    });
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);
  return positions;
};

const CurrentPosition = ({ position }: { position: GeolocationPosition }) => {
  return (
    <dl>
      <dt>Latitude</dt>
      <dd>{position.coords.latitude}</dd>
      <dt>Longitude</dt>
      <dd>{position.coords.longitude}</dd>
    </dl>
  );
};

const ContentPermissionGranted = ({
  position,
}: {
  position: GeolocationPosition;
}) => {
  const latestPositions = useLatestPositions();
  return (
    <>
      <h3>Current position</h3>
      <div>Your current location is</div>
      <CurrentPosition position={position} />
      <h3>Watch for position changes</h3>
      <p>
        The watch callback is invoked even when there is no change in location,
        the table bellow thus contain duplicated rows. The altitude, heading and
        speed is only measured on supported devices.
      </p>
      <table>
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
          {latestPositions.map((pos) => {
            return (
              <tr key={pos.timestamp}>
                <td>{pos.timestamp}</td>
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
      {!currentPosition ? (
        <div>Please approve the page for accessing the location data.</div>
      ) : (
        <ContentPermissionGranted position={currentPosition} />
      )}
    </>
  );
};

export default GPSTracking;
