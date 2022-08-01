import React from "react";

export const notificationsDeniedAlert = () =>
  alert(
    `The notifications are denied, you have to enable them in\n\nSettings > Privacy and Security > Site Settings`
  );

const notificationNotGrantedError = () => {
  console.error(`The app misses a permission for sending notifications`);
};

export const useNotifications = () => {
  const [permission, setPermission] = React.useState<NotificationPermission>(
    Notification.permission
  );
  const permissionRef = React.useRef(permission);
  permissionRef.current = permission;
  const requestPermission = React.useCallback(
    () => Notification.requestPermission(setPermission),
    []
  );
  const sendNotification = React.useCallback(() => {
    new Notification("Vibration Sample", {
      body: "Buzz! Buzz!",
      tag: "vibration-sample",
    });
  }, []);
  const sendPermanentNotification = React.useCallback(() => {
    return navigator.serviceWorker.ready.then((registration) =>
      registration.showNotification("Vibration Sample", {
        body: "Buzz! Buzz!",
        tag: "vibration-sample",
      })
    );
  }, []);
  return {
    permission,
    requestPermission,
    sendNotification:
      permission === `granted`
        ? sendNotification
        : (notificationNotGrantedError as any as typeof sendNotification),
    sendPermanentNotification:
      permission === `granted`
        ? sendPermanentNotification
        : (notificationNotGrantedError as any as typeof sendPermanentNotification),
  };
};
