function emailAfterBuy(nombre, idPedido, Country,City, Street,CP, Products){
let variable = `
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmacion de compra</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@300;600;800&display=swap" rel="stylesheet">
        <style>
            *{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Roboto Slab', serif;
            }
            .container {
                background-color: #e6dcbd;
                min-height:100vh;
                height: auto;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 50px 0;
            }
            .center{
                display: block;
                margin: 0 auto;
                text-align: center;
            }
            .descr{
                background-color: #fff;
                width: 60%;
                min-height: 90vh;
                height: auto;
            }
            .logo{
                width: 300px;
                margin-top: 30px;
            }
            .head p{
                margin: 10px 0;   
            }
            .detalle{
                border-top: solid 2px rgb(5, 116, 207);
                border-bottom: solid 2px rgb(5, 116, 207);
                padding: 20px 0;
            }
            .detalle > *{
                margin: 10px 0;
            }
            .list{
                display: flex;
                justify-content: space-evenly;
                align-items: center;
            }
            .list img{
                max-height: 150px;
            }
            .imgproduct, .qty, .price{
                max-width: 20%;
            }
            .nameproduct{
                max-width: 40%;
            }
            .total{
                font-size: 25px;
            }
            @media (max-width: 800px) {
                .descr{
                    width: 85%;
                }
                
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="descr">
                <div class="head center">
                    <img class="logo" src="https://henrecommerce.netlify.app/static/media/logo-ecommerce.3281dcd9.png">
                    <p>Buenas noticias ! Tu pedido ha sido confirmado</p>
                    <p>¡Gracias por comprar con nosotros!</p>
                </div>
                <div class="detalle center" >
                  <h3><strong>ID del pedido</strong> 5fce7e785a1543df9247d673</h3>
                  <h4>Forma de pago</h4>
                  <p>Tarjeta</p>
                  <p>**** **** **** 5563</p>
                  <p><strong>Country</strong> Oaxaca</p>
                  <p><strong>City</strong> Ixtepec</p>
                  <p><strong>Street</strong> Magisterial #21</p>
                  <p><strong>Postal Code</strong> 70000</p>
                </div>
                <div class="products center">`;
                /************INICIO CODIGO QUE IRA DENTRO DEL FOR PARA RECORRER ARREGLO DE PRODUCTOS *************** */
                variable +=`
                    <div class="list">
                        <img src="http://http2.mlstatic.com/D_871760-MLA48113560987_112021-O.jpg" alt="" class="imgproduct">
                        <p class="nameproduct">Alcatel 1v Plus 32 Gb Negro 2 Gb Ram</p>
                        <p class="qty">3</p>
                        <p class="price">$18,767.00</p>
                    </div>`;

                /************FIN CODIGO QUE IRA DENTRO DEL FOR PARA RECORRER ARREGLO DE PRODUCTOS *************** */
                variable +=`
                    <div class="totalamount">
                        <p class="total">
                            <strong>TOTAL: $ 98000.00 ARS</strong>
                        </p>
                    </div>
                </div>

                </div>
            </div>
        </div>
    </body>
</html>`
}
export const sendEmail //exportar emailAfterBuy