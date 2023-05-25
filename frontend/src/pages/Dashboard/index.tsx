import styled from 'styled-components';
import React from 'react';
import Menu from '../../components/Menu';

const Bkgdiv = styled.div`
    display: flex;
    flex-direction: column;

    height: 100vh;
    width: 100vw;
    background-color: var(--color-bkg-inv-hard);
`;

const SquareDashboard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-left: 20%;
    height: 500px;
    width: 500px;
    background-color: #f5f5f5;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;
export default function Dashboard() {
    return (
        <Bkgdiv>
            <Menu/>
            <SquareDashboard>
                <h1>Dashboard</h1>
            </SquareDashboard>
        </Bkgdiv>
    );
}