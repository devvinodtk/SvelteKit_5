<script lang="ts">
  import { ManageFolder, ManageMedia } from "$components";
  import { Modal } from "flowbite-svelte";

  let {
    open = $bindable(),
    modalHeading,
    currentForm,
  }: {
    open: boolean;
    modalHeading: string;
    currentForm: "manage-media" | "manage-folder";
  } = $props();

  const closeModal = () => {
    open = false;
  };
</script>

<Modal bind:open title={modalHeading} size="md" class="m-4">
  {#if currentForm === "manage-media"}
    <ManageMedia />
  {/if}
  {#if currentForm === "manage-folder"}
    <ManageFolder {closeModal} />
  {/if}
</Modal>
