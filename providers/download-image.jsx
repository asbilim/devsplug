import { useState } from "react";
import html2canvas from "html2canvas";

export const useDownloadImage = ({
  ref,
  scale,
  user,
  unique_id,
  normalClass,
  captureClass,
}) => {
  const [className, setClassName] = useState(normalClass);

  const downloadImage = () => {
    if (ref.current) {
      // Change the class for capture
      setClassName(captureClass);

      // Delay the screenshot to allow the DOM to update
      setTimeout(() => {
        html2canvas(ref.current, { scale: scale })
          .then((canvas) => {
            const image = canvas.toDataURL("image/jpeg");
            const link = document.createElement("a");
            link.href = image;
            link.download = user ? `${user.username}-${unique_id}` : unique_id;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Reset class name back to normal, ensure it's done after the capture
            setClassName(normalClass);
          })
          .catch((error) => {
            console.error("Error capturing image:", error);
            // Ensure we reset class name even if there's an error
            setClassName(normalClass);
          });
      }, 100); // 100 milliseconds delay
    }
  };

  return [downloadImage, className];
};
