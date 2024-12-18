import React from 'react';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import './AdvancedTable.css';

export const AdvancedTable = ({ columns, data }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        rows,
        state,
        setGlobalFilter,
        gotoPage,
        previousPage,
        nextPage,
        setPageSize
    } = useTable(
        {
            columns,
            data,
            initialState: { pageSize: 10 },
        },
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    const { globalFilter, pageIndex, pageSize, sortBy } = state;

    const renderRow = (row, prepareRow) => {
        prepareRow(row);
        let rowStyle = {};

        if (row.original.COLOR) {
            rowStyle = { borderLeft: `3px solid ${row.original.COLOR}` };
        } else if (row.original.BG_COLOR) {
            rowStyle = { borderLeft: `3px solid ${row.original.BG_COLOR}` };
        } else if (row.original.BORDER_COLOR) {
            rowStyle = { borderLeft: `3px solid ${row.original.BORDER_COLOR}` };

        } else if (row.original.FLAG_OBS_COLOR) {
            rowStyle = { borderLeft: `3px solid ${row.original.FLAG_OBS_COLOR}` };
        }

        const exemptedColumns = ['Edit', 'Chat', 'Alterar Atividades', 'Del', 'Edit Simultâneos', 'Edit Desligue', 'Sim', 'Não'];
        
        return (
            <tr {...row.getRowProps()} style={rowStyle}>
                {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>
                        {cell.column.id === 'ATENDENTE_NOME' || cell.column.id === 'TECNICO_NOME' ? (
                            <div className="tooltip">
                                <span>{cell.value ? cell.render('Cell') : ''}</span>
                                <div className="tooltiptext">{getCellTitle(cell, row.original)}</div>
                            </div>
                        ) : (
                            <span>
                                {exemptedColumns.includes(cell.column.Header) ? cell.render('Cell') : (cell.value ? cell.render('Cell') : '')}
                                {cell.column.suffix && ` ${cell.column.suffix}`} {/* Adiciona o sufixo se estiver definido */}
                            </span>
                        )}
                    </td>
                ))}
            </tr>
        );
    };

    const getCellTitle = (cell, rowData) => {
        if (cell.column.id === 'ATENDENTE_NOME') {
            return rowData.ATENDENTE_NOME_COMPLETO;
        }
        if (cell.column.id === 'TECNICO_NOME') {
            let title = rowData.TECNICO_NOME_COMPLETO;
            if (rowData.TECNICO_CELULAR) {
                title += ` - Celular: ${rowData.TECNICO_CELULAR}`;
            }
            return title;
        }
        return '';
    };

    // Calcula o número total de páginas com base nos resultados filtrados
    const filteredPageCount = Math.ceil(rows.length / pageSize);

    return (
        <div className="advanced-table">
            <div className="table-options">
                <div>
                    <input
                        type="text"
                        value={globalFilter || ''}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Pesquisar..."
                    />
                </div>
                <div>
                    <label>
                        Itens por página:{' '}
                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                gotoPage(0);
                            }}
                        >
                            {[10, 20, 30, 40, 50].map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>
            </div>

            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    {sortBy && sortBy.length > 0 && sortBy[0].id === column.id && (
                                        <span>
                                            {' '}
                                            <FontAwesomeIcon icon={sortBy[0].desc ? faSortDown : faSortUp} />
                                        </span>
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                    {rows.length === 0 && (
                        <tr>
                            <td colSpan={columns.length}>Nenhum registro encontrado</td>
                        </tr>
                    )}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row) => renderRow(row, prepareRow))}
                </tbody>
            </table>

            <div className="pagination">
                <span className="page-info">
                    Mostrando {pageIndex * pageSize + 1} até {Math.min((pageIndex + 1) * pageSize, rows.length)} de {rows.length} Resultados
                </span>

                <div className="page-navigation">
                    <button onClick={() => previousPage()} disabled={pageIndex === 0}>
                        Anterior
                    </button>

                    {Array.from({ length: filteredPageCount }, (_, index) => {
                        const pagesToShow = 3;
                        const startPage = Math.max(0, pageIndex - Math.floor(pagesToShow / 2));
                        const endPage = Math.min(startPage + pagesToShow, filteredPageCount - 1);

                        return (
                            <React.Fragment key={index}>
                                {index === 0 && startPage > 0 && (
                                    <button onClick={() => gotoPage(0)}>1</button>
                                )}
                                {index === 1 && startPage > 1 && (
                                    <span>...</span>
                                )}
                                {(index >= startPage && index <= endPage) && (
                                    <button onClick={() => gotoPage(index)} disabled={pageIndex === index}>
                                        {index + 1}
                                    </button>
                                )}
                                {index === endPage && endPage < filteredPageCount - 1 && (
                                    <span>...</span>
                                )}
                            </React.Fragment>
                        );
                    })}
                    {pageIndex < filteredPageCount - 3 && (
                        <button onClick={() => gotoPage(filteredPageCount - 1)}>
                            {filteredPageCount}
                        </button>
                    )}

                    <button
                        onClick={() => nextPage()}
                        disabled={pageIndex === filteredPageCount - 1}
                    >
                        Próximo
                    </button>
                </div>
            </div>
        </div>
    );
};