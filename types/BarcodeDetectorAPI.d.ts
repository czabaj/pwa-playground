// The API does not exist in the TypeScript dom.d.ts types yet

export type DetectedBarcode = {
    boundingBox: DOMRectReadOnly;
    cornerPoints: { x: number; y: number };
    format: string;
    rawValue: string;
};

export type ImageBitmapSource = Blob | HTMLImageElement | HTMLVideoElement | ImageData

export type BarcodeDetectorStatic = {
    new(options?: { formats?: string[] }): {
        detect: (
            imageBitmapSource: ImageBitmapSource
        ) => Promise<DetectedBarcode[]>;
    };
    getSupportedFormats: () => Promise<string[]>;
};

export type BarcodeDetectorAPI = { BarcodeDetector: BarcodeDetectorStatic };
