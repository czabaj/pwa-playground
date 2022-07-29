import React from "react";

const touchDeviceMediaQuery = window.matchMedia(
  `(hover: none) and (pointer: coarse)`
);

export const useToucheDevice = () => {
  const [touchDevice, setTouchDevice] = React.useState(
    () => touchDeviceMediaQuery.matches
  );
  React.useEffect(() => {
    const listener = () => setTouchDevice(touchDeviceMediaQuery.matches);

    touchDeviceMediaQuery.addEventListener(`change`, listener);
    return () => touchDeviceMediaQuery.removeEventListener(`change`, listener);
  }, []);
  return touchDevice;
};
