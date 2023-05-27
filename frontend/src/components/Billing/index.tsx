import styled from 'styled-components';
import React, { useState, useRef, useEffect } from 'react';

const Billingdiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 90%;
    width: 75%;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const AuthForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 42%;
    width: 100%;
`;

const PaymentForm = styled(AuthForm)`
    height: 38%;
`;

const PaymentMethod = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 20%;
    width: 100%;
`;

const MethodWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: calc(70% - 3vh);
    width: 100%;

    button {
        height: 85%;
        width: 31%;
        background: transparent;
        border: 1px solid var(--color-bkg-inv-soft);
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

        color: var(--color-bkg-inv-hard);
        font-size: var(--fontsize);

        background-image: linear-gradient(var(--color-bkg-soft), var(--color-bkg-soft) 50%, var(--color-bkg-inv-soft) 50%, var(--color-bkg-inv-soft));
        background-size: 100% 210%;
        transition: background-position .2s;

        :hover{
            cursor: pointer;
            background-position: 0 100%;
            color: var(--color-bkg-soft);
        }
    }
`;

const FormTitle = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;

    width: 100%;
    padding-top: 1vh;
    padding-bottom: 2vh;

    color: var(--color-bkg-inv-hard);
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

    color: var(--color-bkg-inv-hard);
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
    border: 1px solid var(--color-bkg-inv-soft);
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    outline: 0;

    color: var(--color-bkg-inv-hard);
    font-size: var(--fontsize-input);
    font-weight: 300;

    ::placeholder {
        color: var(--color-bkg-inv-soft);
        opacity: 0.7;
        font-weight: 300;
    }

    ::-webkit-scrollbar {
        display: none;
    }
`;

const SelectBox = styled.select`
    display: flex;
    flex-direction: column;
    justify-content: center;

    text-indent: 1vw;
    width: 100%;
    height: 5vh;
    margin-bottom: 1vh;

    background: transparent;
    border: 1px solid var(--color-bkg-inv-soft);
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    outline: 0;

    color: var(--color-bkg-inv-hard);
    font-size: var(--fontsize-input);
    font-weight: 300;

    ::placeholder {
        color: var(--color-bkg-inv-soft);
        opacity: 0.7;
        font-weight: 300;
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
    border: 2px solid var(--color-pix);
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    color: var(--color-pix);
    font-size: var(--fontsize);
    font-weight: 600;

    background-image: linear-gradient(var(--color-bkg-soft), var(--color-bkg-soft) 50%, var(--color-pix) 50%, var(--color-pix));
    background-size: 100% 210%;
    transition: background-position .2s;

    :hover{
        cursor: pointer;
        background-position: 0 100%;
        color: var(--color-bkg-soft);
    }
`;


export default function Billing() {

    const [name, setName] = useState("");

    const handleInfoSubmit = () => {
        console.log('form submitted ✅');
        alert(`The name you entered was: ${name}`)
    };

    const handlePaymentSubmit = () => {
        console.log('form submitted ✅');
        alert(`The payment is done`)
    };

    const numberInputRef = useRef<HTMLInputElement>(null);


    // Only to disable scrolling in input type number
    useEffect(() => {
        const numberInput = numberInputRef.current;

        const handleWheel = (event: WheelEvent) => {
        event.preventDefault();
        };

        if (numberInput) {
        numberInput.addEventListener('wheel', handleWheel);
        }

        return () => {
        if (numberInput) {
            numberInput.removeEventListener('wheel', handleWheel);
        }
        };
    }, []);
    // Only to disable scrolling in input type number

    return (
        <Billingdiv>
            <AuthForm onSubmit={handleInfoSubmit}>
                <FormTitle>Personal Info</FormTitle>
                <InputName>Email</InputName>
                <InputBox 
                    type="text"
                    placeholder='xxx@xxx.com'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                >
                </InputBox>
                <InputName>CPF</InputName>
                <InputBox 
                    type="number"
                    placeholder='XXXXX'
                    ref={numberInputRef}
                >
                </InputBox>
                <SendButton type="submit">Send Info</SendButton>
            </AuthForm>
            <PaymentMethod>
                <FormTitle>Payment Method</FormTitle>
                <MethodWrapper>
                    <button>PIX</button>
                    <button>Credit Card</button>
                    <button>Debt Card</button>
                </MethodWrapper>
            </PaymentMethod>
            <PaymentForm onSubmit={handlePaymentSubmit}>
                <InputName>Método</InputName>
                <SelectBox 
                    placeholder='Escolha em quantas vezes parcelar'
                >
                    <li>A vista</li>
                    <li>1X</li>
                    <li>2X</li>
                </SelectBox>
                <InputName>Chave Pix</InputName>
                <InputBox 
                    type="number"
                    placeholder='XXXXX'
                >
                </InputBox>
                <SendButton type="submit">Send Payment</SendButton>
            </PaymentForm>
        </Billingdiv>
    );
}