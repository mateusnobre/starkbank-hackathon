import styled from 'styled-components';
import React from 'react';

const ExportBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    width: 20%;
`;

const AddBalance = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    height: 5%;
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

    height: 5%;
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

export default function Exportbox() {
    
    return (
        <ExportBox>
            <AddBalance>Add Balance</AddBalance>
            <FuncButton>Export</FuncButton>
            <FuncButton>Filter</FuncButton>
        </ExportBox>
    );
}