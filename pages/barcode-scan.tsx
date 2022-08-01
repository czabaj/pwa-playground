import once from "lodash/once";
import React from "react";

import { LayoutDocs } from "../components/LayoutDocs";
import listClasses from "../styles/list.module.scss";

type BarcodeDetector = {
  getSupportedFormats: () => Promise<string[]>;
};

const nativeBarcodeDetectorAvailable =
  typeof window !== `undefined` && `BarcodeDetector` in window;

const getBarcodeDetector = once(
  (): Promise<BarcodeDetector> =>
    nativeBarcodeDetectorAvailable
      ? Promise.resolve((window as any).BarcodeDetector)
      : import("barcode-detector" as any).then(
          (barcodeDetectorModule) => barcodeDetectorModule.default as any
        )
);

const NativeBarcodeDetectorExample = () => {
  const [supportedFormats, setSupportedFormats] = React.useState<
    readonly string[]
  >([]);
  React.useEffect(() => {
    (window as any).BarcodeDetector.getSupportedFormats().then(
      (formats: string[]) => {
        setSupportedFormats(formats);
      }
    );
  }, []);

  return (
    <>
      <p>Barcode detection available, supported formats</p>
      <ol
        aria-label="list of barcode formats supported by current device"
        className={listClasses.inline}
      >
        {supportedFormats.map((format) => (
          <li key={format}>{format}</li>
        ))}
      </ol>
    </>
  );
};

export const BarcodeScan = () => {
  return (
    <LayoutDocs>
      <h2>Barcode scan</h2>
      <p>There are two possible strategies available for parsing a barcode:</p>
      <ul>
        <li>
          3rd party - there is a few established libraries or 3rd party APIs,
          that allows us detect barcode from the image data, e.g.{" "}
          <a href="https://www.npmjs.com/package/@zxing/library">
            Zebra Crossings
          </a>{" "}
          open-source library or{" "}
          <a href="https://docs.scandit.com/stable/web/">
            Scandit Barcode Scanner SDK
          </a>{" "}
          to name a few.
        </li>
        <li>
          native - the{" "}
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/Barcode_Detection_API">
            Barcode Detection API
          </a>{" "}
          is a modern way of utilizing barcode detection and parsing
          capabilities built in the system or into the browser. This API is
          currently experimental,{" "}
          <a href="https://caniuse.com/?search=BarcodeDetector">
            works in Android or ChromeOS devices and in blink (Chrome) based
            browser on MacOS
          </a>
          , unfortunately though, this API is not available in Safari, mobile
          nor desktop. Fortunately, there is{" "}
          <a href="https://github.com/gruhn/barcode-detector">
            an experimental polyfill{" "}
          </a>{" "}
          that utilizes the open-source libraries.
        </li>
      </ul>
      <h3>Example of native detection</h3>
      {!nativeBarcodeDetectorAvailable ? (
        <>
          The <i>Barcode Detection API</i> is not supported in current browser.
        </>
      ) : (
        <NativeBarcodeDetectorExample />
      )}
    </LayoutDocs>
  );
};

export default BarcodeScan;
