import { BooleanInput, Create, NumberInput, SimpleForm, useCreate, useRecordContext } from "react-admin";

interface NodeCreateProps extends React.ComponentProps<typeof Create> {}
export default function NodeCreate(props: NodeCreateProps) {    
    return <Create {...props} title="설치">
        <SimpleForm>
            <NumberInput source="number" label="개수" />
            <NumberInput source="startPort" label="시작 포트" />
        </SimpleForm>
    </Create>
}
