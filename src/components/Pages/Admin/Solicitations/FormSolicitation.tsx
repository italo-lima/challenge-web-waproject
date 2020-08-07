import {Button, Dialog, DialogActions,
  DialogContent,
  DialogTitle,
  Grid} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from 'components/Shared/Fields/Text';
import Toast from 'components/Shared/Toast';
import { logError } from 'helpers/rxjs-operators/logError';
import { useFormikObservable } from 'hooks/useFormikObservable';
import ISolicitation from 'interfaces/models/solicitation';
import React, { memo, useCallback } from 'react';
import { tap } from 'rxjs/operators';
import solicitationService from 'services/solicitation';
import * as yup from 'yup';

interface IProps {
  opened: boolean;
  onCancelForm: () => void;
  handleRefresh: () => void;
}

const validationSchema = yup.object().shape({
  name: yup.string().required("Nome Obigatório").min(3),
  description: yup.string().required("Descrição Obrigatória").min(3),
  value: yup.number().required("Valor Obrigatório"),
  amount: yup.number().required("Quantidade Obrigatória")
});

const useStyle = makeStyles({
  content: {
    width: 600,
    maxWidth: 'calc(95vw - 50px)'
  },
  heading: {
    marginTop: 20,
    marginBottom: 10
  }
});

const FormSolicitation = memo((props: IProps) => {
  const classes = useStyle(props);

  const formik = useFormikObservable<ISolicitation>({
    validationSchema,
    onSubmit(model) {
      const modelFormatted = {...model, value: Number(model.value), amount: Number(model.amount)}
      return solicitationService.save(modelFormatted).pipe(
        tap(solicitation => {
          Toast.show(`${solicitation.name} foi salvo`);
        }),
        logError(true),
      );
    }
  });

  const handleCloseForm = useCallback(() => {
    props.onCancelForm()
    props.handleRefresh()
  }, [props])

  const handleExit = useCallback(() => {
    formik.resetForm();
  }, [formik]);

  return (
    <Dialog
      open={props.opened}
      disableBackdropClick
      disableEscapeKeyDown
      onExited={handleExit}
    >

      <form onSubmit={formik.handleSubmit}>
        <DialogTitle>Novo Produto</DialogTitle>
        <DialogContent className={classes.content}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label='Nome' name='name' formik={formik} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label='Descrição' name='description' formik={formik} />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
              <TextField label='Quantidade' name='amount' formik={formik} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label='Valor' name='value' formik={formik} />
              </Grid>
            </Grid>

        </DialogContent>
        <DialogActions>
          <Button onClick={props.onCancelForm}>Cancelar</Button>
          <Button onClick={handleCloseForm} color='primary' variant='contained' type='submit'>
            Salvar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
});

export default FormSolicitation;
