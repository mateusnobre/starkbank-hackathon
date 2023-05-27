import styled from 'styled-components';
import React, { useState } from 'react';
import Menu from '../../components/Menu';
// import { theme } from '../../theme';

const Bkgdiv = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;

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

const StatementBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    width: 80%;
`;

const ExportBox = styled(StatementBox)`
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

const BalanceBox = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 10vh;
    padding-top: 2.5vh;
    padding-bottom: 2.5vh;
    width: 90%;
    margin-right: 10%;
    transition: background 1s;

    color: var(--color-bkg-hard);

    p {
        margin: 0;
        line-height: calc(var(--fontsize) * 2);
        font-size: var(--fontsize);
        font-weight: 400;
    }

    h1 {
        margin: 0;
        font-family: 'Roboto', sans-serif;
        font-size: calc(var(--fontsize-title) * 2);
        letter-spacing: 0.01em;
        font-weight: 400;
    }

    :hover {
        cursor: default;
        background: var(--color-bkg-inv-soft);
        transition: background 1s;
    }
`;

const DescriptionBox = styled.div`
    display: flex;
    flex-direction: column;

    height: 75%;
    margin-top: 2.5%;
    width: 100%;

    color: var(--color-bkg-hard);

    p {
        margin: 0;
        line-height: calc(var(--fontsize) * 2);
        font-size: var(--fontsize);
        font-weight: 400;
    }
`;

const DataTable = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    height: 90%;
    width: 90%;
    margin-right: 10%;
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

export default function Statement() {

    const [balanceValue, setBalanceValue] = useState(9999998);

    const formattedBalance = balanceValue.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
    });

    // const [currentTheme, setCurrentTheme] = useState(theme);
    
    // const changeToDarkTheme = () => {
    //     const darkTheme = {
    //         colorStark: '#0070e0',
    //         colorPix: 'red',
    //         colorPix6: 'rgb(11, 255, 183, 0.6)',
    //         colorPixDark: '#17f8b5',
    //         colorBkgDark: '#f5f5f5',
    //         colorBkgSoft: '#ffffff',
    //         colorBkgInvDark: '#171B20',
    //         colorBkgInvSoft: '#111418'
    //     };
    
    //     changeTheme(darkTheme);
    // };

    // const changeToLightTheme = () => {
    //     const lightTheme = {
    //         colorStark: '#0070e0',
    //         colorPix: '#0bffb7',
    //         colorPix6: 'rgb(11, 255, 183, 0.6)',
    //         colorPixDark: '#17f8b5',
    //         colorBkgDark: '#171B20',
    //         colorBkgSoft: '#171B20',
    //         colorBkgInvDark: '#f5f5f5',
    //         colorBkgInvSoft: '#ffffff'
    //     };
    
    //     changeTheme(lightTheme);
    // };

    return (
        <Bkgdiv>
            <Menu/>
            <ScreenDiv>
                <StatementBox>
                    <PageTitle>Statement</PageTitle>
                    <BalanceBox>
                        <p>Balance</p>
                        <h1>{formattedBalance}</h1>
                    </BalanceBox>
                    <DescriptionBox>
                        <p>Description</p>
                        <DataTable>AQUI VOU COLOCAR A DATA TABLE</DataTable>
                    </DescriptionBox>
                </StatementBox>
                <ExportBox>
                    <AddBalance>Add Balance</AddBalance>
                    <FuncButton>Export</FuncButton>
                    <FuncButton>Filter</FuncButton>
                </ExportBox>
            </ScreenDiv>
        </Bkgdiv>
    );
}