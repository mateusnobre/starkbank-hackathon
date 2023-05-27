import DataTable, { TableColumn } from 'react-data-table-component';

interface DataRow {
    title: string;
    director: string;
    year: string;
}

const data = [
    {
      title: 'Page A',
      director: 'Director A',
      year: '2010',
    },
    {
      title: 'Page B',
      director: 'Director B',
      year: '2012',
    }
  ];

const columns: TableColumn<DataRow>[] = [
    {
        name: 'Title',
        selector: row => row.title,
    },
    {
        name: 'Director',
        selector: row => row.director,
    },
    {
        name: 'Year',
        selector: row => row.year,
    },
];

function TransactionsTable(): JSX.Element {

    return (
        <DataTable columns={columns} data={data} />
    );
}

export default TransactionsTable;