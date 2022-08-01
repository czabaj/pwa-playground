import { LayoutDocs } from "../components/LayoutDocs";

export const Notifications = () => {
  return (
    <LayoutDocs>
      <h2>Notifications</h2>
      <p>
        Web standard for notifications allows a web page to utilize a system
        notification center to draw user attention in standardized fashion.
        There are three types of notifications
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
          browser tab) is closed.
        </li>
        <li>
          Push Messages - dispatched by a remote server, handled by an
          application&apos;s <i>Service Worker</i>.
        </li>
      </ul>
      <p>
        From user perspective, all types might be indistinguishable but they
        differs technically.
      </p>
      <h3>Requirements and support</h3>
      <p>
        <a href="https://caniuse.com/notifications">The API well supported</a>{" "}
        and generalized to work on any platform and although there might be some
        limitations when compared to the native API, the web notification should
        serve well for 99% of use-cases.
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
    </LayoutDocs>
  );
};

export default Notifications;
