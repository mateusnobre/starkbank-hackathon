import styled from 'styled-components';
import React from 'react';
const SquareDashboard = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 500px;
    width: 500px;
    background-color: #f5f5f5;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;
export default function Dashboard() {
    return (
        <SquareDashboard>
            <h1>Dashboard</h1>
        </SquareDashboard>
    );
}