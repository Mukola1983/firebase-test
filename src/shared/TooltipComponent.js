import {Tooltip, withStyles} from "@material-ui/core";


export const LightTooltip = withStyles((theme) => ({
    tooltip: {
        border: `1px solid ${theme.palette.primary.main}`,
        backgroundColor: 'rgba(251,236,136, 0.8)',
        color: theme.palette.primary.dark,
        boxShadow: `1px 2px 15px ${theme.palette.primary.dark}`,
        fontWeight: "bold",
        fontSize: '15px',
    },
}))(Tooltip);
