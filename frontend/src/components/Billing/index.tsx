import styled from 'styled-components';
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const Billingdiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 90%;
    width: 75%;
    border-radius: 10px;
`;

const AuthForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 42%;
    width: 100%;

    .lds-ring {
    display: inline-block;
    position: relative;
    width: 40px;
    height: 40px;
    }
    .lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 32px;
    height: 32px;
    margin: 8px;
    border: 8px solid #fff;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #fff transparent transparent transparent;
    }
    .lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
    }
    .lds-ring div:nth-child(2) {
    animation-delay: -0.3s;
    }
    .lds-ring div:nth-child(3) {
    animation-delay: -0.15s;
    }
    @keyframes lds-ring {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
    }

    .loading{
        opacity: 0.3;
        //add a loading animation

    }
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

    .selected{
        background-position: 0 100%;
        color: var(--color-bkg-soft);
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
    align-items: center;
    text-align: center;

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
    
    option{
        display: flex;
        flex-direction: row;
        color: #000000;
        span{
            margin-left: 20px;
            //make italic
            font-style: italic;
        }
    }

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


export default function Billing(props: any) {
    
    const price = props.price;
    const initialDownPayment = props.downPayment

    const [name, setName] = useState("");
    const [cpf, setCpf] = useState("");
    const [showPayment, setShowPayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");
    const [loadingGetOptions, setLoadingGetOptions] = useState(false);

    const userId = "43a39201-dd1a-4636-9485-592103dba08e"
    const [paymentOptions, setPaymentOptions] = useState([]);

    const [loadingPayment, setLoadingPayment] = useState(false);
    const [purchaseAmount, setPurchaseAmount] = useState(0);
    const [downPayment, setDownPayment] = useState(0);
    const [monthlyPayment, setMonthlyPayment] = useState(0);
    const [numberSplits, setNumberSplits] = useState(0);

    const [qrCodeLink, setQrCodeLink] = useState("");
    

    const handleInfoSubmit = (event: any) => {
        event.preventDefault();
        setLoadingGetOptions(true);
        const url = `${process.env.REACT_APP_BASE_URL}/get-payment-options`;
        const header= {
            Authorization: process.env.REACT_APP_PASSWORD
        }

        const body = {
            "final_user_id": userId,
            "purchase_amount": Number(price),
            "down_payment": Number(initialDownPayment),
            "final_user_document": cpf
        }

        axios.post(url, body, {headers: header})
        .then((res) => {
            console.log(res.data.eligible_options)
            setPaymentOptions(res.data.eligible_options);
            const option1 = res.data.eligible_options[0];
            setPurchaseAmount(option1.purchase_amount);
            setMonthlyPayment(option1.monthly_payment);
            setNumberSplits(option1.number_splits);
            setDownPayment(option1.purchase_amount - option1.monthly_payment * option1.number_splits);
            setShowPayment(true)
        })
        .catch((err) => {
            console.log(err);
            alert("Error getting payment options. Try again later.")
        })
        .finally(() => {
            setLoadingGetOptions(false);
        })
    };

    const handlePaymentSubmit = (event: any) => {
        event.preventDefault();
        setLoadingPayment(true);
        const url = `${process.env.REACT_APP_BASE_URL}/create-payment`;
        const header= {
            Authorization: process.env.REACT_APP_PASSWORD
        }

        const body = {
            "final_user_id": userId,
            "purchase_amount": Number(purchaseAmount),
            "number_splits": Number(numberSplits),
            "down_payment": Number(downPayment),
            "monthly_payment": Number(monthlyPayment)
        }

        console.log(body)

        axios.post(url, body, {headers: header})
        .then((res) => {
            if("qr_code_img_link" in res.data){
                //redirect to qr code
                window.open(res.data.qr_code_img_link)
            }
        })
        .catch((err) => {
            console.log(err);
            alert("Error getting payment options. Try again later.")
        })
        .finally(() => {
            setLoadingPayment(false);
        });
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
                    onChange={(e) => setCpf(e.target.value)}
                >
                </InputBox>
                <SendButton
                className={loadingGetOptions ? 'loading' : ''}
                type="submit">{loadingGetOptions ? <div className="lds-ring"><div></div><div></div><div></div><div></div></div>  :"See Payment Options"}</SendButton>
            </AuthForm>
            <PaymentMethod>
                <FormTitle>Payment Method</FormTitle>
                <MethodWrapper>
                    <button  
                    className={paymentMethod === 'PIX' ? 'selected' : ''}
                    onClick={() => {
                        paymentMethod === "PIX" ? setPaymentMethod("") : setPaymentMethod("PIX")
                    }}
                    >PIX</button>
                    <button
                    className={paymentMethod === 'Credit Card' ? 'selected' : ''}
                    onClick={() => {
                        paymentMethod === "Credit Card" ? setPaymentMethod("") : setPaymentMethod("Credit Card")
                    }}
                    >Credit Card</button>
                    <button
                    className={paymentMethod === 'Debt Card' ? 'selected' : ''}
                    onClick={() => {
                        paymentMethod === "Debt Card" ? setPaymentMethod("") : setPaymentMethod("Debt Card")
                    }}
                    >Debt Card</button>
                </MethodWrapper>
            </PaymentMethod>
            {showPayment && <PaymentForm onSubmit={handlePaymentSubmit}>
                <InputName>Método</InputName>
                <SelectBox 
                    placeholder='Escolha em quantas vezes parcelar'
                    
                    onChange={(e: any)=> {
                        setPurchaseAmount(paymentOptions[e.target.value]["purchase_amount"]);
                        setMonthlyPayment(paymentOptions[e.target.value]["monthly_payment"]);
                        setNumberSplits(paymentOptions[e.target.value]["number_splits"]);
                        setDownPayment(paymentOptions[e.target.value]["purchase_amount"] - paymentOptions[e.target.value]["monthly_payment"] * paymentOptions[e.target.value]["number_splits"]);
                    }}
                >
                    {paymentOptions.map((option: any, idx) => {
                        
                        const installments = option.number_splits;
                        const installmentValue = option.monthly_payment;
                        const totalValue = option.total_amount;

                        return(
                            <option 
                           
                            key={idx} value={idx}>{`${installments} vezes de R$ ${Number(installmentValue).toFixed(2)}     `} <span>Total: R${Number(totalValue).toFixed(2)}</span> </option>
                        );
                    })}
                </SelectBox>
                
                <SendButton className={loadingPayment ? 'loading' : ''}
                type="submit">{loadingPayment ? <div className="lds-ring"><div></div><div></div><div></div><div></div></div>  :"Approve Purchase"}</SendButton>

            </PaymentForm>}
        </Billingdiv>
    );
}