import Card from '@material-ui/core/Card';
import {CardContent, Grid, Button, Table, TableBody, TableHead, TableRow, IconButton} from '@material-ui/core';
import Toolbar from 'components/Layout/Toolbar';
import CardLoader from 'components/Shared/CardLoader';
import EmptyAndErrorMessages from 'components/Shared/Pagination/EmptyAndErrorMessages';
import TableCellActions from 'components/Shared/Pagination/TableCellActions';
import TableCellSortable from 'components/Shared/Pagination/TableCellSortable';
import TablePagination from 'components/Shared/Pagination/TablePagination';
import TableWrapper from 'components/Shared/TableWrapper';
import usePaginationObservable from 'hooks/usePagination';
import RefreshIcon from 'mdi-react/RefreshIcon';
import React, { memo, useCallback, useState} from 'react';
import solicitationService from 'services/solicitation';
import ListItemSolicitation from "./ListItemSolicitation"
import ISolicitation from 'interfaces/models/solicitation';

import InfoSolicitation from "../InfoSolicitation"
import FormSolicitation from "../FormSolicitation"

const SolicitationsListPage = memo(() => {
  const [currentSolicitation, setCurrentSolicitation] = useState<ISolicitation>({} as ISolicitation)
  const [showOpened, setShowOpened] = useState(false);
  const [formSolicitationOpened, setFormSolicitationOpened] = useState(false);

  const [params, mergeParams, loading, data, error, , refresh] = usePaginationObservable(
    params => solicitationService.list(params),
    {orderBy: 'name', orderDirection: 'asc' },
    []
  );

  const onShow = useCallback((solicitation:ISolicitation) => {
    setCurrentSolicitation(solicitation)
    setShowOpened(true)
  }, [])

  const onClose = useCallback(() => {
    setShowOpened(false)
  }, [])

  const openFormSolicitation = useCallback(() => {
    setFormSolicitationOpened(true)
  }, [])

  const onCancelForm = useCallback(() => {
    setFormSolicitationOpened(false)
  }, [])

  const handleRefresh = useCallback(() => refresh(), [refresh]);
  
  const { total, results } = data || ({ total: 0, results: [] } as typeof data);

  return (
    <>
      <Toolbar title='Pedidos' />

      <Card>
        <CardLoader show={loading} />

        <InfoSolicitation open={showOpened} onClose={onClose} solicitation={currentSolicitation} />
        <FormSolicitation handleRefresh={handleRefresh} opened={formSolicitationOpened} onCancelForm={onCancelForm}  />

        <CardContent>
          <Grid>
            <Grid item xs={12} sm={'auto'}>
              <Button variant='contained' color='primary' onClick={openFormSolicitation}>
                Adicionar
              </Button>
            </Grid>
          </Grid>
        </CardContent>

        <TableWrapper minWidth={500}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCellSortable
                  paginationParams={params}
                  disabled={loading}
                  onChange={mergeParams}
                  column='name'
                >
                  Nome
                </TableCellSortable>
                <TableCellSortable
                  paginationParams={params} 
                  disabled={loading} 
                  onChange={mergeParams} 
                  column='description'
                >
                  Descrição
                </TableCellSortable>

                <TableCellSortable
                  paginationParams={params} 
                  disabled={loading} 
                  onChange={mergeParams} 
                  column='amount'
                >
                  Quantidade
                </TableCellSortable>
                <TableCellSortable
                  paginationParams={params} 
                  disabled={loading} 
                  onChange={mergeParams} 
                  column='value'
                >
                  Valor
                </TableCellSortable>

                <TableCellActions>
                  <IconButton disabled={loading} onClick={handleRefresh}>
                    <RefreshIcon />
                  </IconButton>
                </TableCellActions>
              </TableRow>
            </TableHead>
            <TableBody>
              <EmptyAndErrorMessages
                colSpan={3}
                error={error}
                loading={loading}
                hasData={results.length > 0}
                onTryAgain={refresh}
              />
              {results.map(solicitation => (
                <ListItemSolicitation key={solicitation.id} solicitation={solicitation} onShow={onShow} onDelete={refresh} />
              ))}
            </TableBody>
          </Table>
        </TableWrapper>

        <TablePagination total={total} disabled={loading} paginationParams={params} onChange={mergeParams} />
      </Card>
    </>
  );
});

export default SolicitationsListPage;
