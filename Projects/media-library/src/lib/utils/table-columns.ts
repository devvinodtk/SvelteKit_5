import type { Folder, Media } from "$lib/state/user-state.svelte";

export const mediaTableColumns = [
  {
    id: "thumbnail",
    label: "",
    accessor: (item: Media) => item.thumbnail || "",
    sortable: false,
  },
  {
    id: "name",
    label: "Name",
    accessor: (item: Media) => item.display_name,
    sortable: true,
  },
  {
    id: "mediaType",
    label: "Media Type",
    accessor: (item: Media) => "Image", // Replace with actual media type when available
    sortable: true,
  },
  {
    id: "folderPath",
    label: "Folder Path",
    accessor: (item: Media) => item.folder_id || "",
    sortable: true,
  },
  {
    id: "description",
    label: "Description",
    accessor: (item: Media) => item.description || "",
    sortable: true,
  },
  {
    id: "actions",
    label: "",
    accessor: (item: Media) => "",
    sortable: false,
  },
];

export const folderTableColumns = [
  {
    id: "folderName",
    label: "Folder Name",
    accessor: (item: Folder) => item.folder_name || "",
    sortable: true,
  },
  {
    id: "parentFolder",
    label: "Name",
    accessor: (item: Folder) => item.parent_folder_name,
    sortable: true,
  },
  {
    id: "mediaType",
    label: "Media Type",
    accessor: (item: Folder) => "Image", // Replace with actual media type when available
    sortable: true,
  },
  {
    id: "tags",
    label: "Tags",
    accessor: (item: Folder) => item.tag_names || "",
    sortable: true,
  },
  {
    id: "actions",
    label: "",
    accessor: (item: Folder) => "",
    sortable: false,
  },
];
