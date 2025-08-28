import { UploadedImagesResponse } from "@/app/api/uploads/images/manager";

class UploadsManager {
  static async uploadImages(files: File[]): Promise<UploadedImagesResponse[]> {
    const formData = new FormData();
    files?.forEach((image) => {
      if (image) formData.append("images", image);
    });

    try {
      const response = await fetch("/api/uploads/images", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("@@Failed to upload image");
      }

      const { data } = await response.json();
      return data;
    } catch (error: any) {
      throw new Error("@@Error uploading image:", error.message || error);
    }
  }

  static async deleteImages(images: string[]): Promise<boolean> {
    try {
      const response = await fetch("/api/uploads/images", {
        method: "DELETE",
        body: JSON.stringify(images),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to delete image");
      }
      return true;
    } catch (error) {
      console.error("Error deleting image:", error);
      return false;
    }
  }
}

export default UploadsManager;
