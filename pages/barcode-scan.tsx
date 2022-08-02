import once from "lodash/once";
import uniqBy from "lodash/uniqBy";
import React, { useEffect } from "react";

import { LayoutDocs } from "../components/LayoutDocs";
import listClasses from "../styles/list.module.scss";
import { fileToImage, useVideoStream } from "../utils/file";
import classes from "./barcode-scan.module.scss";
import {
  BarcodeDetectorAPI,
  DetectedBarcode,
  ImageBitmapSource,
} from "./barcode-scan.d";

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

const useBarcodeDetect = (barcodeDetectorAPI: BarcodeDetectorAPI) => {
  const [barcodeDetectResult, setBarcodeDetectResult] = React.useState<
    { error: string } | { detectedBarcodes: DetectedBarcode[] } | undefined
  >();
  const barcodeDetect = (
    imageBitmapSource: ImageBitmapSource | Promise<ImageBitmapSource>
  ) =>
    Promise.resolve(imageBitmapSource).then((source) =>
      new barcodeDetectorAPI.BarcodeDetector().detect(source).then(
        (detectedBarcodes) =>
          setBarcodeDetectResult({
            detectedBarcodes: uniqBy(
              detectedBarcodes,
              ({ format, rawValue }) => `${format}${rawValue}`
            ),
          }),
        (error) =>
          setBarcodeDetectResult({ detectedBarcodes: undefined, error })
      )
    );
  return { barcodeDetect, barcodeDetectResult };
};

const BarcodeExampleUploadFromFile = ({
  barcodeDetectorAPI,
}: {
  barcodeDetectorAPI: BarcodeDetectorAPI;
}) => {
  const { barcodeDetect, barcodeDetectResult } =
    useBarcodeDetect(barcodeDetectorAPI);
  return (
    <>
      <h4>Detect from uploaded picture</h4>
      <p>
        Load a picture with supported barcode, the image can contain more than
        one supported barcode, all will be decoded. We have found from the
        experiments that the polyfilled implementation does not handle multiple
        barcodes as good as native implementation.
      </p>
      <label htmlFor="barcode-upload">
        Upload image for barcode detection (uses a rear-facing camera on the
        phone)
      </label>
      <input
        accept="image/*"
        capture="environment"
        id="barcode-upload"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            barcodeDetect(fileToImage(file));
          }
        }}
        type="file"
      />
      {barcodeDetectResult &&
        (`error` in barcodeDetectResult ? (
          <>
            <p>The decoding failed with an error</p>
            <pre>{JSON.stringify(barcodeDetectResult.error, null, 2)}</pre>
          </>
        ) : (
          <>
            <div>
              The decoding succeeded. Number of barcodes found:{" "}
              {barcodeDetectResult.detectedBarcodes.length}
            </div>
            <pre>
              {JSON.stringify(
                barcodeDetectResult.detectedBarcodes.map(
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

const BarcodeExampleLiveStream = ({
  barcodeDetectorAPI,
}: {
  barcodeDetectorAPI: BarcodeDetectorAPI;
}) => {
  const { barcodeDetect, barcodeDetectResult } =
    useBarcodeDetect(barcodeDetectorAPI);
  const { startVideo, videoEl, videoRef, videoState } = useVideoStream(320);
  React.useEffect(() => {
    if (videoState === `OK` && videoRef.current) {
      const intervalId = window.setInterval(() => {
        barcodeDetect(videoRef.current!);
      }, 200);
      return () => window.clearInterval(intervalId);
    }
  }, [videoState]);

  const buttonAction =
    videoState === `STAND_BY` || videoState === `KO` ? startVideo : undefined;

  return (
    <>
      <h4>Detect from live stream</h4>
      <p>
        Here we are going to build a barcode scanner from camera stream. The
        Barcode Detection API has no built in method for this, but we can use
        the{" "}
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices">
          MediaDevices interface
        </a>{" "}
        to build our own solution.
      </p>
      <p>
        The native methods usually displays a bounding box around the barcode
        detected in the image stream, which is doable - the API provides to us
        position of the detected barcode - but this is too laborious for our
        example.
      </p>
      <p>
        Start by click on the button bellow. You might be prompted for giving
        this site a permission for accessing a camera.
      </p>
      <button disabled={!buttonAction} onClick={buttonAction} type="button">
        {videoState === `OK` ? (
          <>Video stream started</>
        ) : (
          <>Start camera stream</>
        )}
      </button>
      <div className={classes.barcodeCapture}>
        {videoEl}
        {videoState === `OK` && (
          <pre>
            {barcodeDetectResult &&
              `detectedBarcodes` in barcodeDetectResult &&
              barcodeDetectResult.detectedBarcodes?.length > 0 &&
              JSON.stringify(
                barcodeDetectResult.detectedBarcodes.map(
                  ({ format, rawValue }) => ({
                    format,
                    rawValue,
                  })
                ),
                null,
                2
              )}
          </pre>
        )}
      </div>
    </>
  );
};

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
      <BarcodeExampleUploadFromFile barcodeDetectorAPI={barcodeDetectorAPI} />
      <BarcodeExampleLiveStream barcodeDetectorAPI={barcodeDetectorAPI} />
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
      <p>
        In the following examples, we are going to test the native
        implementation with the polyfill.
      </p>
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
