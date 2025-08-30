import { supabase } from "@/lib/supabase/supabaseClient";

export interface UploadedImagesResponse {
  imgUrl: string;
  fileName: string;
}

class UploadsManager {
  private static bucket = "assets";

  static async uploadImages(files: File[]): Promise<UploadedImagesResponse[]> {
    try {
      const uploads = await Promise.all(
        files.map(async (file) => {
          const fileName = `${Date.now()}-${file.name}`;
          const { data, error } = await supabase.storage
            .from(this.bucket)
            .upload(fileName, file, {
              cacheControl: "3600",
              upsert: false,
            });

          if (error) throw error;

          const { data: publicUrlData } = supabase.storage
            .from(this.bucket)
            .getPublicUrl(fileName);

          return {
            fileName: data?.path || fileName,
            imgUrl: publicUrlData.publicUrl,
          };
        })
      );

      return uploads;
    } catch (error: any) {
      console.error("@@Error uploading image:", error.message || error);
      throw new Error(error.message || "Failed to upload images");
    }
  }

  static async deleteImages(imagePaths: string[]): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(this.bucket)
        .remove(imagePaths);

      if (error) throw error;

      return true;
    } catch (error: any) {
      console.error("@@Error deleting image:", error.message || error);
      return false;
    }
  }
}

export default UploadsManager;
