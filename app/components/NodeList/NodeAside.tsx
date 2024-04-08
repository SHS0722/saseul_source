import {
  SimpleForm, TextInput,
  useListContext,
  useUpdateMany
} from "react-admin";

export function NodeAside() {
  const ctx = useListContext();
  const [updateMany, { isLoading, error }] = useUpdateMany();
  if (!ctx.selectedIds.length) {
    return null;
  }
  return (
    <>
      <SimpleForm
        onSubmit={(data, event) => {
          updateMany(ctx.resource, { ids: ctx.selectedIds, data });
          event?.preventDefault();
        }}
      >
        <TextInput source="miner" />
        <TextInput source="ip" />
      </SimpleForm>
    </>
  );
}
