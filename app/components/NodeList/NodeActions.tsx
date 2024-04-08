import { BooleanInput, CreateButton, Edit, Link, OptionalRecordContextProvider, ToggleThemeButton, TopToolbar, useGetOne } from "react-admin";
import { ToggleAutoInput } from "./ToggleAutoInput";
import { ToggleRefreshInput } from "./ToggleRefreshInput";

export function NodeActions() {
  const r = useGetOne('option', { id: 'auto' })
  return (
    <TopToolbar>
      <Link to="https://explorer.saseul.com/?ia=home">익스플로러</Link>
      <ToggleRefreshInput source="refresh" />
      <OptionalRecordContextProvider value={r.data}>

        <ToggleAutoInput source="auto" />
      </OptionalRecordContextProvider>
      <CreateButton label="설치" />
    </TopToolbar>
  );
}
