import once from "lodash/once";
import uniqBy from "lodash/uniqBy";
import React, { useEffect } from "react";

import { LayoutDocs } from "../components/LayoutDocs";
import listClasses from "../styles/list.module.scss";
import { fileToImage } from "../utils/file";
import classes from "./barcode-scan.module.scss";

type DetectedBarcode = {
  boundingBox: DOMRectReadOnly;
  cornerPoints: { x: number; y: number };
  format: string;
  rawValue: string;
};

// The API does not exist in the TypeScript dom.d.ts types yet
type BarcodeDetectorStatic = {
  new (options?: { formats?: string[] }): {
    detect: (
      imageBitmapSource: Blob | HTMLImageElement | ImageData
    ) => Promise<DetectedBarcode[]>;
  };
  getSupportedFormats: () => Promise<string[]>;
};

type BarcodeDetectorAPI = { BarcodeDetector: BarcodeDetectorStatic };

const nativeBarcodeDetectorAvailable =
  typeof window !== `undefined` && `BarcodeDetector` in window;

const getBarcodeDetectorAPI = once(
  (): Promise<BarcodeDetectorAPI> =>
    nativeBarcodeDetectorAvailable
      ? Promise.resolve(window)
      : import("barcode-detector" as any).then(
          (barcodeDetectorModule) =>
            ({
              BarcodeDetector: barcodeDetectorModule.default,
            } as any)
        )
);
const BarcodeDetectorExample = ({
  barcodeDetectorAPI,
}: {
  barcodeDetectorAPI: BarcodeDetectorAPI;
}) => {
  const [supportedFormats, setSupportedFormats] = React.useState<
    readonly string[]
  >([]);
  const [barcodeDecodeResult, setBarcodeDecodeResult] = React.useState<
    { error: string } | { detectedBarcodes: DetectedBarcode[] } | undefined
  >();
  React.useEffect(() => {
    barcodeDetectorAPI.BarcodeDetector.getSupportedFormats().then(
      (formats: string[]) => {
        setSupportedFormats(formats);
      }
    );
  }, []);

  return (
    <>
      <p>
        Barcode detection available{" "}
        <b>
          {nativeBarcodeDetectorAvailable
            ? `using native implementation`
            : `using polyfilled implementation`}
        </b>
        , supported formats:
      </p>
      <ol
        aria-label="list of barcode formats supported by current device"
        className={listClasses.inline}
      >
        {supportedFormats.map((format) => (
          <li key={format}>{format}</li>
        ))}
      </ol>
      <p>
        Load a picture with supported barcode, the image can contain more than
        one supported barcode, all will be decoded. We have found from the
        experiments that the polyfilled implementation does not handle multiple
        barcodes as good as native implementation.
      </p>
      <label htmlFor="barcode-upload">Upload image for barcode detection</label>
      <input
        accept="image/*"
        capture="environment"
        id="barcode-upload"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            fileToImage(file)
              .then((img) =>
                new barcodeDetectorAPI.BarcodeDetector().detect(img)
              )
              .then(
                (detectedBarcodes) =>
                  setBarcodeDecodeResult({
                    detectedBarcodes: uniqBy(
                      detectedBarcodes,
                      ({ format, rawValue }) => `${format}${rawValue}`
                    ),
                  }),
                (error) => setBarcodeDecodeResult({ error })
              );
          }
        }}
        type="file"
      />
      {barcodeDecodeResult &&
        (`error` in barcodeDecodeResult ? (
          <>
            <p>The decoding failed with an error</p>
            <pre className={classes.preformatted}>
              {JSON.stringify(barcodeDecodeResult.error, null, 2)}
            </pre>
          </>
        ) : (
          <>
            <div>
              The decoding succeeded. Number of barcodes found:{" "}
              {barcodeDecodeResult.detectedBarcodes.length}
            </div>
            <pre className={classes.preformatted}>
              {JSON.stringify(
                barcodeDecodeResult.detectedBarcodes.map(
                  ({ format, rawValue }) => ({
                    format,
                    rawValue,
                  })
                ),
                null,
                2
              )}
            </pre>
          </>
        ))}
    </>
  );
};

export const BarcodeScan = () => {
  const [barcodeDetectorAPI, setBarcodeDetectorAPI] = React.useState<
    { error: any } | BarcodeDetectorAPI
  >();
  useEffect(() => {
    getBarcodeDetectorAPI().then(setBarcodeDetectorAPI, (error) => ({ error }));
  }, []);

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
          . This API is not available in Safari (mobile nor desktop),
          fortunately, there is{" "}
          <a href="https://github.com/gruhn/barcode-detector">
            an experimental polyfill{" "}
          </a>{" "}
          that utilizes the open-source libraries.
        </li>
      </ul>
      <h3>Example</h3>
      {!barcodeDetectorAPI ? (
        <div>Loading the API</div>
      ) : `error` in barcodeDetectorAPI ? (
        <div>Failed to load the API</div>
      ) : (
        <BarcodeDetectorExample barcodeDetectorAPI={barcodeDetectorAPI} />
      )}
    </LayoutDocs>
  );
};

export default BarcodeScan;
