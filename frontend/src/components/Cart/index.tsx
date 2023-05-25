import styled from 'styled-components';
import React from 'react';

const SquareCart = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 90%;
    width: 75%;
    background-color: #f5f5f5;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

export default function Cart() {
    return (
        <SquareCart>
            <h1>Cart</h1>
        </SquareCart>
    );
}