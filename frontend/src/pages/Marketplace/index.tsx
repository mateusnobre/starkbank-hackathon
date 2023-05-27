import styled from 'styled-components';
import React from 'react';
import StarkLogo from '../../assets/stark_logo.png';
import DivPix from '../../assets/divpix_transparent.png';
import { useNavigate } from 'react-router-dom';

const Bkgdiv = styled.div`
    display: flex;
    flex-direction: column;

    height: 99vh;
    width: 99vw;
    background-color: var(--color-bkg-soft);
`;

const Menumkt = styled.div`
    position: fixed;
    display: flex;
    flex-direction: column;

    height: 100%;
    width: 15%;
    padding-left: 2.5%;
    background-color: var(--color-bkg-hard);

    div {
        margin-top: 2.5vh;
        color: var(--color-bkg-inv-hard);
        background-color: transparent;
        font-size: 1.1rem;
        font-weight: 300;
    
        :hover {
            cursor: pointer;
            color: var(--color-stark);
        }

        span {
            color: var(--color-stark);
        }
    }
`;

const Starkimg = styled.img`
    margin-top: 4vh;
    margin-bottom: 2vh;
    width: 16%;
    cursor: pointer;
`;

const Appbox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;

    height: 20%;
    width: 25%;
    margin-top: 5%;
    margin-left: 20%;

    border-radius: 15px;
    border: 1px solid var(--color-bkg-inv-hard);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

    :hover {
        cursor: pointer;
        background: var(--color-bkg-hard);
    }
`;

const Appimg = styled.img`
    height: 100px;
    width: 100px;
    margin-left: 8%;

    border-radius: 15px;
`;

const Apptext = styled.div`
    height: 80%;
    width: 50%;
    margin-left: 8%;
    
    color: white;

    h1 {
        font-size: 1.5rem;
    }

    p {
        font-size: 0.8rem;
    }
`;

export default function Marketplace() {

    const history = useNavigate();

    return (
        <Bkgdiv>
            <Menumkt>
                <Starkimg src={StarkLogo} alt="Logo StarkBank"/>
                <div><span>Marketplace</span></div>
                <div>Extrato</div>
                <div>Investimentos</div>
                <div>Membros</div>
                <div>Integrações</div>
                <div>Recebimentos</div>
                <div>Cartão Corporativo</div>
                <div>Consultas</div>
                <div>Pagamentos</div>
            </Menumkt>
            <Appbox onClick={() => history('/dashboard')}>
                <Appimg src={DivPix} alt='Pix Parcelado'/>
                <Apptext>
                    <h1>Pix Parcelado</h1>
                    <p>Parcelamento do pagamento pix via análise de crédito do cliente</p>
                </Apptext>
            </Appbox>
        </Bkgdiv>
    );
}