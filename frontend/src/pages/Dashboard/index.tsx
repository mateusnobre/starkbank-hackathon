import styled from 'styled-components';
import React, { useState } from 'react';
import Menu from '../../components/Menu';
import CashflowChart from '../../components/CashflowChart';
import BalanceChart from '../../components/BalanceChart';

const Bkgdiv = styled.div`
    display: flex;
    flex-direction: column;

    height: 300vh;
    padding-top: 5vh;
    width: 99vw;
`;

const ScreenDiv = styled.div`
    display: flex;
    flex-direction: row;
    margin-left: 20%;
    height: 100%;
    width: 75%;
`;

const DashboardBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    width: 80%;
`;

const ExportBox = styled(DashboardBox)`
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

const FiltersBar = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 5vh;
    margin-top: 2vh;
    padding-top: 1vh;
    padding-bottom: 1vh;
    width: 95%;
    margin-right: 5%;

    color: var(--color-bkg-hard);
    transition: background 1s;

    p {
        margin: 0;
        line-height: calc(var(--fontsize) * 2);
        font-size: var(--fontsize);
        font-weight: 400;
    }

    :hover {
        cursor: default;
        background: var(--color-bkg-inv-soft);
        transition: background 1s;
    }
`;

const InfoBar = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 15vh;
    margin-top: 2vh;
    width: 95%;
    margin-right: 5%;
`;

const InfoBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 31%;

    border: 2px solid var(--color-bkg-soft);
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    color: var(--color-bkg-hard);

    transition: 1.5s;

    :hover {
        cursor: default;
        color: var(--color-bkg-soft);
        background: var(--color-bkg-inv-soft);
        transition: 1.5s;
    }
`;

const InfoTitle = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 70%;
    margin-bottom: 1.5vh;

    font-size: var(--fontsize-title);
    font-weight: 600;
`;

const Info = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 70%;

    font-size: var(--fontsize);
`;

const DataBox = styled.div`
    display: flex;
    flex-direction: column;

    height: 600px;
    margin-top: 30px;
    width: 100%;

    color: var(--color-bkg-hard);

    p {
        margin: 0;
        line-height: calc(var(--fontsize) * 2);
        font-size: var(--fontsize);
        font-weight: 400;
        margin-bottom: 2.5vh;
    }
`;

const DataChart = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    height: 100%;
    width: 95%;
    margin-right: 5%;
    color: var(--color-bkg-hard);
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

export default function Dashboard() {

    const [testValue, setTestValue] = useState(2500);

    const formattedTest = testValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
    });

    return (
        <Bkgdiv>
            <Menu/>
            <ScreenDiv>
                <DashboardBox>
                    <PageTitle>Dashboard</PageTitle>
                    <FiltersBar>
                        <p>put filters here</p>
                    </FiltersBar>
                    <InfoBar>
                        <InfoBox>
                            <InfoTitle>Average Ticket</InfoTitle>
                            <Info>Boleto: {formattedTest}</Info>
                            <Info>Invoice: {formattedTest}</Info>
                        </InfoBox>
                        <InfoBox>
                            <InfoTitle>Conversion Rate</InfoTitle>
                            <Info>Boleto: 0%</Info>
                            <Info>Invoice: 0%</Info>
                        </InfoBox>
                        <InfoBox>
                            <InfoTitle>Default Rate</InfoTitle>
                            <Info>Boleto: 0%</Info>
                            <Info>Invoice: 0%</Info>
                        </InfoBox>
                    </InfoBar>
                    {/* HERE ARE THE CHARTS
                    -> */}
                    <DataBox>
                        <p>Cash Flow</p>
                        <DataChart>
                            <CashflowChart/>
                        </DataChart>
                    </DataBox>
                    <DataBox>
                        <p>Balance</p>
                        <DataChart>
                            <BalanceChart/>
                        </DataChart>
                    </DataBox>
                </DashboardBox>
                <ExportBox>
                    <AddBalance>Add Balance</AddBalance>
                    <FuncButton>Export</FuncButton>
                    <FuncButton>Filter</FuncButton>
                </ExportBox>
            </ScreenDiv>
        </Bkgdiv>
    );
}