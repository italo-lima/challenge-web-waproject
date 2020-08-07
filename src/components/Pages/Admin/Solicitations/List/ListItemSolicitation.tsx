import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Alert from 'components/Shared/Alert';
import { IOption } from 'components/Shared/DropdownMenu';
import TableCellActions from 'components/Shared/Pagination/TableCellActions';
import Toast from 'components/Shared/Toast';
import { logError } from 'helpers/rxjs-operators/logError';
import ISolicitation from 'interfaces/models/solicitation';
import DeleteIcon from 'mdi-react/DeleteIcon';
import VisibilityIcon from 'mdi-react/VisibilityIcon';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { useCallbackObservable } from 'react-use-observable';
import { from } from 'rxjs';
import { filter, switchMap, tap } from 'rxjs/operators';
import solicitationService from 'services/solicitation';
import formatValue from "../../../../../helpers/formatValue"

interface IPropsSolicitation {
  solicitation: ISolicitation;
  onDelete: () => void;
  onShow: (solicitation: ISolicitation) => void;
}

const ListItemSolicitation = memo((props: IPropsSolicitation) => {
  const { solicitation, onDelete, onShow } = props;

  const [deleted, setDeleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleDismissError = useCallback(() => setError(null), []);

  const handleShow = useCallback(() => {
    onShow(solicitation);
  }, [onShow, solicitation]);

  const [handleDelete] = useCallbackObservable(() => {
    return from(Alert.confirm(`Deseja excluir o produto ${solicitation.name}?`)).pipe(
      filter(ok => ok),
      tap(() => setLoading(true)),
      switchMap(() => solicitationService.delete(solicitation.id)),
      logError(),
      tap(
        () => {
          Toast.show(`${solicitation.name} foi removido`);
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
      <TableCell>{solicitation.name}</TableCell>
      <TableCell>{solicitation.description}</TableCell>
      <TableCell>{Number(solicitation.amount)}</TableCell>
      <TableCell>{formatValue(solicitation.value)}</TableCell>
      <TableCellActions options={options} loading={loading} error={error} onDismissError={handleDismissError} />
    </TableRow>
  );
});

export default ListItemSolicitation;
