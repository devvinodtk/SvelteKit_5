import { goto } from "$app/navigation";
import { generateFolderPaths } from "$lib/utils/CustomUtility";
import type { Session, SupabaseClient, User } from "@supabase/supabase-js";
import { setContext, getContext } from "svelte";

interface UserStateProps {
  session: Session | null;
  supabase: SupabaseClient | null;
  user: User | null;
}

type Tags = {
  created_at: string;
  id: number;
  name: string;
  user_id: string;
};

type MediaTypes = {
  created_at: string;
  id: number;
  name: string;
  user_id: string;
};

export type Folder = {
  id: number;
  folder_name: string;
  parent_folder_id: number | null;
  parent_folder_name: string | null;
  media_type_id: number;
  media_type_name: string;
  tag_names: string;
  user_id: string;
  folder_path: string | null;
};

type Media = {
  created_at: string;
  description: string | null;
  display_name: string;
  folder_id: number;
  id: number;
  name: string;
  thumbnail: string | null;
  user_id: string;
};

type UpdatableMedia = Omit<Media, "id" | "user_id" | "created_at">;

type UpdatableFolder = Omit<
  Folder,
  "id" | "user_id" | "media_type_name" | "parent_folder_name"
>;

export class UserState {
  session = $state<Session | null>(null);
  supabase = $state<SupabaseClient | null>(null);
  user = $state<User | null>(null);
  userName = $state<String | null>(null);
  tags = $state<Tags[] | null>([]);
  mediaTypes = $state<MediaTypes[] | null>([]);
  folders = $state<Folder[] | null>([]);
  media = $state<Media[] | null>([]);

  constructor(data: UserStateProps) {
    this.updateState(data);
  }

  updateState(data: UserStateProps) {
    this.session = data.session;
    this.supabase = data.supabase;
    this.user = data.user;
    this.fetchUserData();
  }

  async fetchUserData() {
    if (!this.user || !this.supabase) {
      return;
    }
    const userId = this.user.id;

    const [
      userResponse,
      mediaResponse,
      tagsResponse,
      mediaTypeResponse,
      foldersResponse,
    ] = await Promise.all([
      this.supabase
        .from("user_names")
        .select("name")
        .eq("user_id", userId)
        .single(),
      this.supabase.from("media").select("*").eq("user_id", userId),
      this.supabase.from("tags").select("*").eq("user_id", this.user.id),
      this.supabase.from("media_types").select("*").eq("user_id", this.user.id),
      this.supabase.rpc("folders_media_types_mapping"),
    ]);

    if (
      userResponse.error ||
      mediaResponse.error ||
      tagsResponse.error ||
      mediaTypeResponse.error ||
      foldersResponse.error
    ) {
      console.error("Error fetching user data");
      console.error({
        userError: userResponse.error,
        mediaError: mediaResponse.error,
        tagsError: tagsResponse.error,
        mediaTypeError: mediaTypeResponse.error,
        foldersError: foldersResponse.error,
      });
      return;
    }

    this.userName = userResponse.data?.name;
    this.media = mediaResponse.data;
    this.tags = tagsResponse.data;
    this.mediaTypes = mediaTypeResponse.data;
    if (foldersResponse.data && foldersResponse.data.length) {
      this.folders = generateFolderPaths(foldersResponse.data);
    }
  }

  async saveNewMedia(
    mediaFile: File,
    mediaName: string,
    description: string,
    thumbNail: File,
    folderId: number,
    folderPath: string,
  ) {
    if (!this.supabase || !this.user) {
      return;
    }
    const fileName = `${new Date().getTime()}_${mediaFile.name.split(".").pop()}`;
    let filePath = encodeURIComponent(
      `${this.user.id}/${folderPath}/${fileName}`,
    );
    let thumbNailPath = `${this.user.id}/thumbNails/${folderPath}/${thumbNail.name}`;
    let [mediaResponse, thumbNailResponse] = await Promise.all([
      this.supabase.storage.from("media-lib").upload(filePath, mediaFile),
      this.supabase.storage.from("media-lib").upload(thumbNailPath, thumbNail),
    ]);

    if (mediaResponse.error || thumbNailResponse.error) {
      console.error("Error uploading media");
      console.error({
        mediaError: mediaResponse.error,
        thumbNailError: thumbNailResponse.error,
      });
      return { status: 400, error: "Error uploading media" };
    }

    // const fileUrl = this.supabase.storage
    //   .from("media-lib")
    //   .getPublicUrl(filePath);

    const thumbNailUrl = this.supabase.storage
      .from("media-lib")
      .getPublicUrl(thumbNailPath);

    const response = await this.insertNewMedia({
      name: fileName,
      display_name: mediaName,
      description,
      thumbnail: thumbNailUrl.data.publicUrl,
      folder_id: folderId,
    });

    return response;
  }

  async insertNewMedia(insertObject: Partial<UpdatableMedia>) {
    if (!this.supabase || !this.user) {
      return;
    }
    const { status, error } = await this.supabase
      .from("media")
      .insert(insertObject)
      .eq("id", this.user.id);

    return { status, error };
  }

  async insertNewFolder(insertObject: Partial<UpdatableFolder>) {
    if (!this.supabase || !this.user) {
      return;
    }

    const { status, error } = await this.supabase
      .from("folders")
      .insert(insertObject)
      .eq("id", this.user.id);

    return { status, error };
  }

  async logout() {
    await this.supabase?.auth.signOut();
    goto("/login");
  }
}

// Ensure uniqueness of the instance
const USER_STATE_KEY = Symbol("USER_STATE");

export function setUserState(data: UserStateProps) {
  return setContext(USER_STATE_KEY, new UserState(data));
}

export function getUserState() {
  return getContext<ReturnType<typeof setUserState>>(USER_STATE_KEY);
}
