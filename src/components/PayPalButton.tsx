import { PayPalScriptProvider, PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useCallback } from "react";
import { paymentsAPI } from "../services/api";

export type PayPalButtonProps = {
    price: string;
    enrollmentId: number;
    onSuccess: (details: any) => void;
    onError: (error: any) => void;
};

export default function PayPalSection(payPaylButtonProps: PayPalButtonProps ) {
    const initialOptions = {
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: "USD",
        intent: "capture",
    };
    console.log('initial PayPal options:', initialOptions);

    return (
        <PayPalScriptProvider options={initialOptions}>
            <PayPalButtonsUI {...payPaylButtonProps} />
        </PayPalScriptProvider>
    )
}

//TODO:
// add check if user is a member or not and adjust the price accordingly
// add logic to have an onComplete function where the database should update that the class is paid
// add logic to make ui refresh after payment completes
function PayPalButtonsUI({ price, enrollmentId, onSuccess, onError }: PayPalButtonProps) {
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();

    //should use the cost of the class based on if the user is a member or not
    const onCreateOrder = useCallback((data: any, actions: any) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: price,
                    },
                },
            ],
        });
    },[]);

    //todo: this function is called when payment is completed by user. This is where we should update our database
    const onApproveOrder = useCallback((data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
            const name = details.payer.name.given_name;
            //TODO: add the enrollment id to this component
            const paymentInfo = {
                enrollmentId: enrollmentId,
                amountPaid: price,
                checkNo: "PayPal"
            }
            paymentsAPI.create(paymentInfo).then((response) => {
                console.log('Payment record created:', response);
                console.log(`Transaction completed by ${name}`);
            });            
        });
    },[])

    const showPaypal = false;
    return (
        <div>
        { isPending ? <div className="spinner" /> : 
            <div className="paypal-button-container" style={{ maxWidth: "200px" }}>
                {showPaypal ? <PayPalButtons
                    createOrder={onCreateOrder}
                    onApprove={onApproveOrder}
                    style={{ layout: "horizontal", shape: "rect", height: 25 }}
                /> : <button onClick={() => {
                    const name = "User"; // Placeholder name since PayPal is disabled
                    //TODO: add the enrollment id to this component
                    const paymentInfo = {
                        enrollmentId: enrollmentId,
                        amountPaid: price,
                        checkNo: "PayPal"
                    }
                    paymentsAPI.create(paymentInfo).then((response) => {
                        console.log('Payment record created:', response);
                        console.log(`Transaction completed by ${name}`);
                        onSuccess(response);
                    }).catch((error) => {
                        console.error('Error creating payment record:', error);
                        onError(error);
                    });
                }}>PayPal Disabled</button>}
            </div>
        }
        </div>
    );
}