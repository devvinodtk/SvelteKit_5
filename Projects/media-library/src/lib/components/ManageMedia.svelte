<script lang="ts">
  import {
    Label,
    Input,
    Textarea,
    Button,
    Select,
    Avatar,
  } from "flowbite-svelte";
  import { getUserState } from "$lib/state/user-state.svelte";
  import DropZone from "svelte-file-dropzone";
  import { generateImageThumbnail } from "$lib/utils/CustomUtility";
  let { closeModal } = $props();
  let userContext = getUserState();
  const { mediaTypes, folders } = $derived(userContext);

  let file = $state<File | null>(null);
  let thumbnail = $state<File | null>();
  let mediaName = $state<string>("");
  let description = $state<string>("");
  let mediaTypeId = $state<number>();
  let folderId = $state<number>();
  let errorMessage = $state<string>("");

  const folderPath = $derived.by(
    () => folders?.find((folder) => folder.id == folderId)?.folder_path,
  );

  const mediaTypeOptions = $derived.by(() => {
    let mediaTypeOptions: { value: number; name: string }[] = [];
    if (mediaTypes) {
      mediaTypes.forEach((type) => {
        mediaTypeOptions.push({ value: type.id, name: type.name });
      });
    }
    return mediaTypeOptions;
  });

  const folderOptions = $derived.by(() => {
    let folderOptions: { value: number; name: string }[] = [];
    if (folders) {
      folders.filter((folder) => {
        if (folder.media_type_id == mediaTypeId) {
          folderOptions.push({
            value: folder.id,
            name: folder.folder_path ? folder.folder_path : "",
          });
        }
      });
    }
    return folderOptions;
  });

  const handleFileDrop = async (event: CustomEvent<any>) => {
    const { acceptedFiles } = event.detail;
    if (acceptedFiles.length) {
      file = acceptedFiles[0] as File;
      thumbnail = await generateImageThumbnail(file);
    }
  };

  const handleNewMediaSave = async () => {
    if (
      file &&
      thumbnail &&
      mediaTypeId &&
      folderId &&
      mediaName &&
      folderPath
    ) {
      const res = await userContext.saveNewMedia(
        file,
        mediaName,
        description,
        thumbnail,
        folderId,
        folderPath,
      );

      if (res && res.error) {
        errorMessage = "An error occurred while saving the media.";
      } else if (res && res.status === 201) {
        closeModal();
      }
    }
  };
</script>

<form>
  <div class="grid grid-cols-6 gap-6">
    <Label class="col-span-6 space-y-2">
      <span>Media Name</span>
      <Input
        name="media_name"
        class="border outline-none"
        placeholder="Provide a name for the media"
        bind:value={mediaName}
        required
      />
    </Label>
    <Label class="col-span-6 space-y-2">
      <span>Description</span>
      <Textarea
        id="description"
        rows={4}
        class="bg-gray-50 outline-none dark:bg-gray-700"
        placeholder="Provide a description about the media"
        bind:value={description}
      ></Textarea>
    </Label>
    <DropZone
      on:drop={handleFileDrop}
      multiple={false}
      maxSize={10 * 1024 * 1024}
      containerClasses="col-span-6 space-y-2 sm:col-span-4"
    >
      <div class="text-center">
        <svg
          class="mx-auto size-12 text-gray-300"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          data-slot="icon"
        >
          <path
            fill-rule="evenodd"
            d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
            clip-rule="evenodd"
          />
        </svg>
        <div class="mt-4 flex text-sm/6 text-gray-600">
          <label
            for="file-upload"
            class="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:outline-hidden hover:text-indigo-500"
          >
            <span>{`${file ? "different" : "Upload a file"} `}</span>
          </label>
          <p class="pl-1">or drag and drop</p>
        </div>
        <p class="text-xs/5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
      </div>
    </DropZone>
    <div
      class="border-gray-200 border-2 border-dashed col-span-6 space-y-2 sm:col-span-2 flex flex-col items-center justify-center"
    >
      <div class="flex flex-col items-center text-center justify-center w-full">
        <Avatar
          class="mb-4 h-15 w-15 rounded-lg mt-1 sm:mb-0 xl:mb-4 2xl:mb-0"
          src={thumbnail ? URL.createObjectURL(thumbnail) : ""}
        />
      </div>
      <span class=" font-normal text-center">Thumbnail</span>
    </div>
    <Label class="col-span-6 space-y-2">
      <span>Select Media Type</span>
      <Select
        items={mediaTypeOptions}
        class="font-normal"
        bind:value={mediaTypeId}
      ></Select>
    </Label>
    <Label class="col-span-6 space-y-2">
      <span>Select Folder</span>
      <Select items={folderOptions} class="font-normal" bind:value={folderId}
      ></Select>
    </Label>
  </div>
</form>
<div>
  <Button type="button" onclick={handleNewMediaSave}>Save Media</Button>
</div>
