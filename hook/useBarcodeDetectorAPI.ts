import once from "lodash/once";

import {
  BarcodeDetectorAPI,
  DetectedBarcode,
  ImageBitmapSource,
} from "../types/BarcodeDetectorAPI";
import React, { useEffect } from "react";
import uniqBy from "lodash/uniqBy";

export const nativeBarcodeDetectorAvailable =
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

export const useBarcodeDetectorAPI = () => {
  const [barcodeDetectorAPI, setBarcodeDetectorAPI] = React.useState<
    { error: any } | BarcodeDetectorAPI
  >();
  useEffect(() => {
    getBarcodeDetectorAPI().then(setBarcodeDetectorAPI, (error) => ({ error }));
  }, []);
  return barcodeDetectorAPI;
};

export const useBarcodeDetect = (barcodeDetectorAPI: BarcodeDetectorAPI) => {
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
