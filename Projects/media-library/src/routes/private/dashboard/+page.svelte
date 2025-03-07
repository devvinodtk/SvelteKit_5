<script lang="ts">
  import {
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
  } from "flowbite-svelte";

  import { Button, Avatar, Heading, Toolbar, Badge } from "flowbite-svelte";
  import { PlusOutline } from "flowbite-svelte-icons";
  import { getUserState } from "$lib/state/user-state.svelte";
  import { Modal } from "$components";
  let userContext = getUserState();
  let openModal = $state(false);
  let modalHeading = $state<string>("");
  let currentForm = $state<"manage-media" | "manage-folder">("manage-media");
  let { media, folders } = $derived(userContext);

  function handleAddUser() {
    openModal = true;
  }
</script>

<main class="relative h-full w-full overflow-y-aut dark:bg-gray-800 p-4">
  <div class="p-4">
    <Heading
      tag="h1"
      class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl"
    >
      All Media
    </Heading>
    <Toolbar embedded class="w-full py-4 text-gray-500  dark:text-gray-400">
      <div slot="end" class="flex items-center space-x-2">
        <Button
          size="sm"
          class="gap-2 whitespace-nowrap px-3"
          on:click={() => {
            openModal = true;
            modalHeading = "Add Media";
            currentForm = "manage-media";
          }}
        >
          <PlusOutline size="sm" />Add Media
        </Button>
      </div>
    </Toolbar>
  </div>
  <Table shadow hoverable={true}>
    <TableHead>
      <TableHeadCell></TableHeadCell>
      <TableHeadCell>Name</TableHeadCell>
      <TableHeadCell>Media Type</TableHeadCell>
      <TableHeadCell>Description</TableHeadCell>
      <TableHeadCell>Tags</TableHeadCell>
      <TableHeadCell>
        <span class="sr-only">Edit</span>
      </TableHeadCell>
    </TableHead>
    {#if media}
      <TableBody tableBodyClass="divide-y">
        {#each media as item}
          <TableBodyRow>
            <TableBodyCell>
              {#if item.thumbnail}
                <Avatar src={item.thumbnail} />
              {/if}
            </TableBodyCell>
            <TableBodyCell>{item.display_name}</TableBodyCell>
            <TableBodyCell>Image</TableBodyCell>
            <TableBodyCell>{item.description}</TableBodyCell>
            <TableBodyCell></TableBodyCell>
            <TableBodyCell>
              <button
                onclick={() => {
                  openModal = true;
                  modalHeading = "Edit Media";
                  currentForm = "manage-media";
                }}
                class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >Edit</button
              >
            </TableBodyCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    {/if}
  </Table>
</main>

<main class="relative h-full w-full overflow-y-aut dark:bg-gray-800 p-4">
  <div class="p-4">
    <Heading
      tag="h1"
      class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl"
    >
      All Folders
    </Heading>
    <Toolbar embedded class="w-full py-4 text-gray-500  dark:text-gray-400">
      <div slot="end" class="flex items-center space-x-2">
        <Button
          size="sm"
          class="gap-2 whitespace-nowrap px-3"
          on:click={() => {
            openModal = true;
            modalHeading = "Add Folder";
            currentForm = "manage-folder";
          }}
        >
          <PlusOutline size="sm" />Add Folder
        </Button>
      </div>
    </Toolbar>
  </div>
  <Table shadow hoverable={true}>
    <TableHead>
      <TableHeadCell>Folder Name</TableHeadCell>
      <TableHeadCell>Parent Folder</TableHeadCell>
      <TableHeadCell>Media Type</TableHeadCell>
      <TableHeadCell>Tags</TableHeadCell>
      <TableHeadCell>
        <span class="sr-only">Edit</span>
      </TableHeadCell>
    </TableHead>
    {#if folders}
      <TableBody tableBodyClass="divide-y">
        {#each folders as item}
          <TableBodyRow>
            <TableBodyCell>{item.folder_name}</TableBodyCell>
            <TableBodyCell>{item.parent_folder_name}</TableBodyCell>
            <TableBodyCell>{item.media_type_name}</TableBodyCell>
            <TableBodyCell>
              {#if item.tag_names}
                {#each item.tag_names.split(",") as tagName}
                  <Badge class="mr-2" color="dark">{tagName}</Badge>
                {/each}
              {/if}
            </TableBodyCell>
            <TableBodyCell>
              <button
                onclick={() => {
                  openModal = true;
                  modalHeading = "Edit Folder";
                  currentForm = "manage-folder";
                }}
                class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >Edit</button
              >
            </TableBodyCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    {/if}
  </Table>
</main>

<Modal bind:open={openModal} {currentForm} {modalHeading}></Modal>
