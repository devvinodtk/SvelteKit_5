<script lang="ts">
  import { getUserState } from "$lib/state/user-state.svelte";
  import { generateImageThumbnail } from "$lib/utils/CustomUtility";
  let userContext = getUserState();
  const { tags, mediaTypes, folders } = $derived(userContext);
  import DropZone from "svelte-file-dropzone";

  let mediaTypeId = $state<number>();
  let file = $state<File | null>(null);
  let thumbnail = $state<File | null>(null);
  let mediaName = $state<string>("");
  let description = $state<string>("");

  let { folderPath, folderId } = $derived.by(() => {
    let folderPath: string | null = "No Path Found";
    let folderId = 0;
    folders?.filter((folder) => {
      if (folder.media_type_id == mediaTypeId) {
        folderId = folder.id;
        folderPath = folder.folder_path;
      }
    });
    return { folderPath, folderId };
  });

  async function handleFileDrop(event: CustomEvent<any>) {
    const { acceptedFiles } = event.detail;
    if (acceptedFiles.length) {
      file = acceptedFiles[0] as File;
      thumbnail = await generateImageThumbnail(file);
    }
  }
  function handleMediaSave() {
    if (file && thumbnail && mediaTypeId && folderId && mediaName) {
      userContext.saveNewMedia(
        file,
        mediaName,
        description,
        thumbnail,
        folderId,
        folderPath,
      );
    }
  }
  $inspect(thumbnail);
</script>

<section class="default-margin">
  <form onsubmit={(e) => e.preventDefault()}>
    <div class="space-y-12">
      <div class="border-b border-gray-900/10 pb-12">
        {folderPath}
        <h2 class="text-base/7 font-semibold text-gray-900">Upload Media</h2>
        <p class="mt-1 text-sm/6 text-gray-600">
          Upload a media by selecting the media type. The folder will be
          selected based on the media type.
        </p>
        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div class="sm:col-span-4">
            <label
              for="mediaName"
              class="block text-sm/6 font-medium text-gray-900"
              >Media Name</label
            >
            <div class="mt-2">
              <input
                type="text"
                name="mediaName"
                id="mediaName"
                bind:value={mediaName}
                autocomplete="given-name"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div class="col-span-full">
            <label
              for="description"
              class="block text-sm/6 font-medium text-gray-900"
              >Description</label
            >
            <div class="mt-2">
              <textarea
                bind:value={description}
                name="description"
                id="description"
                rows="3"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              ></textarea>
            </div>
            <p class="mt-3 text-sm/6 text-gray-600">
              Write a description about the media.
            </p>
          </div>

          <div class="col-span-full">
            <label
              for="cover-photo"
              class="block text-sm/6 font-medium text-gray-900"
              >Media File</label
            >
            <div
              class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
            >
              <DropZone
                on:drop={handleFileDrop}
                multiple={false}
                maxSize={10 * 1024 * 1024}
                containerClasses="dropzone-cover"
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
                      <span>Upload a file</span>
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs/5 text-gray-600">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </DropZone>
            </div>
          </div>

          <div class="col-span-full">
            {#if thumbnail}
              <div class="mt-2 flex items-center gap-x-3">
                <img
                  src={URL.createObjectURL(thumbnail)}
                  alt="Thumbnail"
                  class="w-20 h-20 rounded-md object-cover"
                />
              </div>
            {/if}

            <div class="col-span-full">
              <div class="mt-2 grid grid-cols-1">
                <select
                  id="parentFolder"
                  name="parentFolder"
                  bind:value={mediaTypeId}
                  class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                >
                  <option value={0}>Select Media Type</option>
                  {#if mediaTypes && mediaTypes.length}
                    {#each mediaTypes as mediaType}
                      <option value={mediaType.id}>{mediaType.name}</option>
                    {/each}
                  {/if}
                </select>
                <svg
                  class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  aria-hidden="true"
                  data-slot="icon"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <div class="col-span-full">
              <label
                for="about"
                class="block text-sm/6 font-medium text-gray-900"
                >Folder Path</label
              >
              <div class="mt-2">
                <p class="mt-1 text-sm/6 text-gray-600">
                  Folder Path: {folderPath}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-6 flex items-center justify-end gap-x-6">
      <button type="button" class="text-sm/6 font-semibold text-gray-900"
        >Cancel</button
      >
      <button
        type="button"
        onclick={handleMediaSave}
        class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >Save</button
      >
    </div>
  </form>
</section>
