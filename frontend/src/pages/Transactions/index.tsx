import styled from 'styled-components';
import React from 'react';
import Menu from '../../components/Menu';
// import Exportbox from '../../components/Exportbox';

const Bkgdiv = styled.div`
    display: flex;
    flex-direction: column;

    height: 90vh;
    padding-top: 5vh;
    width: 99vw;
`;

const ScreenDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-left: 20%;
    height: 100%;
    width: 75%;
`;

const TransactionBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    width: 80%;
`;

const ExportBox = styled(TransactionBox)`
    width: 20%;
`;

const PageTitle = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 7.5vh;
    width: 100%;

    color: var(--color-bkg-hard);
    font-size: var(--fontsize-title);
    font-weight: 400;
`;

const DataTable = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    height: 90%;
    width: 90%;
    margin-right: 10%;
    margin-top: 2.5vh;
    color: var(--color-bkg-hard);
    background: purple;

    p {
        margin: 0;
        line-height: calc(var(--fontsize) * 2);
        font-size: var(--fontsize);
        font-weight: 400;
    }
`;

const AddBalance = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    height: 5vh;
    margin-top: 10vh;
    width: 100%;

    background: var(--color-pix);
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    
    color: var(--color-bkg-hard);
    font-size: var(--fontsize);
    font-weight: 400;

    transition: .5s;

    :hover {
        cursor: pointer;
        background: var(--color-pix-dark);
        color: var(--color-bkg-inv-soft);
        transition: .5s;
    }
`;

const FuncButton = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    height: 5vh;
    margin-top: 1vh;
    width: 100%;

    color: var(--color-pix);
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    
    font-size: var(--fontsize);
    font-weight: 700;

    transition: .5s;

    :hover {
        cursor: pointer;
        background: var(--color-bkg-inv-soft);
        color: var(--color-bkg-soft);
        transition: .5s;
    }
`;

const FirstButton = styled(FuncButton)`
    margin-top: 10vh;
`;

export default function Transactions() {
    
    return (
        <Bkgdiv>
            <Menu/>
            <ScreenDiv>
                <TransactionBox>
                    <PageTitle>Transactions</PageTitle>
                    <DataTable>AQUI VOU COLOCAR A DATA TABLE</DataTable>
                </TransactionBox>
                <ExportBox>
                    <FirstButton>Export</FirstButton>
                    <FuncButton>Filter</FuncButton>
                </ExportBox>
            </ScreenDiv>
        </Bkgdiv>
    );
}