import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {useDispatch , useSelector} from 'react-redux';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock, faEye } from '@fortawesome/free-solid-svg-icons'
import s from "../assets/styles/login.module.css";

import { getAuth, 
    signInWithPopup, 
    GoogleAuthProvider,
    GithubAuthProvider, 
    FacebookAuthProvider, 
    setPersistence, 
    browserSessionPersistence,
} from 'firebase/auth';
import { login, loginWithNormalAccount, getWishList } from '../actions/index'
import AccountsButtons from "./AccountsButtons.jsx";

//TODO: falta hacer que al loguarse con una cuenta de alguna red social, si está registrada en la bd, que me deje entrar, de lo contrario que no me deje

const Login = () => {
    const auth = getAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loginuser = useSelector(state => state.usersReducer.loginInfo);
    //?|Para mostrar la contraseña
    const [passwordShown, setPasswordShown] = useState(false);
    //?|Para que se cambie la visibilidad:
    const togglePasswordVisiblity = () => {
      setPasswordShown(passwordShown ? false : true);
    };
    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    });
    //[Para ingresar con presionar el enter
    const handleKeyDown=(e)=>{
      //! console.log(e.keyCode); // 13 return 
      if (e.keyCode === 13){
         dispatch(loginWithNormalAccount(inputs))
      }
    }
    const mkLogin = async (e,type)=>{
        e.preventDefault();
                
        let provider;
        
        if(type==='google') provider = new GoogleAuthProvider();
        else if(type==='github') provider = new GithubAuthProvider();
        else if(type==='facebook') provider = new FacebookAuthProvider();

        setPersistence(auth, browserSessionPersistence)
        .then(async ()=>{
            return signInWithPopup(auth, provider).then(res=>{
                let data = {
                    token: res.user.accessToken,
                    stsTokenManager: res.user.stsTokenManager,
                    uid: res.user.uid,
                    isVerified: res.user.emailVerified,
                    idUser: res.user.uid,
                    name: res.user.displayName.split(" ")[0],
                    lastName: res.user.displayName.split(" ")[1],
                    photo: res.user.photoURL,
                    email: res.user.email
                };

                dispatch(login(data));
            })
        }).catch((error) => {
            if(error.message.split("/")[1] === "account-exists-with-different-credential)."){
                Swal.fire({
                    title:'Ya tiene una cuenta con el mismo email',
                    text: "no puede iniciar sesión en una cuenta no registrada en la base de datos que tenga el mismo email. Use la cuenta con la que se haya registrado",
                    icon: 'error'
                })
            }else{
                Swal.fire({
                    title:'Error al iniciar sesión',
                    text: error.message,
                    icon: 'error'
                })
            }
        });
    }

    useEffect(() => {
        if(!loginuser.error){
            if(loginuser.user.idUser){
                console.log(loginuser)
                if(loginuser.user.changePassword){
                    Swal.fire({
                        title:'Se sugiere que cambie la contraseña para asegurar la contraseña',
                        text: "De no cambiarla, esta alerta seguirá apareciendo cáda vez que inicie sesión. Presione ok para cambiar la contraseña.",
                        icon: 'info'
                    }).then(res => {
                        if(res.isConfirmed){
                            navigate("/profile");
                        }
                    })
                }

                dispatch(getWishList(loginuser.user.idUser));
                navigate("/");
            }
        }else{
            Swal.fire({
                title:'El usuario no existe en la base de datos',
                text: "Asegurese de haber escrito bien los datos. O cree una cuenta si no la tiene",
                icon: 'error'
            });

            setInputs({
                email: "",
                password: ""
            })
        }
    }, [dispatch,loginuser])

    return (
        <div className={s.container}>
            <div className={s.wrapLogin}>
                <form 
                  className={s.form} 
                  onSubmit={e => {
                    e.preventDefault();
                    dispatch(loginWithNormalAccount(inputs));
                }}
                  onKeyDown={handleKeyDown}
                >
                    <h2 className={s.title}>Login</h2>
                    <div className={s.formGroup}>
                        <i className={s.iconInput} ><FontAwesomeIcon  icon={faEnvelope}/></i>
                        <input 
                            onChange={e => setInputs(prev => {
                                return{
                                    ...prev,
                                    [e.target.name]: e.target.value
                                }
                            })} 
                            className={s.input} 
                            name="email" 
                            value={inputs.email}
                            type="email"
                            placeholder="Email"
                        />
                        
                    </div>
                    <div className={`${s.formGroup} ${s.password}`}>
                    <i className={s.iconInput}><FontAwesomeIcon  icon={faLock}/></i>
                        <input 
                            onChange={e => setInputs(prev => {
                                return{
                                    ...prev,
                                    [e.target.name]: e.target.value
                                }
                            })} 
                            className={s.input} 
                            name="password"
                            value={inputs.password} 
                            type={passwordShown?"text":"password"} 
                            placeholder="Contraseña"
                        />
                        <i onClick={togglePasswordVisiblity} className={s.toggleBtn}><FontAwesomeIcon  icon={faEye} /></i>
                        
                    </div>

                    <Link className={s.link} to="/reset_pass">¿Olvidaste tu contraseña?</Link>
                  <form>
                    <AccountsButtons access={mkLogin}/>
                  </form>

                    <button name="login" className={`${s.normalSubmit} ${s.btnText}`} type="submit">Ingresar</button>

                    <p>Si no tenes cuenta,<Link className={s.link} to="/register"> create una aquí</Link></p>
                </form>
            </div>
        </div>
    )
}

export default Login