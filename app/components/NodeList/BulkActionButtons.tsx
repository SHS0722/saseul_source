import {
  BulkDeleteButton,
  BulkUpdateButton
} from "react-admin";
import { bulkActions } from "../../common/actions";

export function BulkActionButtons() {
  return (
    <>
      {bulkActions.map(({ label }) => <BulkUpdateButton data={{ [label]: true }} label={label} key={label} />)}
      <BulkDeleteButton />
    </>
  );
}
