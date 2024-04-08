import {Done} from '@mui/icons-material';
import SvgIcon from '@mui/material/SvgIcon';

export const GreenDoneIcon: typeof SvgIcon = (props: React.ComponentProps<typeof SvgIcon>) => {
    return (
        <Done color={"success"} {...props} />
    );
}
GreenDoneIcon.muiName = "GreenDoneIcon"
