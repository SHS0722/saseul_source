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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

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
  const [ miner, setMiner ] = useState('');
  const [ resource, setResource ] = useState('');
  const setRefresh = () => {
    // refetch();
    if(data?.id && data?.value) {
      refresh();
    }
  }
  let miner_adress = '';
  const router = useRouter();
  const checkResource = async(adress: string) => {
      const data ={
        "public_key" : adress
      }
      const responses = await axios.post(`http://saseul-admin.store/resource`,data);
      const res_data = responses.data.resource;
      console.log(res_data)
      setResource(res_data);

  }
  const checkLoginStatus = async () => {
    let server = 'http://15.164.77.173:4000/'
    let local_server = 'http://localhost:4000/'
    const jwt = localStorage.getItem('jwt');

    if(jwt === null){
        router.push('/login')
    }else {

        try{
            const response = await axios.post(`${server}user/check`,null,{
                headers: {
                    'Authorization': `Bearer ${jwt}`
                }
            });

        }catch(error){
            router.push('/login')
        }
        
    }
};
  useEffect(() => {
    const intervalId = setInterval(checkLoginStatus,60000)
    return () => {
      clearInterval(intervalId);
    };
  }, [])
  useEffect(() => {
    setInterval(setRefresh, 1000 * 20)
  }, [])

  function rowSx(record: RecordType, idx: number): SxProps {
      if(idx === 0){
        if(record?.env?.miner !== ''){
          const adress = record?.env?.miner;
          checkResource(adress);
        }
      }

    

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
    <>
      {resource !== ''? <span>Resource : {resource}</span>:null}
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
    </>

  );
}
