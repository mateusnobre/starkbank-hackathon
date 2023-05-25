import styled from 'styled-components';
import React, { useState } from 'react';
import StarkLogo from '../../assets/stark_logo.png';
import DivPix from '../../assets/divpix_logo_white.png';
import ArrowLeft from '../../assets/arrow_black.png';
import { useNavigate } from 'react-router-dom';

const Menudiv = styled.div`
    position: fixed;
    display: flex;
    flex-direction: column;

    height: 100%;
    width: 15%;
    background: linear-gradient(var(--color-pix), var(--color-pix-6));
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
        transition: 0.2s;
    }

    span {
        color: var(--color-bkg-inv-hard);
    }
`;

const OptionSelect = styled(Option)`

    padding-left: 0;

    img {
        margin-left: .7vw;
        position: fixed;
        height: 1.8vh;
        width: auto;
    }

    p {
        padding-left: 2.5vw;
    }
`;

const OptionNested = styled(Option)`

    transition: 0.5s;

    :hover {
        cursor: pointer;
        color: var(--color-bkg-hard);
        background: var(--color-bkg-inv-hard);
        transition: 0.5s;
    }
`;

const Starkimg = styled.img`
    margin-top: 4vh;
    margin-bottom: 4vh;
    margin-left: 2.5vw;
    width: 16%;
    cursor: pointer;
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
            <Starkimg src={DivPix} alt="Logo StarkBank"/>
            <OptionSelect onClick={handleClick}
            >
                <img src={ArrowLeft} />
                <p>Pix Parcelado</p>
            </OptionSelect>
            {showOptionsPP && (
                <div>
                    <OptionNested>Investimentos</OptionNested>
                    <OptionNested>Membros</OptionNested>
                    <OptionNested>Integrações</OptionNested>
                </div>
            )}
            <Option>Recebimentos</Option>
            <Option>Pagamentos</Option>
        </Menudiv>
    );
}