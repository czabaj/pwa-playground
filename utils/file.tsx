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
