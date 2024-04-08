import ClearIcon from '@mui/icons-material/Clear';
import SvgIcon from '@mui/material/SvgIcon';

export const RedClearIcon: typeof SvgIcon = (props: React.ComponentProps<typeof SvgIcon>) => {
    return (
        <ClearIcon color={"error"} {...props} />
    );
}
RedClearIcon.muiName = "RedClearIcon"
