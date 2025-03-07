<script lang="ts">
  import { Input, Label, Select, Helper, Badge, Button } from "flowbite-svelte";
  import { getUserState } from "$lib/state/user-state.svelte";

  let userContext = getUserState();
  const { tags, mediaTypes, folders } = $derived(userContext);

  let folderName = $state<string>("");
  let parentFolderId = $state<number>();
  let mediaTypeId = $state<number>();
  let inputValue = $state<String>("");
  let tagNames = $state<string[]>([]);
  // let errorMessage = $state<string>("");
  let folderDuplicateError = $derived.by(() => {
    let existingFolder;
    if (folderName && parentFolderId) {
      existingFolder = folders?.find(
        (folder) =>
          folder.folder_name === folderName &&
          folder.parent_folder_id === parentFolderId,
      );
    }
    return existingFolder
      ? "The folder already exists. Please create a new folder."
      : "";
  });
  let tagsNamesString = $derived.by(() => tagNames.join(","));
  let { closeModal } = $props();

  const folderOptions = $derived.by(() => {
    let folderOptions: { value: number; name: string }[] = [];
    if (folders) {
      folders.filter((folder) => {
        folderOptions.push({
          value: folder.id,
          name: folder.folder_path ? folder.folder_path : "",
        });
      });
    }
    return folderOptions;
  });

  const mediaTypeOptions = $derived.by(() => {
    let mediaTypeOptions: { value: number; name: string }[] = [];
    if (mediaTypes) {
      mediaTypes.forEach((type) => {
        mediaTypeOptions.push({ value: type.id, name: type.name });
      });
    }
    return mediaTypeOptions;
  });

  const removeTag = (index: number) => {
    tagNames = tagNames.filter((_, i) => i !== index);
  };

  const handleAddTag = (e: KeyboardEvent) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      if (!tagNames.includes(inputValue.trim())) {
        tagNames = [...tagNames, inputValue.trim()];
      }
      inputValue = "";
    }
  };

  const handleSaveFolder = async () => {
    const response = await userContext.insertNewFolder({
      folder_name: folderName,
      parent_folder_id: parentFolderId,
      tag_names: tagsNamesString,
      media_type_id: mediaTypeId,
    });

    if (response && response?.status === 201) {
      closeModal();
    } else if (response && response.status === 409) {
      console.log(response.error);
    }
  };
</script>

<form>
  <div class="grid grid-cols-6 gap-6">
    <Label class="col-span-6 space-y-2">
      <span>Folder Name</span>
      <Input
        name="folder_name"
        class="border outline-none"
        placeholder="Provide a name for the folder"
        bind:value={folderName}
        required
      />
    </Label>
    <Label class="col-span-6 space-y-2">
      <span>Select Parent Folder</span>
      <Select
        items={folderOptions}
        class="font-normal"
        bind:value={parentFolderId}
      ></Select>
    </Label>
    <Label class="col-span-6 space-y-2">
      <span>Tag Names</span>
      <Input
        name="tag_name"
        class="border outline-none"
        placeholder="Add a tag and press Enter"
        bind:value={inputValue}
        onkeydown={handleAddTag}
        required
      />
      <Helper class="mt-2" color="green">
        {#each tagNames as tag, index}
          <Badge
            dismissable
            color="dark"
            class="mr-1"
            on:close={() => {
              removeTag(index);
            }}>{tag}</Badge
          >
        {/each}
      </Helper>
    </Label>
    <Label class="col-span-6 space-y-2">
      <span>Select Media Type</span>
      <Select
        items={mediaTypeOptions}
        class="font-normal"
        bind:value={mediaTypeId}
      ></Select>
    </Label>
  </div>
</form>
<div>
  <Button
    disabled={!!folderDuplicateError}
    type="button"
    on:click={handleSaveFolder}>Save Folder</Button
  >
</div>

<style>
</style>
