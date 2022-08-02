import React from "react";

export const notificationsDeniedAlert = () =>
  alert(
    `The notifications are denied, you have to enable them in\n\nSettings > Privacy and Security > Site Settings`
  );

const notificationNotGrantedError = () => {
  throw new Error(`The app misses a permission for sending notifications`);
};

const notificationUnsupportedError = () => {
  throw new Error(`The Notification API is not supported in this browser`);
};

export type NotificationPermissionEnhanced =
  | NotificationPermission
  | `unsupported`;

export const useNotifications: () => {
  permission: NotificationPermissionEnhanced;
  requestPermission: () => Promise<NotificationPermission>;
  sendNotification: () => void;
  sendPersistentNotification: () => Promise<void>;
} =
  typeof Notification === `undefined`
    ? () => ({
        permission: `unsupported`,
        requestPermission: notificationUnsupportedError as any,
        sendNotification: notificationUnsupportedError as any,
        sendPersistentNotification: notificationUnsupportedError as any,
      })
    : () => {
        const [permission, setPermission] =
          React.useState<NotificationPermission>(Notification.permission);
        const permissionRef = React.useRef(permission);
        permissionRef.current = permission;
        const requestPermission = React.useCallback(
          () => Notification.requestPermission(setPermission),
          []
        );
        const sendNotification = React.useCallback(() => {
          new Notification("PWA Demo notification", {
            body: "This notification was send through application code (local, non-persistent).",
            tag: "vibration-sample",
          });
        }, []);
        const sendPersistentNotification = React.useCallback(() => {
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
              : (notificationNotGrantedError as any),
          sendPersistentNotification:
            permission === `granted`
              ? sendPersistentNotification
              : (notificationNotGrantedError as any),
        };
      };
