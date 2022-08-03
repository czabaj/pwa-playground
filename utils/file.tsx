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

type FacingMode = `user` | `environment`;

const getVideoStream = (facingMode: FacingMode) =>
  navigator.mediaDevices.getUserMedia({
    video: { facingMode: facingMode },
    audio: false,
  });

const getDummyStream = (fillColor = `#fff`) => {
  const canvas = document.createElement(`canvas`);
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = fillColor;
  ctx.fillRect(0, 0, 1, 1);
  return canvas.captureStream();
};

export const useVideoStream = (width: number, facingMode: FacingMode) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoState, setVideoState] = useState<
    `STAND_BY` | `INITIALIZATION` | `OK` | `KO`
  >(`STAND_BY`);
  const videoStreamRef = useRef<MediaStream | undefined>();
  const startVideo = async () => {
    setVideoState(`INITIALIZATION`);
    const video = videoRef.current!;
    let stream = videoStreamRef.current;
    if (!stream) {
      video.srcObject = getDummyStream();
      try {
        [stream] = await Promise.all([
          getVideoStream(facingMode),
          video.play(),
        ]);
        videoStreamRef.current = stream;
      } catch (error) {
        console.error(`Call to 'getUserMedia' resulted in an error`, error);
        setVideoState(`KO`);
        return;
      }
    }
    try {
      video.srcObject = stream!;
      video.load();
      await video.play();
      const videoHeight = String(
        video.videoHeight / (video.videoWidth / width)
      );
      video.setAttribute("height", videoHeight);
      setVideoState(`OK`);
    } catch (error) {
      console.error(`Call to 'video.play' resulted in an error`, error);
      setVideoState(`KO`);
    }
  };
  const videoEl = (
    <video
      height={(width / 16) * 9}
      playsInline={true}
      ref={videoRef}
      width={width}
    >
      Video stream not available.
    </video>
  );

  return { startVideo, videoEl, videoRef, videoState };
};
