import {Button, Dialog, DialogActions,
  DialogContent,
  DialogTitle,
  Grid} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import TextField from 'components/Shared/Fields/Text';
import Toast from 'components/Shared/Toast';
import { logError } from 'helpers/rxjs-operators/logError';
import { useFormikObservable } from 'hooks/useFormikObservable';
import IProduct from 'interfaces/models/product';
import React, { memo, useCallback } from 'react';
import { tap } from 'rxjs/operators';
import productService from 'services/product';
import * as yup from 'yup';

interface IProps {
  opened: boolean;
  onCancelForm: () => void;
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

const FormProduct = memo((props: IProps) => {
  const classes = useStyle(props);

  const formik = useFormikObservable<IProduct>({
    validationSchema,
    onSubmit(model) {
      const modelFormatted = {...model, value: Number(model.value), amount: Number(model.amount)}
      return productService.save(modelFormatted).pipe(
        tap(product => {
          Toast.show(`${product.name} foi salvo`);
        }),
        logError(true),
      );
    }
  });


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
          <Button onClick={props.onCancelForm} color='primary' variant='contained' type='submit'>
            Salvar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
});

export default FormProduct;
