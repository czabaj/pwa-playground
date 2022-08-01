import type { NextPage } from "next";
import Link from "next/link";

import { LayoutDocs } from "../components/LayoutDocs";

const Home: NextPage = () => {
  return (
    <LayoutDocs>
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
          <Link href="/gps-tracking">Geolocation</Link> - ability to obtain
          user&apos;s GPS coordinates.
        </li>
        <li>
          <Link href="/image-capture">Capturing images</Link> - ability to load
          image from file (gallery) or use device&apos;s camera directly.
        </li>
        <li>
          <Link href="/notifications">Notifications</Link> - ability to notify
          the user even when the page is in the background.
        </li>
        <li>
          <Link href="/barcode-scan">Barcode scan</Link> - ability to detect
          barcode on an image and parse it.l
        </li>
        <li>
          <Link href="/demo">Demo</Link> - an interactive demo application
        </li>
      </ul>
    </LayoutDocs>
  );
};

export default Home;
