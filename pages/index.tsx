import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <>
      <p>
        This repository holds demonstration of progressive web app (PWA)
        features. It shall reveal its limits opposed to native mobile
        applications.
      </p>
      <p>
        High level overview of supported features is nicely presented on{" "}
        <a href="https://whatwebcando.today">whatwecando.today</a>. Following
        index leads to pages with demonstration of the features.
      </p>
      <ul>
        <li>
          <Link href="/gps-tracking">GPS Tracking</Link> - ability to obtain
          user GPS coordinates, must obtain them real-time, as user moves and
          must be able to work even when the tab or the browser is in background
        </li>
      </ul>
    </>
  );
};

export default Home;
