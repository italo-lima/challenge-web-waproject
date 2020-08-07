import React from 'react';
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import ISolicitation from "interfaces/models/solicitation"
import formatValue from "../../../../helpers/formatValue"

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

export interface TitleProps extends WithStyles<typeof styles> {
  id: string;
  children: React.ReactNode;
  onClose: () => void;
}

const Title = withStyles(styles)((props: TitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose && (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      )}
    </MuiDialogTitle>
  );
});

const Content = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

interface PropsShowInfoSolicitation {
  open: boolean;
  solicitation: ISolicitation;
  onClose: () => void;
}

const InfoSolicitation: React.FC<PropsShowInfoSolicitation> = ({open, onClose, solicitation}) => {

  return (
    <div>
      <Dialog onClose={onClose} aria-labelledby="customized-dialog-title" open={open}>
        <Title id="customized-dialog-title" onClose={onClose}>
          {solicitation.name}
        </Title>
        <Content dividers>
          <Typography align="center" variant="h6" gutterBottom>
            Informações adicionais sobre {solicitation.name}
          </Typography>
          <Typography gutterBottom>
            Descrição: {solicitation.description}
          </Typography>
          <Typography gutterBottom>
            Quantidade: {Number(solicitation.amount)}
          </Typography>
          <Typography gutterBottom>
            Valor: {formatValue(solicitation.value)}
          </Typography>
        </Content>
      </Dialog>
    </div>
  );
}

export default InfoSolicitation