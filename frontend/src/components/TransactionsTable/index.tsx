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
        year: '14urb873294g831',
    },
    {
        title: 'Arnold Silva',
        director: '+4000000',
        year: '31b4yu2b7841g72',
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
        name: 'Transaction Id',
        selector: row => row.year,
    },
];

function TransactionsTable(): JSX.Element {

    return (
        <DataTable columns={columns} data={data} />
    );
}

export default TransactionsTable;