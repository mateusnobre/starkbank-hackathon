import DataTable, { TableColumn } from 'react-data-table-component';

interface DataRow {
    title: string;
    director: string;
    year: string;
}

const data = [
    {
      title: 'Tyrion Lannister',
      director: '+5999999',
      year: '+9999998',
    },
    {
      title: 'Arnold Silva',
      director: '+4000000',
      year: '399999.50',
    }
  ];

const columns: TableColumn<DataRow>[] = [
    {
        name: 'Client',
        selector: row => row.title,
    },
    {
        name: 'Amount',
        selector: row => row.director,
    },
    {
        name: 'Balance',
        selector: row => row.year,
    },
];

function StatementTable(): JSX.Element {

    return (
        <DataTable columns={columns} data={data} />
    );
}

export default StatementTable;