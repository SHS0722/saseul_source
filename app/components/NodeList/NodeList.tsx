import {
  BooleanField,
  Datagrid,
  FunctionField,
  Link,
  List,
  NumberField,
  TextField,
  useGetOne,
  useRefresh,
} from "react-admin";
import { NodeActions } from "./NodeActions";
import { BulkActionButtons } from "./BulkActionButtons";
import { NodeAside } from "./NodeAside";
import { RedClearIcon } from "./RedClearIcon";
import { Info } from "@/app/api/hostConnector";
import { ContainerInfo } from "dockerode";
import { SxProps } from "@mui/system";
import { GreenDoneIcon } from "./GreenDoneIcon";
import { logger } from "@/app/api/node/logger";
import { useEffect } from "react";


interface RecordType extends ContainerInfo {
  id: string,
  info: Info,
  env: {
    miner: string,
    endpoint: string,
  }
}
interface NodeListProps extends React.ComponentProps<typeof List<RecordType>> { }

export default function NodeList(props: NodeListProps) {
  const { data, isLoading, refetch } = useGetOne<{ id: "refresh", value: boolean }>('option', { id: 'refresh' })
  const refresh = useRefresh();
  const setRefresh = () => {
    // refetch();
    if(data?.id && data?.value) {
      refresh();
    }
  }
  useEffect(() => {
    console.log("setInterval")
    setInterval(setRefresh, 1000 * 20)
  }, [])

  function rowSx(record: RecordType, idx: number): SxProps {
    if (record?.info?.data?.status !== "is_running") {
      return {
        border: "3px solid red",
      }
    }
    if (!record?.info?.data?.mining) {
      return { border: "3px solid orange", }
    }
    return { border: "3px solid green" }
  }

  return (
    <List
      {...props}
      actions={<NodeActions />}
      pagination={false}
      aside={<NodeAside />}
    >
      <Datagrid bulkActionButtons={<BulkActionButtons />}
        rowSx={rowSx}
      >
        {/* <TextField source="Id" /> */}
        <TextField source="Names" />
        <TextField
          source="env.miner"
          label="Miner"
        />
        <FunctionField
          source="env.endpoint"
          label="Endpoint"
          render={(record: any) => {
            if (!record.env?.endpoint) return (<></>)
            return <Link to={`http://${record.env?.endpoint}/info`}>{record.env?.endpoint}</Link>
          }}
        >

        </FunctionField>
        <NumberField
          source="info.data.last_block.height"
          label="Last Block"
        />
        <NumberField
          source="info.data.last_resource_block.height"
          label="Last Resource Block"
        />
        <TextField
          source="info.data.status"
          label="status"
        />
        <BooleanField
          source="info.data.mining"
          label="mining"
          looseValue={true}
          FalseIcon={RedClearIcon}
          TrueIcon={GreenDoneIcon}
        />
      </Datagrid>
    </List>
  );
}
