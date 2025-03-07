import type { Folder } from "$lib/state/user-state.svelte";
import { thumbHashToDataURL, rgbaToThumbHash } from "thumbhash";

export function generateFolderPaths(folders: Folder[]) {
  const folderMap = new Map();

  // Create a map for quick lookup
  folders.forEach((folder) => {
    folderMap.set(folder.id, folder);
  });

  // Function to construct folder path
  function getFolderPath(folder: Folder) {
    const path = [];
    while (folder) {
      path.unshift(folder.folder_name);
      folder = folderMap.get(folder.parent_folder_id) || null;
    }
    return path.join("/");
  }

  // Generate new array with folder_path
  return folders.map((folder) => ({
    ...folder,
    folder_path: getFolderPath(folder),
  }));
}

export async function generateImageThumbnail(file: File): Promise<File | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target || typeof e.target.result !== "string") {
        reject(new Error("Failed to read file"));
        return;
      }

      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const maxWidth = 100;
        const maxHeight = 100;
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const aspectRatio = width / height;
          if (width > height) {
            width = maxWidth;
            height = Math.round(maxWidth / aspectRatio);
          } else {
            height = maxHeight;
            width = Math.round(maxHeight * aspectRatio);
          }
        }
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = width;
        canvas.height = height;

        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, width, height);
        const hash = rgbaToThumbHash(
          imageData.width,
          imageData.height,
          imageData.data,
        );
        const thumbnailDataURL = thumbHashToDataURL(hash);
        dataURLToFile(thumbnailDataURL, `${new Date().getTime()}_thumbnail.png`)
          .then((thumbnail) => resolve(thumbnail))
          .catch(reject);
      };

      img.onerror = () => reject(new Error("Failed to load image"));
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

async function dataURLToFile(dataURL: string, filename: string): Promise<File> {
  const response = await fetch(dataURL);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
}
