<script lang="ts">
  import { Modal } from "$components";
  import type { Folder } from "$lib/state/user-state.svelte";
  import {
    Badge,
    Button,
    Heading,
    Table,
    TableBody,
    TableBodyCell,
    TableBodyRow,
    TableHead,
    TableHeadCell,
    Toolbar,
  } from "flowbite-svelte";
  import {
    EditOutline,
    PlusOutline,
    TrashBinOutline,
  } from "flowbite-svelte-icons";

  import { getUserState } from "$lib/state/user-state.svelte";
  let userContext = getUserState();
  let { folders } = $derived(userContext);
  let openModal = $state(false);
  let itemToEdit = $state<Folder>();
  let currentForm = $state<"manage-folder" | "delete-confirmation">(
    "manage-folder",
  );
  let modalHeading = $state<string>("");
</script>

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
            itemToEdit = undefined;
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
        {#each folders.sort( (a, z) => a.folder_name.localeCompare(z.folder_name), ) as item (item)}
          <TableBodyRow>
            <TableBodyCell>{item.folder_name}</TableBodyCell>
            <TableBodyCell>{item.parent_folder_name}</TableBodyCell>
            <TableBodyCell>{item.media_type_name}</TableBodyCell>
            <TableBodyCell>
              {#if item.tag_names}
                {#each item.tag_names.split(",") as tagName (tagName)}
                  <Badge class="mr-2" color="dark">{tagName}</Badge>
                {/each}
              {/if}
            </TableBodyCell>
            <TableBodyCell>
              <button
                onclick={() => {
                  openModal = true;
                  itemToEdit = item;
                  modalHeading = "Edit Folder";
                  currentForm = "manage-folder";
                }}
                class="font-medium mr-2 text-primary-600 hover:underline dark:text-primary-500"
                ><EditOutline /></button
              >

              <button
                id={`delete_${item.id}`}
                title="Delete"
                onclick={() => {
                  openModal = true;
                  modalHeading = "Delete Folder";
                  currentForm = "delete-confirmation";
                  itemToEdit = item;
                }}
                class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                ><TrashBinOutline /></button
              >
            </TableBodyCell>
          </TableBodyRow>
        {/each}
      </TableBody>
    {/if}
  </Table>
</main>

<Modal bind:open={openModal} item={itemToEdit} {currentForm} {modalHeading}
></Modal>
