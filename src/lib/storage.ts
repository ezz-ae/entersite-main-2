import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { firebaseApp } from "@/firebase";

const storage = getStorage(firebaseApp);

export interface UploadResult {
  url: string;
  path: string;
}

export const ProjectLibrary = {
  
  /**
   * Uploads a file to the specific project folder
   */
  uploadAsset: async (projectId: string, file: File, type: 'images' | 'brochures' | 'floorplans'): Promise<UploadResult> => {
    const path = `projects/\${projectId}/\${type}/\${file.name}`;
    const storageRef = ref(storage, path);
    
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    
    return { url, path };
  },

  /**
   * Lists all assets for a project
   */
  getAssets: async (projectId: string): Promise<string[]> => {
    const projectRef = ref(storage, `projects/\${projectId}`);
    // This assumes a flat structure or requires recursive listing. 
    // For V1, we'll listing images.
    const imagesRef = ref(storage, `projects/\${projectId}/images`);
    
    try {
      const res = await listAll(imagesRef);
      const urls = await Promise.all(res.items.map(item => getDownloadURL(item)));
      return urls;
    } catch (error) {
      console.error("Error fetching assets:", error);
      return [];
    }
  },

  /**
   * "Purification" Helper: Takes a scraped URL, downloads it, and uploads to our storage
   */
  migrateExternalAsset: async (projectId: string, externalUrl: string, type: 'images' | 'brochures'): Promise<string> => {
    try {
        // 1. Fetch the external image
        const response = await fetch(externalUrl);
        const blob = await response.blob();
        
        // 2. Generate a filename
        const ext = externalUrl.split('.').pop()?.split('?')[0] || 'jpg';
        const filename = `imported-\${Date.now()}.\${ext}`;
        
        // 3. Upload to our storage
        const path = `projects/\${projectId}/\${type}/\${filename}`;
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, blob);
        
        // 4. Return our new internal URL
        return await getDownloadURL(storageRef);
    } catch (error) {
        console.error(`Failed to migrate asset for \${projectId}:`, error);
        return externalUrl; // Fallback to original if fail
    }
  }
};
