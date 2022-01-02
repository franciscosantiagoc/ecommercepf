import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {useDispatch , useSelector} from 'react-redux';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import s from "../assets/styles/login.module.css";
import googleIcon from "../assets/img/google.png";
import githubIcon from "../assets/img/github.png";
import facebookIcon from "../assets/img/facebook.png";
import { getAuth, 
    signInWithPopup, 
    GoogleAuthProvider,
    GithubAuthProvider, 
    FacebookAuthProvider, 
    setPersistence, 
    browserSessionPersistence,
} from 'firebase/auth';
import { login } from '../actions/index'


const Login = () => {
    const auth = getAuth();
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const loginuser = useSelector(state=>state.usersReducer.loginInfo)
    
    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    });
    const mkLogin= async (e,type)=>{
        e.preventDefault();
        console.log(type)
        let provider;
        if(type==='google') provider = new GoogleAuthProvider();
        else if(type==='github') provider = new GithubAuthProvider();
        else if(type==='facebook') provider = new FacebookAuthProvider();
        setPersistence(auth, browserSessionPersistence)
        .then(()=>{
            return signInWithPopup(auth, provider).then(res=>{
                console.log(res.user);
                let data={
                    isVerified: res.user.emailVerified,
                    id: res.user.uid,
                    name: res.user.displayName,
                    photo: res.user.photoURL,
                }
                dispatch(login(data))
            })
        }).catch((error) => {
            console.log('error '+error)
            Swal.fire({
                title:'Error al iniciar sesión',
                text: error.message,
                icon: 'error'
            })
        });
        //if(type==='email')
          /*await signInWithPopup(auth, provider)
           .then((userCredential) => {
            const userdat = userCredential.user;
            console.log(userdat)
            //setUser({...userdat,account:'google'})
            setLogin(true)
          })
          .catch((error) => {
            console.log('error '+error)
          }); */
        
      }
    useEffect(() => {
        console.log(login)
        if(loginuser.user.token){
            navigate('/')
        }
    }, [loginuser])
    return (
        <div className={s.container}>
            <div className={s.wrapLogin}>
                <form className={s.form} >
                    <h2 className={s.title}>Login</h2>
                    <div className={s.formGroup}>
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
                        <FontAwesomeIcon className={s.iconInput} icon={faEnvelope}/>
                    </div>
                    <div className={s.formGroup}>
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
                            type="password" 
                            placeholder="Contraseña"
                        />
                        <FontAwesomeIcon className={s.iconInput} icon={faLock}/>
                        
                    </div>
                    <Link className={s.link} to="/reset_pass">¿Olvidaste tu contraseña?</Link>
                    <div className={s.containerbuttons}>
                        <button name="loginWithGoogle" className={`${s.firstbtn} ${s.alternativeSubmit}`} onClick={(e)=>mkLogin(e,'google')}>
                            <img className={s.icon} src={googleIcon} alt="icono"/>
                        </button>

                        
                        <button name="loginWithGithub" className={s.alternativeSubmit} type="submit">
                            <img className={s.icon} src={githubIcon} alt="icono"/>
                        </button>

                        <button name="loginWithFB" className={s.alternativeSubmit} type="submit">
                            <img className={s.icon} src={facebookIcon} alt="icono"/>
                        </button>
                    </div>
                    <button name="login" className={`${s.normalSubmit} ${s.btnText}`} type="submit">Ingresar</button>

                    <p>Si no tenes cuenta,<Link className={s.link} to="/register"> create una aquí</Link></p>
                </form>
            </div>
        </div>
    )
}

export default Login