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
import productService from 'services/product';
import ListItemProduct from "./ListItemProduct"
import IProduct from 'interfaces/models/product';

import InfoProduct from "../InfoProduct"
import FormProduct from "../FormProduct"

const ProductsListPage = memo(() => {
  const [currentProduct, setCurrentProduct] = useState<IProduct>({} as IProduct)
  const [showOpened, setShowOpened] = useState(false);
  const [formProductOpened, setFormProductOpened] = useState(false);

  const [params, mergeParams, loading, data, error, , refresh] = usePaginationObservable(
    params => productService.list(params),
    {orderBy: 'name', orderDirection: 'asc' },
    []
  );

  const onShow = useCallback((product:IProduct) => {
    setCurrentProduct(product)
    setShowOpened(true)
  }, [])

  const onClose = useCallback(() => {
    setShowOpened(false)
  }, [])

  const openFormProduct = useCallback(() => {
    setFormProductOpened(true)
  }, [])

  const onCancelForm = useCallback(() => {
    setFormProductOpened(false)
  }, [])


  const handleRefresh = useCallback(() => refresh(), [refresh]);
  
  const { total, results } = data || ({ total: 0, results: [] } as typeof data);

  return (
    <>
      <Toolbar title='Produtos' />

      <Card>
        <CardLoader show={loading} />

        <InfoProduct open={showOpened} onClose={onClose} product={currentProduct} />
        <FormProduct opened={formProductOpened} onCancelForm={onCancelForm}  />

        <CardContent>
          <Grid>
            <Grid item xs={12} sm={'auto'}>
              <Button variant='contained' color='primary' onClick={openFormProduct}>
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
              {results.map(product => (
                <ListItemProduct key={product.id} product={product} onShow={onShow} onDelete={refresh} />
              ))}
            </TableBody>
          </Table>
        </TableWrapper>

        <TablePagination total={total} disabled={loading} paginationParams={params} onChange={mergeParams} />
      </Card>
    </>
  );
});

export default ProductsListPage;
