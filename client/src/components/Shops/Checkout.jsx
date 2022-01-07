import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import Swal from 'sweetalert2';
import {CardElement, Elements, useElements, useStripe} from "@stripe/react-stripe-js"
import { loadStripe } from '@stripe/stripe-js';
import { useNavigate } from 'react-router-dom';
import { getProductsCartUser } from '../../actions';
import s from '../../assets/styles/Checkout.module.css'
import { formatMoney } from 'accounting';


const stripePromise = loadStripe('pk_test_51KE0nYFfD78XPAGcGPPH7JVRgUrvShCe00gJQTJ8do8OhF6s205GYs2OrB7qBEdQVhQj3Xh0YtjqE6pAuBQSyomS00FxVwsPvF')

function Validate(input) {
    let errors = {};
    //let emailPatron = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;


    if(!input.name){
        errors.name = 'name is required';
    }else if(!/^\w{3,20}$/.test(input.name)){
        errors.name = 'Invalid name'
    }else if(!input.lastName){
        errors.lastName = 'lastName es required'
    }else if(!/^[a-zA-ZA\s]{3,20}$/.test(input.lastName)){
        errors.lastName = 'Invalid lastName'
    }else if(!input.address){
        errors.address = 'address is required';
    }
    else if(!input.email){
        errors.email = 'email is required'
    } else if(!input.email){
        errors.email = 'Invalid email'
    }
    return errors;
}

export default function Checkout(){
        const dispatch = useDispatch()
        const navigate = useNavigate()

        const token=localStorage.getItem('token')
        
        const [state,setState]= useState({
            email:'',
            country:'',
            city:'',
            address:'',
            postalCode:''
        })
        
        const cart = useSelector((state)=>state.ordenReducer.cart)

        let totalPrice= 0 
        let iva = 0  
        var buys=[]
        for (const i in cart) {
            //console.log("hola", cart)
            buys.push({
                name:cart[i].name,
                image: cart[i].image, 
                price: formatMoney(cart[i].price),
                qty: Number(cart[i].qty),
            })
            totalPrice += (cart[i].price*cart[i].qty)
            iva = (totalPrice*0.21)
            // console.log("comp",buys)
            // console.log("iva",iva)
        }
        
       
        function handleChange(e){
            setState({
                ...state,
                [e.target.name]:e.target.value
            });
        };
        
        const Payment = () => {
            const stripe = useStripe();
            const elements = useElements();

            const handleSubmit = async(e) => {
            e.preventDefault();
            const {error, paymentMethod} = await stripe.createPaymentMethod({
                type:"card",
                card: elements.getElement(CardElement)
            })
                    if(!error) {
                        const {id} = paymentMethod;
                        let pay = {
                            product: buys,
                            email: state.email,
                            address: `${state.country}/ ${state.city}, ${state.address}, CP: ${state.postalCode}`,
                            amount: Math.round(totalPrice)*0.1,
                            pay: id
                        }
                dispatch(getProductsCartUser(pay, token)) //aca deberia ir la ruta post
                    Swal.fire({
                        icon: 'success',
                        text: "Thank you for your purchase , you will receive an email with the details,  success",
                        showConfirmButton: false,
                        timer: 3000
                })
                navigate('/ ') //q vaya a ordenes
                } else {
                    console.log(error); 
                }
        }
            return <form className= {s.form_compra}  
                            onSubmit={handleSubmit}>
                        <CardElement className={s.card}/>     
                        {state.email && state.country && state.address && state.postalCode && 
                        <button className={s.btn}>
                                Buy
                            </button>}
                    </form>       
        }

        
        return(   
    
    <div className={s.container}>
            <h1 className={s.title}>Order Summary</h1>
        <div className={s.container_pasarela}>
            <div className={s.pasarela_card}>
            {cart.map(e=>{       /*aca va token*/ 
                return (<div key={e.idProduct} className={s.pasarela_cdtm}>
                        <div>
                        <img className={s.image_pasarela} alt="imagen_pasarela"src={e.image}></img>
                        </div>
                        <div className={s.pasarela_info}>
                        <div><p className={s.titulo_pasarela}>{e.name}</p></div>
                        
                        
                        <div><p className={s.unidades_pasarela}>Unidades: {e.qty}</p></div>
                       <div><p className={s.precio_pasarela}><span className={s.peso_pasarela}></span> {formatMoney(e.price)}</p></div>
                        </div>
                    </div>)
                    
            })}
            </div>
            <div className={s.datos_pasarela}>

                <p className={s.neto_pasarela}>Sub-Total: <span className={s.subtotal_pasarela}> {formatMoney(totalPrice.toFixed(2))} </span> </p>
                <p className={s.neto_pasarela}>iva: <span className={s.subtotal_pasarela}> {formatMoney((totalPrice* 0.21).toFixed(2))}</span> </p>
                <p className='total_pasarela'> Total Amount:<span className="total_numero_pasarela">{formatMoney(Math.round(totalPrice + iva ))}</span></p>
            </div>
        </div>
            { buys?(<div className={s.contenedor_facturacion}>
                <p className={s.facturacion_pasarela}>Facturación</p>     
                <p className={s.direccion_pasarela}>Dirección de envío</p>
                <div className={s.datos_personales_pasarela}>
                <div>
                    <label>First Name</label>  
                    <input 
                        type='text'
                        pattern= '/[az-AZ]' 
                        required 
                        autoComplete='first-name' 
                        name='firstName' 
                        value={state.firstName} 
                        onChange={(e)=>handleChange(e)} />    
                    </div>
                    <div>
                    <label>Laast Name</label>  
                    <input 
                        type='text' 
                        required 
                        autoComplete='last-name' 
                        name='lastName' 
                        value={state.lastName} 
                        onChange={(e)=>handleChange(e)} />    
                    </div>
                    <div>
                    <label>Email</label>  
                    <input 
                        type='text' 
                        required 
                        autoComplete='email' 
                        name='email' 
                        value={state.email} 
                        onChange={(e)=>handleChange(e)} />    
                    </div>
                    

                    <div>
                    <label>Country</label>  
                    <input 
                        type='text' 
                        required 
                        autoComplete='country-name' 
                        name='country' 
                        value={state.country} 
                        onChange={(e)=>handleChange(e)} />    
                    </div>
                    <div>
                    <label>City</label> 
                    <input 
                        type='text' 
                        required 
                        autoComplete='off' 
                        name='city' 
                        value={state.city} 
                        onChange={(e)=>handleChange(e)}/>    
                    </div>
                    <div>
                    <label>Address</label>  
                    <input 
                        type='text' 
                        required 
                        autoComplete='street-address' 
                        name='address' 
                        value={state.address} 
                        onChange={(e)=>handleChange(e)} />     
                    </div>
                    <div>
                    <label>Postal Code</label>  
                    <input 
                        type='number' 
                        required 
                        autoComplete='postal-code' 
                        name='postalCode' 
                        value={state.postalCode} 
                        onChange={(e)=>handleChange(e)}/>    
                    </div>
               </div>
                <div>
                    <Elements stripe={stripePromise}>
                        <Payment/>
                    </Elements>                      
                </div>
            </div>): (<div>
                <p>To continue with the purchase you must LOG IN </p>

            </div>)}

        </div>
    
    
    )
}


