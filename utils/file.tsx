import { useRef, useState } from "react";

export const fileToImage = (file: File): Promise<HTMLImageElement> =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const reader = new FileReader();
    reader.onabort = reject;
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        resolve(img);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });

export const getResizedImage = (
  source: HTMLImageElement | HTMLVideoElement,
  width: number
): string => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  const height =
    source instanceof HTMLVideoElement
      ? source.videoHeight / (source.videoWidth / width)
      : source.naturalHeight / (source.naturalWidth / width);
  if (!width || !height) return ``;
  canvas.width = width;
  canvas.height = height;
  context.drawImage(source, 0, 0, width, height);
  return canvas.toDataURL("image/png");
};

export const useVideoStream = (width: number) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoState, setVideoState] = useState<
    `STAND_BY` | `INITIALIZATION` | `OK` | `KO`
  >(`STAND_BY`);
  const startVideo = () => {
    setVideoState(`INITIALIZATION`);
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then(
        (stream) => {
          videoRef.current!.srcObject = stream;
          return videoRef.current!.play();
        },
        (err) => {
          console.error(`Call to 'getUserMedia' resulted in an error`, err);
        }
      )
      .then(
        () => {
          const video = videoRef.current!;
          const videoHeight = String(
            video.videoHeight / (video.videoWidth / width)
          );
          const videoWidth = String(width);
          video.setAttribute("width", videoWidth);
          video.setAttribute("height", videoHeight);
          setVideoState(`OK`);
        },
        (err) => {
          console.error(`Call to 'video.play' resulted in an error`, err);
        }
      );
  };
  const videoEl = <video ref={videoRef}>Video stream not available.</video>;

  return { startVideo, videoEl, videoRef, videoState };
};
