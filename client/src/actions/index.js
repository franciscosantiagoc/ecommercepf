import { GET_ALL_PRODUCTS, 
    GET_PRODUCT_BY_NAME,
    GET_PRODUCT_ID,
    GET_ALL_CATEGORIES,
    GET_ALL_BRANDS,
    FILTER_PRODUCTS_BY_CATEGORY,
    FILTER_PRODUCTS_BY_PRICE,
    FILTER_PRODUCTS_BY_BRANDS,
    SORT_PRODUCTS,
    CREATE_CATEGORY,
    CREATE_PRODUCT,
    CREATE_BRANDS,
    FILTERS_CLEAR,
    REMOVE_CATEGORY,
    REMOVE_BRANDS,
    REMOVE_PRODUCT,
    EDIT_CATEGORY,
    EDIT_PRODUCT,
    EDIT_BRANDS,
    LOGIN,
    LOGOUT,
    //CREATE_USER,
    ADD_TO_CART,
    ADD_TO_CART_FROM_DB,
    DELETE_ITEM_FROM_CART,
    DELETE_ITEM_FROM_CART_LOCALSTORAGE,
    DELETE_ALL_CART,
    CART_FROM_LOCALSTORAGE_TO_DB,
    CART_FROM_DB_TO_LOCALSTORAGE,
    GET_PRODUCTS_CART,
    CHANGE_QTY,
    CLEAR_CART,
    UPDATE,
    CREATE_USER,
    GET_USERS,
    UPDATE_USER,
    SET_ORDER_PRODUCTS, 
    SEND_EMAIL   
} from "./actionsTypes";
import axios from 'axios';


