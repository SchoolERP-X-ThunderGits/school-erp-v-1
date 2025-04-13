export const UploadFile = (file) => {
    return new Promise((resolve, reject) => {
        const url = `https://api.cloudinary.com/v1_1/dcfrxghei/upload`;
        const fd = new FormData();

        fd.append("upload_preset", "myschool");
        fd.append("file", file);

        fetch(url, {
            method: "POST",
            body: fd,
        })
            .then((response) => response.json())
            .then((data) => {
                // File uploaded successfully, return the URL
                const fileUrl = data.secure_url;
                console.log(fileUrl);
                resolve(fileUrl);
            })
            .catch((error) => {
                console.error("Error uploading the file:", error);
                // Reject the promise with an error message
                reject("Error uploading the file");
            });
    });
};
