import React from "react";

export const useHashParam = () => {
  const [hashParam, setHashParam] = React.useState<string>(
    window.location.hash.slice(1)
  );
  React.useEffect(() => {
    const locationHandler = () => {
      setHashParam(window.location.hash.slice(1));
    };
    window.addEventListener(`hashchange`, locationHandler);
    return () => {
      window.removeEventListener(`hashchange`, locationHandler);
    };
  }, []);

  return hashParam;
};
