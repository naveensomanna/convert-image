import { Controller } from "./ui.js";
import { imageWand, formatToNumber } from "./imagewand.js";

(async () => {
  const {  ...controller } = Controller();

  let buf;
  controller.onSubmit(async (e,form) => {
    e.preventDefault();

    // Configures a second delay so user doesn't see flickering
    setTimeout(async () => {
      // Calls Golang WASM runtime and receive HTTP response
      const format = controller.getFormat(); // jpg or png
      const result = await imageWand();
      const arrayBuffer = await result.convertFromBlob(
        formatToNumber(format), // get the number 
        new Uint8Array(buf) // converting arrayBuffer to unit8array
      );
      const blob = new Blob([arrayBuffer]);

      // Creates local ObjectURL, used for download and display
      const objectURL = URL.createObjectURL(blob);
      const filename = `${objectURL.split("/").at(-1)}.${format}`;
      console.log(`Converted to ${filename} ✨`);

      // Triggers download
      controller.triggerDownload(filename, objectURL);

      // Clean ObjectURL (good practice)
      URL.revokeObjectURL(objectURL);
      buf = null;
      form.reset();
    }, 500);
    return false;
  });

  controller.onUploadedFile(async (target) => {
    const { files } = target;
    if (files && !files.length) return;

    if (files.length > 1) {
      alert("Only one image per time is allowed 👀");
      return;
    }

    if (!files[0].type.includes("image")) {
      alert("Only images are supported 👀");
      return;
    }

    buf = await files[0].arrayBuffer(); // javascript arraybuffer
  });
})();
