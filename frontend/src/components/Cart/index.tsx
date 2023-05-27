import styled from 'styled-components';
import DivPix from '../../assets/divpix_logo_white.png';
import EmpresaX from '../../assets/petlove_logo.png';
import React, { useState } from 'react';

const Cartdiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 90%;
    width: 75%;
    border-radius: 10px;
`;

const LogoWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 25%;
    width: 100%;

    p {
        color: var(--color-bkg-inv-hard);
        font-size: calc(var(--fontsize-title) * 2);
        font-weight: 600;
    }
`;

const EmpresaWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 15%;
    width: 100%;

    p {
        color: var(--color-bkg-soft);
        font-size: var(--fontsize-title);
        font-weight: 400;
        font-style: italic;
        margin-right: 2.5vw;
    }
`;

const Piximg = styled.img`
    margin-top: 4vh;
    margin-bottom: 4vh;
    margin-right: 2.5vw;
    width: 16%;
    cursor: default;
`;

const EmpresaXimg = styled(Piximg)`
    margin-top: 1vh;
    margin-bottom: 1vh;
    height: 40%;
    width: auto;
    padding: 2.5vh;

    border: 1px solid var(--color-bkg-soft);
    border-radius: 8px;
`;

const CartForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 40%;
    width: 100%;
`;

const FormTitle = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;

    width: 100%;
    padding-top: 1vh;
    padding-bottom: 2vh;

    color: var(--color-bkg-hard);
    font-size: var(--fontsize-title);
    font-weight: 600;
`;

const InputName = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;

    text-indent: 5px;
    width: 100%;
    padding-bottom: .5vh;

    color: var(--color-bkg-hard);
    font-size: var(--fontsize-name);
    font-weight: 600;
`;

const InputBox = styled.input`
    display: flex;
    flex-direction: column;
    justify-content: center;

    text-indent: 1vw;
    width: 99%;
    height: 5vh;
    margin-bottom: 1vh;

    background: transparent;
    border: 1px solid var(--color-bkg-soft);
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    outline: 0;

    color: var(--color-bkg-hard);
    font-size: var(--fontsize-input);
    font-weight: 300;

    ::placeholder {
        color: var(--color-bkg-soft);
        opacity: 0.7;
        font-weight: 300;
    }

    ::-webkit-scrollbar {
        display: none;
    }
`;

const SendButton = styled.button`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    height: 6vh;
    width: 100%;
    margin-top: 1.5vh;

    outline: 0;
    border: 2px solid var(--color-bkg-soft);
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    color: var(--color-bkg-soft);
    font-size: var(--fontsize);
    font-weight: 600;

    background-image: linear-gradient(var(--color-pix-dark), var(--color-pix-dark) 50%, var(--color-bkg-soft) 50%, var(--color-bkg-soft));
    background-size: 100% 210%;
    transition: background-position .2s;

    :hover{
        cursor: pointer;
        background-position: 0 100%;
        color: var(--color-pix);
    }
`;

const PayWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 15%;
    width: 100%;

    p {
        color: var(--color-bkg-soft);
        font-size: var(--fontsize-title);
        font-weight: 900;
        font-style: italic;
    }

    span {
        font-weight: 600;
        margin-left: 1vw;
    }
`;

export default function Cart() {

    const [price, setPrice] = useState('');
    const [display, setDisplay] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setDisplay(price);
    };

    const priceNumber = Number(display);

    const formattedPrice = priceNumber.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
    });

    return (
        <Cartdiv>
            <LogoWrapper>
                <Piximg src={DivPix} alt="Logo DivPix"/>
                <p>DivPix</p>
            </LogoWrapper>
            <EmpresaWrapper>
                <p>You are purchasing with</p>
                <EmpresaXimg src={EmpresaX} alt="Logo Empresa X"/>
            </EmpresaWrapper>
            <CartForm onSubmit={handleSubmit}>
                <FormTitle>Your cart</FormTitle>
                <InputName>Product</InputName>
                <InputBox 
                    type="text"
                    placeholder='Ex.: Dog Food'
                >
                </InputBox>
                <InputName>Price</InputName>
                <InputBox 
                    type="number"
                    placeholder='XXXXX'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                >
                </InputBox>
                <SendButton type="submit">Simulate customer cart</SendButton>
            </CartForm>
            <PayWrapper>
                <p>Total: <span>{formattedPrice}</span></p>
            </PayWrapper>
        </Cartdiv>
    );
}