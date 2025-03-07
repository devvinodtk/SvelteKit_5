<script lang="ts">
  import { getUserState } from "$lib/state/user-state.svelte";
  let userContext = getUserState();
  const { tags, mediaTypes, folders } = $derived(userContext);

  let inputValue = $state<String>("");
  let tagsNames = $state<string[]>([]);
  let folderName = $state<string>("");
  let mediaTypeId = $state<number>();
  let parentFolderId = $state<number | null>(null);

  let tagsNamesString = $derived.by(() => tagsNames.join(","));

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      event.preventDefault();
      if (!tagsNames.includes(inputValue.trim())) {
        tagsNames = [...tagsNames, inputValue.trim()];
      }
      inputValue = "";
    }
  }

  function removeTag(index: number) {
    tagsNames = tagsNames.filter((_, i) => i !== index);
  }

  function handleSaveFolder() {
    userContext.insertNewFolder({
      folder_name: folderName,
      parent_folder_id: parentFolderId,
      tag_names: tagsNamesString,
      media_type_id: mediaTypeId,
    });
  }
</script>

<section class="default-margin">
  <form onsubmit={(e) => e.preventDefault()}>
    <div class="space-y-12">
      <div class="border-b border-gray-900/10 pb-12">
        <h2 class="text-base/7 font-semibold text-gray-900">Create Folders</h2>
        <p class="mt-1 text-sm/6 text-gray-600"></p>

        <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div class="sm:col-span-4">
            <label for="name" class="block text-sm/6 font-medium text-gray-900"
              >Folder Name</label
            >
            <div class="mt-2">
              <input
                id="name"
                name="name"
                type="text"
                bind:value={folderName}
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>
          <div class="sm:col-span-4">
            <label
              for="parentFolder"
              class="block text-sm/6 font-medium text-gray-900"
              >Parent Folder Name</label
            >
            <div class="mt-2 grid grid-cols-1">
              <select
                id="parentFolder"
                name="parentFolder"
                bind:value={parentFolderId}
                class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              >
                <option value={0}>Select Parent Folder</option>
                {#if folders && folders.length}
                  {#each folders as folder}
                    <option value={folder.id}>{folder.folder_path}</option>
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
          <div class="sm:col-span-4">
            <label for="tags" class="block text-sm/6 font-medium text-gray-900">
              Tags
            </label>
            <div class="mt-2">
              <input
                id="tags"
                name="tags"
                type="text"
                class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                bind:value={inputValue}
                onkeydown={handleKeyDown}
                placeholder="Add a tag and press Enter"
              />
            </div>
            <div class="mt-2 flex flex-wrap gap-2">
              {#each tagsNames as tag, index}
                <div
                  class="flex items-center gap-1 rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-900"
                >
                  {tag}
                  <button
                    onclick={() => removeTag(index)}
                    class="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    X
                  </button>
                </div>
              {/each}
            </div>
          </div>
          <div class="sm:col-span-4">
            <label
              for="country"
              class="block text-sm/6 font-medium text-gray-900"
              >Media Types</label
            >
            <div class="mt-2 grid grid-cols-1">
              <select
                id="mediaType"
                name="mediaType"
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
        </div>
      </div>
    </div>
    <div class="mt-6 flex items-center justify-end gap-x-6">
      <button type="button" class="text-sm/6 font-semibold text-gray-900"
        >Cancel</button
      >
      <button
        type="button"
        onclick={handleSaveFolder}
        class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >Save</button
      >
    </div>
  </form>
</section>
