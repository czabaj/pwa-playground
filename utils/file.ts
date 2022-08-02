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
