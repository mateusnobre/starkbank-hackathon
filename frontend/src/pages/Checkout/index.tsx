import styled from 'styled-components';
import React, { useState } from 'react';
import Cart from '../../components/Cart';
import Billing from '../../components/Billing';

const Bkgdiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;

    height: 100vh;
    width: 100%;
`;

const CartWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    padding-top: 8vh;
    padding-left: 5vw;
    height: calc(100% - 8vh);
    width: calc(50% - 5vw);

    background: var(--color-pix);
`;

const BillingWrapper = styled(CartWrapper)`
    padding-left: 0;
    padding-right: 5vw;
    background: var(--color-bkg-soft);
`;

const Footer = styled.div`
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    bottom: 0;
    height: 8vh;
    padding-left: 5vw;
    width: calc(50% - 5vw);

    color: var(--color-bkg-inv-hard);
    letter-spacing: 1px;
    white-space: nowrap;

    p {
        font-weight: 300;
    }

    span {
        font-weight: 600;
    }
`;

export default function Checkout() {

    const [price, setPrice] = useState(0);
    const [downPayment, setDownPayment] = useState(0);

    return (
        <Bkgdiv>
            <CartWrapper>
                <Cart
                price={price}
                setPrice={setPrice}
                downPayment={downPayment}
                setDownPayment={setDownPayment}
                />
            </CartWrapper>
            <BillingWrapper>
                <Billing
                price={price}
                downPayment={downPayment}
                />
            </BillingWrapper>
            <Footer>
                <p>Powered by <span>Starkbank</span></p>
            </Footer>
        </Bkgdiv>
    );
}