import type { Folder } from "$lib/state/user-state.svelte";

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
          if (aspectRatio > 1) {
            // Landscape image
            width = maxWidth;
            height = Math.round(maxWidth / aspectRatio);
          } else {
            // Portrait or square image
            height = maxHeight;
            width = Math.round(maxHeight * aspectRatio);
          }
        }

        // Create canvas and draw the resized image
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // Draw the image on the canvas with the new dimensions
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to blob and then to File
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("Failed to create image blob"));
            return;
          }

          // Create a new file with timestamp to ensure uniqueness
          const thumbnail = new File(
            [blob],
            `${new Date().getTime()}_thumbnail.png`,
            { type: "image/png" },
          );

          resolve(thumbnail);
        }, "image/png");
      };

      img.onerror = () => reject(new Error("Failed to load image"));
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
