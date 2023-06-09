import styled from 'styled-components';
import React, { useState } from 'react';
import DivPix from '../../assets/divpix_logo_white.png';
import ArrowLeft from '../../assets/arrow_black.png';
import { useNavigate } from 'react-router-dom';

const Menudiv = styled.div`
    position: fixed;
    display: flex;
    flex-direction: column;

    top: 0;
    height: 100vh;
    width: 15%;
    background: linear-gradient(var(--color-pix), var(--color-pix-6));
`;

const Piximg = styled.img`
    margin-top: 4vh;
    margin-bottom: 4vh;
    margin-left: 2.5vw;
    width: 16%;
    cursor: pointer;
`;

const Arrow = styled.img<{rotate: boolean}>`
    margin-left: .7vw;
    position: fixed;
    height: 1.8vh;
    width: auto;
    transform: ${props => props.rotate ? "rotate(90deg)" :"rotate(0deg)"};
    transition: transform 0.5s;
`;

const Option = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 5vh;
    padding-left: 2.5vw;
    color: var(--color-bkg-hard);
    background: transparent;
    font-size: 1.1rem;
    font-weight: 400;
    transition: 0.2s;

    :hover {
        cursor: pointer;
        color: var(--color-bkg-inv-hard);
        background: var(--color-pix-dark);
        transition: 0.2s;
    }

    span {
        color: var(--color-bkg-inv-hard);
    }
`;

const OptionC = styled(Option)`
    font-weight: 700;
`;

const OptionSelect = styled(Option)<{selected: boolean}>`

    padding-left: 0;
    color: ${props => props.selected ? "var(--color-bkg-inv-hard)" :"var(--color-bkg-hard)"};

    p {
        padding-left: 2.5vw;
    }
`;

const OptionNested = styled(Option)`

    transition: 0.5s;
    padding-left: 3vw;

    :hover {
        cursor: pointer;
        color: var(--color-bkg-hard);
        background: var(--color-bkg-inv-hard);
        transition: 0.5s;
    }
`;

export default function Menu() {

    const history = useNavigate();

    const [showOptionsPP, setShowOptionsPP] = useState(false);
    
    const handleClick = () => {
        if (!showOptionsPP) {
            setShowOptionsPP(true);
        }
        else {
            setShowOptionsPP(false);
        }
    };

    return (
        <Menudiv>
            <Piximg src={DivPix} alt="Logo StarkBank" onClick={() => history('/dashboard')}/>
            <Option onClick={() => history('/statement')}>Statement</Option>
            <OptionSelect onClick={handleClick}
                          selected={showOptionsPP}
            >
                <Arrow src={ArrowLeft} rotate={showOptionsPP}/>
                <p>Pix in Installments</p>
            </OptionSelect>
            {showOptionsPP && (
                <div>
                    <OptionNested onClick={() => history('/transactions')}>Transactions</OptionNested>
                    <OptionNested onClick={() => history('/installments')}>Installments</OptionNested>
                    <OptionNested>Accounts Receivable</OptionNested>
                    <OptionNested>Default Rate</OptionNested>
                </div>
            )}
            <Option onClick={() => history('/checkout')}>Credit Analysis</Option>
            <OptionC onClick={() => history('/checkout')}>My Checkout Page</OptionC>
            <Option onClick={() => history('/checkout')}>Settings</Option>
        </Menudiv>
    );
}