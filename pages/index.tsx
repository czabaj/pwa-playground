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
        <a href="https://whatwebcando.today">whatwebcando.today</a>. Following
        index leads to pages with demonstration of the features.
      </p>
      <ul>
        <li>
          <Link href="/gps-tracking">Geolocation</Link> - ability to obtain user
          GPS coordinates.
        </li>
        <li>
          <Link href="/image-capture">Capturing images</Link> - ability to load
          image from file (gallery) or use device&apos;s camera directly.
        </li>
      </ul>
    </>
  );
};

export default Home;
