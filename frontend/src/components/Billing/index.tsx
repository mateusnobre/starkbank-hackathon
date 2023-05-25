import styled from 'styled-components';
import React, { useState } from 'react';

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
    height: 45%;
    width: 100%;
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
    font-size: var(--fontsize-subtitle);
    font-weight: 600;
`;

const InputBox = styled.input`
    display: flex;
    flex-direction: column;
    justify-content: center;

    text-indent: 1vw;
    width: 99%;
    height: 5vh;
    margin-bottom: 2vh;

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
    margin-top: 1vh;

    outline: 0;
    border: 2px solid var(--color-pix);
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    color: var(--color-pix);
    font-size: var(--fontsize-title);
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

    const handleSubmit = () => {
        console.log('form submitted ✅');
        alert(`The name you entered was: ${name}`)
    };

    return (
        <Billingdiv>
            <AuthForm>
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
                >
                </InputBox>
                <SendButton type="submit">Send Info</SendButton>
            </AuthForm>
        </Billingdiv>
    );
}