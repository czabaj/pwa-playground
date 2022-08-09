import { useRef, useState } from "react";

export type FacingMode = `user` | `environment`;

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
    const video = videoRef.current!;
    if (videoState === `OK`) {
      return video.play();
    }
    setVideoState(`INITIALIZATION`);
    let stream = videoStreamRef.current;
    if (!stream) {
      // There is a catch to play video stream in WebKit (Safari). For privacy
      // reasons the `getVideoStream` and `video.play` actions both has to be
      // started in response to user-action (e.g. click event). But the video
      // cannot play without source and obtaining the stream source is
      // asynchronous operation. On Android, you can play video stream from user
      // device without problem, but in Safari, you require two user-actions -
      // one for obtaining the stream and when it is ready, another action to
      // play the video. The workaround here triggers both secured actions at
      // once. It first attaches a dummy stream to the video to be able to play
      // it and at the same time, it requests the video stream from the device.
      // Then, when the video stream is ready, the video source is replaced and
      // the video is played again. Calling `video.play()` on already started
      // video does not require user-action.
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
  const pauseVideo = () => videoRef.current?.pause();

  return { startVideo, pauseVideo, videoEl, videoRef, videoState };
};

export type VideoStream = ReturnType<typeof useVideoStream>;
