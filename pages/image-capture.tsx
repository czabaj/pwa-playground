import { ChangeEvent, ReactElement, useRef } from "react";

import { LayoutDocs } from "../components/LayoutDocs";
import { useVideoStream } from "../hook/useVideoStream";
import { fileToImage, getResizedImage } from "../utils/file";

const IMAGE_WIDTH = 320;

type ImagePreviewProps = {
  width: number;
  children: (renderProps: {
    clear: () => void;
    fileInputChangeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
    preview: ReactElement;
    takePicture: (video: HTMLVideoElement) => void;
    renderFile: (file: File) => void;
  }) => ReactElement;
};

const ImagePreview = (props: ImagePreviewProps) => {
  const photoRef = useRef<HTMLImageElement>(null);
  const preview = (
    <img alt="The screen capture will appear in this box." ref={photoRef} />
  );
  const clear = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d")!;
    const photo = photoRef.current!;
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);
    const data = canvas.toDataURL("image/png");
    photo.setAttribute("src", data);
  };
  const renderFile = (file: File) => {
    fileToImage(file).then((image) => {
      photoRef.current!.src = getResizedImage(image, props.width);
    });
  };
  const takePicture = (video: HTMLVideoElement) => {
    photoRef.current!.src = getResizedImage(video, props.width);
  };
  const fileInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      renderFile(event.target.files[0]);
    }
  };
  return props.children({
    clear,
    fileInputChangeHandler,
    preview,
    renderFile,
    takePicture,
  });
};

const CameraStream = (props: {
  takePicture: (video: HTMLVideoElement) => void;
  width: number;
}) => {
  const { startVideo, videoEl, videoRef, videoState } = useVideoStream(
    props.width,
    `user`
  );

  const buttonAction =
    videoState === `STAND_BY` || videoState === `KO`
      ? startVideo
      : videoState === `OK`
      ? () => props.takePicture(videoRef.current!)
      : undefined;

  return (
    <>
      <div>
        <button disabled={!buttonAction} onClick={buttonAction}>
          {videoState === `INITIALIZATION`
            ? `Initialization in progress`
            : videoState === `OK`
            ? `Take a picture`
            : `Initialize the video stream`}
        </button>
      </div>
      {videoEl}
    </>
  );
};

const ImageCapture = () => {
  return (
    <LayoutDocs>
      <h2>Capturing images</h2>
      <p>There are three possible ways to get image data:</p>
      <ul>
        <li>
          <a href="#upload">upload an image from file system of gallery</a>,
        </li>
        <li>
          <a href="#camera-app">open a camera application and take a photo</a>,
        </li>
        <li>
          <a href="#camera-stream">
            access the camera directly from the web app
          </a>
          .
        </li>
      </ul>
      <h3 id="upload">Upload an image</h3>
      <p>
        Uploading a file is an old-school solution, it works in any browser and
        on any platform. We can restrict the upload input to just images with{" "}
        <code>accept=&quot;image/*&quot;</code> attribute or to specific file
        types, e.g. <code>accept=&quot;.png*&quot;</code> to allow upload just
        PNG image types. Browsers on mobile phone handles such restricted file
        upload input in a nice way, when it detects that the input is restricted
        to images, it offers to the user pick image from system gallery or take
        an instant image with camera.
      </p>
      <h4>Example</h4>
      <ImagePreview width={IMAGE_WIDTH}>
        {(imagePreview) => {
          return (
            <>
              <label htmlFor="upload-input-1">
                Classic file upload input limited to accept only images
              </label>
              <input
                accept="image/*"
                id="upload-input-1"
                onChange={imagePreview.fileInputChangeHandler}
                type="file"
              />
              <div>{imagePreview.preview}</div>
            </>
          );
        }}
      </ImagePreview>
      <h3 id="camera-app">Take a photo in external application</h3>
      <p>
        The file upload input was enhanced with ability to specify the source of
        the image with a{" "}
        <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/capture">
          <code>capture</code> attribute
        </a>
        . This attribute allows us to specify that we wish to capture an instant
        photo with users device, which is handled by a device&apos;s default
        camera application. We can specify that we wish to use the user-facing
        camera or device&apos;s rear-facing camera.
      </p>
      <p>
        This feature is meant to improve user experience, because technically,
        users can take an instant photo with classic file upload as well,
        although it requires more steps to find an option for doing so through
        the file-input system dialogs.
      </p>
      <h4 id="camera-app-browsers-support">Browsers devices</h4>
      <p>
        The{" "}
        <a href="https://caniuse.com/mdn-html_elements_input_capture">
          <code>capture</code> attribute is well supported
        </a>
        . Generally, it shall work on mobile devices. It does not work on
        desktop devices even if a web-camera is attached.
      </p>
      <h4>Examples</h4>
      <ImagePreview width={IMAGE_WIDTH}>
        {(imagePreview) => {
          return (
            <>
              <label htmlFor="camera-app-user">
                This file upload input shall source an image from your{" "}
                <em>user-facing</em> camera. Works only on{" "}
                <a href="#camera-app-browsers-support">supported devices</a>,
                otherwise acts as ordinary upload file input.
              </label>
              <input
                accept="image/*"
                capture="user"
                id="camera-app-user"
                onChange={imagePreview.fileInputChangeHandler}
                type="file"
              />
              <label htmlFor="camera-app-environment">
                This file upload input shall source an image from your{" "}
                <em>rear-facing</em> camera. Works only on{" "}
                <a href="#camera-app-browsers-support">supported devices</a>,
                otherwise acts as ordinary upload file input.
              </label>
              <input
                accept="image/*"
                capture="environment"
                id="camera-app-user"
                onChange={imagePreview.fileInputChangeHandler}
                type="file"
              />
              <div>{imagePreview.preview}</div>
            </>
          );
        }}
      </ImagePreview>
      <h3 id="camera-stream">Access the camera directly</h3>
      <p>
        Taking a video stream from devices camera is the most elaborative way
        for programmer, but is doable,{" "}
        <a href="https://caniuse.com/stream">has a very good devices support</a>{" "}
        and allows us to create complete experience for taking an instant
        pictures in a web application.
      </p>
      <h4>Example</h4>
      <p>
        To test the example, first click on the button bellow, which will ask
        you for giving the site permission for using your device&apos;s camera.
        The stream from the camera will then be displayed bellow the button and
        subsequent clicks on the button will shoot the instant images from the
        stream.
      </p>
      <ImagePreview width={IMAGE_WIDTH}>
        {(imagePreview) => {
          return (
            <>
              <CameraStream
                width={IMAGE_WIDTH}
                takePicture={imagePreview.takePicture}
              />
              <div>{imagePreview.preview}</div>
            </>
          );
        }}
      </ImagePreview>
    </LayoutDocs>
  );
};
export default ImageCapture;
