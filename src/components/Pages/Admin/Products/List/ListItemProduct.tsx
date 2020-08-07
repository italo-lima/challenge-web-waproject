import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Alert from 'components/Shared/Alert';
import { IOption } from 'components/Shared/DropdownMenu';
import TableCellActions from 'components/Shared/Pagination/TableCellActions';
import Toast from 'components/Shared/Toast';
import { logError } from 'helpers/rxjs-operators/logError';
import IProduct from 'interfaces/models/product';
import DeleteIcon from 'mdi-react/DeleteIcon';
import VisibilityIcon from 'mdi-react/VisibilityIcon';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { useCallbackObservable } from 'react-use-observable';
import { from } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import productService from 'services/product';
import formatValue from "../../../../../helpers/formatValue"

interface IPropsProduct {
  product: IProduct;
  onDelete: () => void;
  onShow: (product: IProduct) => void;
}

const ListItemProduct = memo((props: IPropsProduct) => {
  const { product, onDelete, onShow } = props;

  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleDismissError = useCallback(() => setError(null), []);

  const handleShow = useCallback(() => {
    onShow(product);
  }, [onShow, product]);

  const [handleDelete] = useCallbackObservable(() => {
    return from(Alert.confirm(`Deseja excluir o produto ${product.name}?`)).pipe(
      filter(ok => ok),
      tap(() => setLoading(true)),
      switchMap(() => productService.delete(product.id)),
      logError(),
      tap(
        () => {
          Toast.show(`${product.name} foi removido`);
          setLoading(true);
          setDeleted(true);
          onDelete();
        },
        error => {
          setLoading(false);
          setError(error);
        }
      )
    );
  }, []);

  const options = useMemo<IOption[]>(() => {
    return [
      { text: 'Visualizar', icon: VisibilityIcon, handler: handleShow },
      { text: 'Excluir', icon: DeleteIcon, handler: handleDelete }
    ];
  }, [handleDelete, handleShow]);

  if (deleted) {
    return null;
  }

  return (
    <TableRow>
      <TableCell>{product.name}</TableCell>
      <TableCell>{product.description}</TableCell>
      <TableCell>{Number(product.amount)}</TableCell>
      <TableCell>{formatValue(product.value)}</TableCell>
      <TableCellActions options={options} loading={loading} error={error} onDismissError={handleDismissError} />
    </TableRow>
  );
});

export default ListItemProduct;
