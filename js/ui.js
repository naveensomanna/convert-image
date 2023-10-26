export const Controller = () => {
   
    const formatDropdown = document.querySelector('select[name="format"]');
    const uploader = document.querySelector("#uploader");
    const form = document.querySelector("form");
  
    
  
    return {
     
      onSubmit: (cb) => {
        form.onsubmit = (e) => {
            e.preventDefault();
            cb(e);
          };
    
      },
      onUploadedFile: (cb) => {
        uploader.onchange = (el) => {
          cb(el.target);
        };
      },
      triggerDownload: (filename, objectURL) => {
        document.querySelector("#output > a").href = objectURL;
        document.querySelector("#output > a").download = filename;
        document.querySelector("#output > a").click();
      },
      getFormat: () => {
        return formatDropdown.value;
      },
    };
  };