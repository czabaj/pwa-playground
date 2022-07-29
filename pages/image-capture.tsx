import { ChangeEvent, ReactElement, useRef, useState } from "react";

import { LayoutDocs } from "../components/LayoutDocs";

const fileToImage = (file: File): Promise<HTMLImageElement> =>
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

const getResizedImage = (
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

type ImagePreviewProps = {
  width: number;
  children: (renderProps: {
    clear: () => void;
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
  return props.children({ clear, preview, renderFile, takePicture });
};

const CameraStream = (props: {
  takePicture: (video: HTMLVideoElement) => void;
  width: number;
}) => {
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
          const height = String(
            video.videoHeight / (video.videoWidth / props.width)
          );
          const width = String(props.width);
          video.setAttribute("width", width);
          video.setAttribute("height", height);
          setVideoState(`OK`);
        },
        (err) => {
          console.error(`Call to 'video.play' resulted in an error`, err);
        }
      );
  };

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
      <video ref={videoRef}>Video stream not available.</video>
    </>
  );
};

const ImageCapture = () => {
  return (
    <ImagePreview width={320}>
      {(imagePreview) => {
        const fileInputChangeHandler = (
          event: ChangeEvent<HTMLInputElement>
        ) => {
          if (event.target.files) {
            imagePreview.renderFile(event.target.files[0]);
          }
        };
        return (
          <LayoutDocs>
            <h2>Capturing images</h2>
            <p>There are three possible ways to get image data:</p>
            <ul>
              <li>
                <a href="#upload">
                  upload an image from file system of gallery
                </a>
                ,
              </li>
              <li>
                <a href="#camera-app">
                  open a camera application and take a photo
                </a>
                ,
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
              Uploading a file is an old-school solution, it works in any
              browser and on any platform. We can restrict the upload input to
              just images with <code>accept=&quot;image/*&quot;</code> attribute
              or to specific file types, e.g.{" "}
              <code>accept=&quot;.png*&quot;</code> to allow upload just PNG
              image types.
            </p>
            <h4>Example</h4>
            <label htmlFor="upload-input-1">
              Classic file upload input limited to accept only images
            </label>
            <input
              accept="image/*"
              id="upload-input-1"
              onChange={fileInputChangeHandler}
              type="file"
            />
            <h3 id="camera-app">Take a photo in external application</h3>
            <p>
              The file upload input was enhanced with ability to specify the
              source of the image with a{" "}
              <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/capture">
                <code>capture</code> attribute
              </a>
              . This attribute allows us to specify that we wish to capture an
              instant photo with users device, which is handled by a
              device&apos;s default camera application. We can specify that we
              wish to use the user-facing camera or device&apos;s rear-facing
              camera.
            </p>
            <p>
              This feature is meant to improve user experience, because
              technically, users can take an instant photo with classic file
              upload as well, although it requires more steps to find an option
              for doing so through the file-input system dialogs.
            </p>
            <h4 id="camera-app-browsers-support">Browsers devices</h4>
            <p>
              Unfortunately, the{" "}
              <a href="https://caniuse.com/mdn-html_elements_input_attributes_capture">
                <code>capture</code> attribute is not widely supported
              </a>
              . Generally, it shall work on Android mobile devices and not on
              Apple. Also, it does not work on desktop devices even if a
              web-camera is attached.
            </p>
            <p>
              According to some old sources, the <code>capture</code> attribute
              could have been used to specify, that the device shall open the
              user&apos;s image gallery with a{" "}
              <code>capture=&quot;filesystem&quot;</code> value, but such value
              is not listed in the specification and is therefor not guarantied
              to work.
            </p>
            <h4>Examples</h4>
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
              onChange={fileInputChangeHandler}
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
              id="camera-app-environment"
              onChange={fileInputChangeHandler}
              type="file"
            />
            <h3 id="camera-stream">Access the camera directly</h3>
            <p>
              Taking a video stream from devices camera is the most elaborative
              way for programmer, but is doable,{" "}
              <a href="https://caniuse.com/stream">
                has a very good devices support
              </a>{" "}
              and allows us to create complete experience for taking an instant
              pictures in a web application.
            </p>
            <h4>Example</h4>
            <p>
              To test the example, first click on the button bellow, which will
              ask you for giving the site permission for using your
              device&apos;s camera. The stream from the camera will then be
              displayed bellow the button and subsequent clicks on the button
              will shoot the instant images from the stream.
            </p>
            <CameraStream width={320} takePicture={imagePreview.takePicture} />
            <h3>Image preview</h3>
            The image source for the next chapter
            <div>{imagePreview.preview}</div>
          </LayoutDocs>
        );
      }}
    </ImagePreview>
  );
};
export default ImageCapture;