const SERVER = 'http://localhost:3001';


    export function getAllProducts(data,all=false) {
        
        return async function(dispatch){

            try{
                let products=null;
                if(all){
                    products = await axios.get(`${SERVER}/products?all=true`);
                }else{
                    let {offset=0, limit=25, minPrice= null,  maxPrice= null,brand = null, category=null} = data
                    minPrice= minPrice?`&minPrice=${minPrice}`: '';
                    maxPrice=maxPrice?`&maxPrice=${maxPrice}`:'';
                    brand=brand? `&brand=${brand}`:'';
                    category=category? `&category=${category}`:'';
                    //console.log(`${SERVER}/products?offset=${offset}&limit=${limit}${maxPrice}${minPrice}${brand}${category}`)
                    products = await axios.get(`${SERVER}/products?offset=${offset}&limit=${limit}${maxPrice}${minPrice}${brand}${category}`);
                }
                return dispatch({
                    type: GET_ALL_PRODUCTS,
                    payload: products.data
                });
            }catch(err){
                return dispatch({
                    type: GET_ALL_PRODUCTS,
                    payload: []
            })}
        }
    };

    export function getProductId(idProduct) {
        return async function(dispatch){
            try{
                const detail= await axios.get(`${SERVER}/products/${idProduct}`)
                return dispatch({
                    type: GET_PRODUCT_ID,
                    payload: detail.data
                })     
            }catch(err){
                console.log(err)
            }   
        }
    };

    export function getCategories(){
        return async function(dispatch){
            try{
                const categories= await axios.get(`${SERVER}/categories`)
                return dispatch({
                    type: GET_ALL_CATEGORIES,
                    payload: categories.data
                })
            }catch(err){
                console.log("no hay cateegorías", err)
            }
        }
    };

    export function getBrands(){
        return async function(dispatch){
            try{
                const brands= await axios.get(`${SERVER}/brands`)
                return dispatch({
                    type: GET_ALL_BRANDS,
                    payload: brands.data
                })
            }catch(err){
                console.log(err)
            }
        }
    };

    export function createCategory(payload){
        return async function (dispatch){
            try{
                const newCategory = await axios.post(`${SERVER}/categories`, payload)
                return dispatch ({
                    type: CREATE_CATEGORY,
                    payload: newCategory
                })
            }catch(err){
                console.log(err)
            }
        }
    };

    export function createProduct(payload){
        return async function (dispatch){
            try{
                const newProduct = await axios.post(`${SERVER}/products` ,payload)
                return dispatch ({
                    type: CREATE_PRODUCT,
                    payload: newProduct
                })
            }catch(err){
                console.log(err)
            }
        }
    };

    export function createBrands(payload){
        return async function (dispatch){
            try{
                const newBrands = await axios.post(`${SERVER}/brands` ,payload)
                return dispatch ({
                    type: CREATE_BRANDS,
                    payload: newBrands
                })
            }catch(err){
                console.log(err)
            }
        }
    };

    export function getProductByName(name) {
        return async function(dispatch){
            try{
                const product = await axios.get(`${SERVER}/products?search=${name}`)
                return dispatch({
                    type: GET_PRODUCT_BY_NAME,
                    payload: product.data
                })
            }catch(err){
                return dispatch({
                    type: GET_PRODUCT_BY_NAME,
                    payload: []
            })}
        }
    };

    export function filterByCategory(payload){
        return {
            type: FILTER_PRODUCTS_BY_CATEGORY,
            payload
        }
    };

    export function filterByPrice(payload){ //ver si tengo ruta
        return{
            type: FILTER_PRODUCTS_BY_PRICE,
            payload
        }
    };

    export function filterProductByBrand(payload){
        return{
            type: FILTER_PRODUCTS_BY_BRANDS,
            payload
        }
    };

    export function sortProducts(payload){
        return {
            type: SORT_PRODUCTS,
            payload
        }
    };

    export function filtersClear(){
        return {
            type: FILTERS_CLEAR,
        }
    }

    export function createUser(body) {
        console.log(body)
        return async function(dispatch){
            try{
                const res = await axios.post(`${SERVER}/users/create`, body)

                return dispatch({
                    type: CREATE_USER,
                    payload: res.data
                })     
            }catch(e){
                return dispatch({
                    type: CREATE_USER,
                    payload: {error: true, message: "No se pudo crear la cuenta, revise los datos"}
                }) 
            }
        }
    };

    export function clearRegisterInfo(){
        return{
            type: CREATE_USER,
            payload: null
        }
    }

    export function login(payload){
        if(payload.idUser){
            return async function(dispatch){
                try{
                    payload["accountType"] = "external";
    
                    const res = await axios.post(`${SERVER}/user/login`, payload);

                    let data = {
                        user: {
                            ...res.data
                        }
                    }
    
                    localStorage.setItem("user", JSON.stringify(data.user));

                    return dispatch({
                        type: LOGIN,
                        payload: {
                            ...data,
                            error: false
                        }
                    });
                }catch(e){
                    return dispatch({
                        type: LOGIN,
                        payload: {
                            user: {idUser: null},
                            error: true
                        }
                    });
                }
            }
        }else{
            return {
                type: LOGIN,
                payload: {
                    user: {idUser: null},
                    error: null
                }
            }
        }
    }; 

    export function loginWithNormalAccount(payload){
        return async function(dispatch){
            try{
                payload["accountType"] = "internal";

                const res = await axios.post(`${SERVER}/user/login`, payload);

                let data = {
                    user: {
                        ...res.data
                    }
                }

                localStorage.setItem("user", JSON.stringify(data.user));

                return dispatch({
                    type: LOGIN,
                    payload: {
                        ...data,
                        error: false
                    }
                });
            }catch(e){
                return dispatch({
                    type: LOGIN,
                    payload: {
                        user: {idUser: null},
                        error: true
                    }
                });
            }
        }
    }

    export function logOut(){
        return {
            type: LOGIN,
            payload: {isConnected: false}
        } 
    };

    export function removeCategory(id){
        return async function(dispatch){
            try{
                const categories= await axios.delete(`${SERVER}/categories/${id}`)
                return dispatch({
                    type: REMOVE_CATEGORY,
                    payload: id
                })
            }catch(err){
                console.log(err)
            }
        }
    };

    export function removeBrands(id){
        return async function (dispatch){
            try{
                const remBrands = await axios.delete(`${SERVER}/brands/${id}`)
                return dispatch ({
                    type: REMOVE_BRANDS,
                    payload: remBrands
                })
            }catch(err){
                console.lor(err)
            }
        }
    };

    export function removeProducts(id){
        return async function (dispatch){
            try{
                const remProduct = await axios.delete(`${SERVER}/products/${id}`)
                return dispatch ({
                    type: REMOVE_PRODUCT,
                    payload: remProduct
                })
            }catch(err){
                console.log(err)
            }
        }
    };

    export function editCategory(id, name){
        return async function(dispatch){
            try{
                console.log('llamada recibida xD')
                console.log(`${SERVER}/categories/${id}`)
                axios.put(`${SERVER}/categories/${id}`,{name: name})
                //console.log(edCategories)
                return dispatch({
                    type: EDIT_CATEGORY,
                    payload: {id, name}
                })
            }catch(err){
                console.log(err)
            }
        }
    };

    export function editBrand(id,name){
        return async function(dispatch){
            try{
                const edBrands= await axios.put(`${SERVER}/brands/${id}`,{name:name})
                return dispatch({
                    type: EDIT_BRANDS,
                    payload: id
                })
            }catch(err){
                console.log(err)
            }
        }
    };

    export function editProduct(id, name, price, stock, sold_quantity, condition, image, thumbnail, attribute, categories, brands) {
        return async function(dispatch){
            try{
                const edProduct= await axios.put(`${SERVER}/products/${id}`, {name: name, price: price, stock: stock, sold_quantity: sold_quantity, condition: condition, image: image, thumbnail: thumbnail, attribute: attribute, categories: categories, brands: brands})
                return dispatch({
                    type: EDIT_PRODUCT,
                    payload: edProduct
                })     
            }catch(err){
                console.log(err)
            }
        }   
    };

    

    
   // me traigo el carro de productos tanto de usuarios como de invitados

     export function getProductsCartUser(userId){
         console.log("getproductscart",userId)
         return async function (dispatch){
                 try{
                 if(!userId){
                     console.log("condicion nousuario cart")
                     const itemsCart = JSON.parse(localStorage.getItem("cart")) || [];
                     return dispatch({
                         type: GET_PRODUCTS_CART,
                         payload: itemsCart
                     })
                 
                 }else{
                    //localStorageCartToDB(userId)
                    const {data}= await axios.get(`${SERVER}/users/cart/${userId}`)
                    
                    /* dispatch({
                        type: CLEAR_CART
                    }) */
                    const localCart = JSON.parse(localStorage.getItem("cart")) || [] //orderId es el estado para la orden de ese usuario
                    //localStorage.removeItem("cart")
                    const res= await axios.put(`${SERVER}/users/cart/${userId}`,{productsInfo: [...data.cart,...localCart]})
                     return dispatch ({
                         type: GET_PRODUCTS_CART,
                         payload: res.data.cart
                     })
                  }
             }catch(err){
                 console.log(err)
             }
         }
     }
    
    
    //para boton de carro y cantidades seleccionadas
    
    export const addToCart = (product, userId) => (dispatch) => {
        console.log('jo',product)
        if (!userId) {
            let products = JSON.parse(localStorage.getItem("cart")) || [];
          let productFind = false;
          products = products.map((p) => {
              
            if (p.idProduct === product.idProduct ) {
                  productFind = true;
              return {
                    ...p,
                    //qty: Number(p.qty) + 1,
                    amount: Number(p.amount) + product.amount<=p.stock?Number(p.amount) + product.amount:p.amount,
                }; 
            }
            return p;
          });
          
           if (productFind===false){ 
              products.push(product);
              console.log(products)
          }
          products= products.filter(p=>p.amount>0)
          localStorage.setItem("cart", JSON.stringify(products));
          return dispatch({ 
              type: ADD_TO_CART,
              payload: products });/* */
        }
      if (userId) {
          const body = {productsInfo: [{...product}/* id: product.idProduct, qty: 1  */]};
          console.log('lo',product.idProduct)
          return axios
            .put(`${SERVER}/users/cart/${userId}`, body) //fatlta autenci usuario
            .then((response) => {
                console.log("putproductadd",response)
              dispatch({ 
                  type: ADD_TO_CART_FROM_DB,
                  payload: response.data.cart 
                });
            })
            .catch((error) => console.error(error));
        } 
    };
  
    
    export function deleteItemFromCart(idProduct, userId){
        console.log("Id a eliminar", idProduct)
        console.log("Id usuariocart a eliminar", userId)
        return async (dispatch) =>{
            try{
                if(!userId){
                    let cart = JSON.parse(localStorage.getItem("cart")) || [];
                    let itemFind = false;
                    cart = cart.map((p) => {
                        console.log("map",p)
                        if(p.idProduct === idProduct){
                            console.log("item coincidente")
                            itemFind = true;
                            return {
                                ...p,
                                amount: 0
                            }
                        }
                        return p;
                    });
                    cart = cart.filter(p=>p.amount>0)
                    localStorage.setItem("cart", JSON.stringify(cart));
                    return dispatch ({
                        type: GET_PRODUCTS_CART,
                        payload: cart
                    })
                    /* return dispatch({
                        type: DELETE_ITEM_FROM_CART_LOCALSTORAGE,
                        payload: {idProduct}
                    }) */
                }
                else{
                    const {data} = await axios.delete(`${SERVER}/users/cart/${userId}?idProduct=${idProduct}`)
                    console.log("deleteitem",data.cart)
                    return dispatch ({
                        type: GET_PRODUCTS_CART,
                        payload: data.cart
                    })
                }
            
            }catch(err){
                console.log({msg: 'Item not remove'}, err)
            }
        }
    }
    
    

    export function changeAmount(products, userId){
        try{
            return async (dispatch) => {
                if(userId){
                    const qtyProduct = await axios.put(`${SERVER}/users/cart/${userId}`,{productsInfo: products})
                    console.log("changeamountuser",qtyProduct)
                    return dispatch({
                        type: CHANGE_QTY,
                        payload: qtyProduct.data.cart
                    })
                }
                if(!userId){
                    //const products= JSON.parse(localStorage.getItem("cart"));
                    localStorage.setItem("cart", JSON.stringify(products));
                    return dispatch({
                        type: CHANGE_QTY,
                        payload: products
                    })
                }
            }
        }catch(err) {
            console.log(err)
        }
    }
    
    export function getUsers(){
        return async function(dispatch){
            try{
                const res = await axios.get(`${SERVER}/users`);

                const users = res.data.userinfo;

                return dispatch({
                    type: GET_USERS,
                    payload: users
                })     
            }catch(e){
                
            }
        }
    }

    export function updateUser(id, user){
        return async function(dispatch){
            try{
                console.log("voy a updatear el user " + id)

                const res = await axios.put(`${SERVER}/users/${id}`, user)

                console.log("se actualizó el user",res);

                return dispatch({
                    type: UPDATE_USER,
                    payload: id
                })
            }catch(e){
                console.log("no se pudo actualizar el user", e)
            }
        }
    }

          

    export function update(payload) {
        return {
            type: UPDATE,
            payload
        };
    }
    
    export function clearCart(idUser){
        return async function(dispatch){
            if(idUser)
                await axios.delete(`${SERVER}/users/cart/${idUser}`);
            localStorage.removeItem("cart")
            return dispatch({
                type: CLEAR_CART,
                payload: []
            })
        }
    } 

    export function setOrderProducts(pay, idUser){
        return async function(dispatch){
            const postOrder = await axios.post(`${SERVER}/users/order/${idUser}`, pay)
            clearCart(idUser)
            return dispatch ({
                type: SET_ORDER_PRODUCTS,
                payload: postOrder
            })
        }

    }

    export function getOrderProducts(idUser){
        return async function(dispatch){
            console.log("getorder",idUser)
            const {data} = await axios.get(`${SERVER}/users/orders/${idUser}`)
            console.log(data)
            
            return dispatch ({
                type: SET_ORDER_PRODUCTS,
                payload: {
                    orderId: [],
                    orders: data.orders
                }
            }) /**/
        }

    }
    



    


    
    
    
    
    //   export const getAllFavourites = () => async (dispatch) => {
    //     try {
        //       const { data } = await axios.get(`/users/favs`, { headers });
        //       dispatch({ type: GET_FAVOURITES, payload: data });
    //     } catch (error) {
        //       console.error(error);
    //     }
    //   };
    
    ///////////////////////////////////////////////////////////////////////////////////////////
    
   