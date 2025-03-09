<script lang="ts">
  import { Modal } from "$components";
  import type { Media } from "$lib/state/user-state.svelte";
  import {
    Avatar,
    Button,
    Heading,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    Toolbar,
    Tooltip,
  } from "flowbite-svelte";
  import {
    EditOutline,
    PlusOutline,
    TrashBinOutline,
  } from "flowbite-svelte-icons";
  import { getUserState } from "$lib/state/user-state.svelte";
  let userContext = getUserState();
  let { media, folders, user } = $derived(userContext);
  let openModal = $state(false);
  let itemToEdit = $state<Media>();
  let currentForm = $state<"manage-media" | "delete-confirmation">(
    "manage-media",
  );
  let modalHeading = $state<string>("");

  const folderPath = (parentFolderId: number) =>
    folders?.find((folder) => folder.id == parentFolderId)?.folder_path;
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
            itemToEdit = undefined;
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
      <TableHeadCell>Folder Path</TableHeadCell>
      <TableHeadCell>Description</TableHeadCell>
      <TableHeadCell>
        <span class="sr-only">Edit</span>
      </TableHeadCell>
    </TableHead>
    {#if media}
      <TableBody tableBodyClass="divide-y">
        {#each media.sort( (a, z) => a.display_name.localeCompare(z.display_name), ) as item (item)}
          <TableBodyRow>
            <TableBodyCell>
              {#if item.thumbnail}
                <Avatar src={item.thumbnail} />
              {/if}
            </TableBodyCell>
            <TableBodyCell>{item.display_name}</TableBodyCell>
            <TableBodyCell>Image</TableBodyCell>
            <TableBodyCell>{folderPath(item.folder_id)}</TableBodyCell>
            <TableBodyCell>{item.description}</TableBodyCell>
            <TableBodyCell>
              <button
                onclick={() => {
                  openModal = true;
                  modalHeading = "Edit Media";
                  currentForm = "manage-media";
                  itemToEdit = item;
                }}
                class="font-medium mr-2 text-primary-600 hover:underline dark:text-primary-500"
                ><EditOutline /></button
              >

              <button
                id={`delete_${item.id}`}
                title="Delete"
                onclick={() => {
                  openModal = true;
                  modalHeading = "Delete Media";
                  currentForm = "delete-confirmation";
                  itemToEdit = item;
                }}
                class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                ><TrashBinOutline /></button
              >
              <Tooltip triggeredBy={`delete_${item.id}`}>Delete</Tooltip>
            </TableBodyCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    {/if}
  </Table>
</main>

<Modal bind:open={openModal} item={itemToEdit} {currentForm} {modalHeading}
></Modal>
