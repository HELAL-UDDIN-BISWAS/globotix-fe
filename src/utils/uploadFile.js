const UPLOAD_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/upload`;

export const uploadFile = async (fileInput) => {
  // file input must be a File object
  try {
    const form = new FormData();
    form.append("files", fileInput);

    const response = await fetch(UPLOAD_URL, {
      method: "POST",
      headers: {},
      body: form,
    });

    const json = await response?.json();

    const fileId = json[0]?.id;

    return fileId;
  } catch (err) {
    console.error("Caught error in uploadFile. ", err);
    return null;
  }
};
