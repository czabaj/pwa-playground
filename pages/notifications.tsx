import { LayoutDocs } from "../components/LayoutDocs";
import {
  notificationsDeniedAlert,
  useNotifications,
} from "../hook/useNotifications";

const NotificationsExamples = () => {
  const notifications = useNotifications();
  if (notifications.permission === `unsupported`) {
    return (
      <p>
        <b>The Notification API is not supported in current browser</b>
      </p>
    );
  }
  if (notifications.permission === `denied`) {
    return (
      <>
        <p>
          <b>The notifications are denied for current web page.</b>
        </p>
        <p>
          Either you or someone else has explicitly denied the notifications for
          this site or your browser has default policy to block notifications on
          all sites.
        </p>
        <p>
          You can enable notification for this site in site settings (reachable
          from the browser address bar) or in browser-wide settings, typically
          in <i>Privacy</i> section.
        </p>
      </>
    );
  }
  const onNotificationClick =
    notifications.permission === `default`
      ? () =>
          notifications.requestPermission!().then(
            notifications.sendNotification,
            notificationsDeniedAlert
          )
      : notifications.sendNotification;
  const onPersistentNotificationClick =
    notifications.permission === `default`
      ? () =>
          notifications.requestPermission!().then(
            notifications.sendPersistentNotification,
            notificationsDeniedAlert
          )
      : notifications.sendPersistentNotification;
  return (
    <>
      {notifications.permission === `default` && (
        <p>NOTE: You will be prompted for notification permission.</p>
      )}
      <h4>Local non-persistent</h4>
      <p>
        Following button will send a notification into your device&apos;s
        notification center from the application&apos;s code.
      </p>
      <button onClick={onNotificationClick} type="button">
        Send notification
      </button>
      <h4>Local persistent</h4>
      <p>
        Following button will send a notification into your device&apos;s
        notification center from a <i>Service Worker</i>.
      </p>
      <button onClick={onPersistentNotificationClick} type="button">
        Send notification
      </button>
    </>
  );
};

const Notifications = () => {
  return (
    <LayoutDocs>
      <h2>Notifications</h2>
      <p>
        Web standard for notifications allows a web page to utilize a{" "}
        <em>system</em> notification center to draw user attention in
        standardized fashion. There are three types of notifications.
      </p>
      <ul>
        <li>
          Local Notifications, non-persistent - dispatched by a web application
          from the application code - works only when the app (it&apos;s browser
          tab) is active.
        </li>
        <li>
          Local Notifications, persistent - dispatched by a web application
          through its <i>Service Worker</i>, works even when the app (its
          browser tab) is closed - this covers ability to send a new
          notification from the Service Worker as well as update or close an
          already dispatched notification. Beware though that the lifetime of
          Service Worker is limited and it will be eventually stopped, so to
          deliver a notification reliably even when the web app is closed, we
          need a third type of notification.
        </li>
        <li>
          Push Messages - dispatched by a remote server, handled by an
          application&apos;s <i>Service Worker</i>. The push messages are
          actually handled on the system level and if the system receives
          particular push message, it forwards it to the web browser which
          starts the page Service Worker. These notifications works even if the
          web browser is closed, but it requires remote infrastructure.
        </li>
      </ul>
      <p>
        From the UI perspective, all types are indistinguishable but they
        differs technically.
      </p>
      <h3>Requirements and support</h3>
      <p>
        <a href="https://caniuse.com/notifications">
          The API is well supported
        </a>{" "}
        with one bold exception - the iOS platform.{" "}
        <b>Safari on iOS does not support standard web notifications at all</b>{" "}
        and since Apple limits all browsers on iOS to use WebKit internally,
        this limitations is shared by all web browser on iOS.
      </p>
      <p>
        The API is generalized to be compatible with any platform and although
        there might be some limitations when compared to the native API, the web
        notification should serve well for 99% of use-cases.
      </p>
      <p>
        All types of notifications requires a <i>Secure context</i> (HTTPS), the
        local-persistent notification and push messages requires a{" "}
        <i>Service Worker</i> to be installed.
      </p>
      <p>
        This feature requires a permission from the user to deliver
        notifications. This permission is shared among all types of
        notifications so once the user approves notification permission, the app
        can send any of them.
      </p>
      <p>
        NOTE: On some platforms also your <b>web browser</b> needs a permission
        to send notifications. The web page is not able to detect if such system
        permission is granted to your browsers or not.
      </p>
      <h3>Examples</h3>
      <NotificationsExamples />
    </LayoutDocs>
  );
};

export default Notifications;
