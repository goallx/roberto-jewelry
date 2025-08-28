import {
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "@/lib/firebaseAdmin";

export interface UploadedImagesResponse {
  imgUrl: string;
  fileName: string;
}

class ImagesUploadManager {
  private imagesPath: string = "images/";

  uploadFile = async (file: File): Promise<UploadedImagesResponse> => {
    const uniqueName = `${Date.now()}_${file.name.trim() ?? ""}`;
    const fileRef = ref(storage, this.imagesPath + uniqueName);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    return { imgUrl: downloadURL, fileName: uniqueName };
  };

  deleteFile = async (fileName: string) => {
    const fileRef = ref(storage, this.imagesPath + fileName);
    await deleteObject(fileRef);
    return;
  };
}

export const imagesManager = new ImagesUploadManager();
