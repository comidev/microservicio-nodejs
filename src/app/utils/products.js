module.exports = async (cateId) => [
    {
        name: "Tomate Italiano Metro x kg",
        description: "Venta por kilo. Venta mínima de 250 gramos",
        photoUrl:
            "https://wongfood.vteximg.com.br/arquivos/ids/212566/Tomate-Italiano-x-kg-TOMATE-ITALIANO-1-31319.jpg?v=636568071858100000",
        stock: 100,
        price: 5.8,
        categories: [await cateId("Frutas"), await cateId("Verduras")],
    },
    {
        name: "Plátano de Seda Metro x kg",
        description: "Venta por kilo. Venta mínima de 160 gramos",
        photoUrl:
            "https://wongfood.vteximg.com.br/arquivos/ids/212878/Platano-de-Seda-x-kg-1-169255.jpg?v=636568724681100000",
        stock: 100,
        price: 7.5,
        categories: [await cateId("Desayuno"), await cateId("Frutas")],
    },
    {
        name: "Palta Fuerte Metro x kg",
        description: "Venta por kilo. Venta mínima de 200 gramos",
        photoUrl:
            "https://wongfood.vteximg.com.br/arquivos/ids/525149-1000-1000/71554-1.jpg?v=637812463637870000",
        stock: 100,
        price: 7.19,
        categories: [await cateId("Desayuno"), await cateId("Frutas")],
    },
    {
        name: "Smartphone Samsung Galaxy A03 Core 32GB 2G Black",
        description:
            "Memoria interna de 32GB. Memoria RAM de 2GB. Sistema operativo: Android 11. Pantalla PLS TFT LCD de 6.5''",
        photoUrl:
            "https://wongfood.vteximg.com.br/arquivos/ids/525031/Smartphone-Samsung-Galaxy-A03-Core-32GB-2G-Black-1-270364783.jpg?v=637811721447430000",
        stock: 100,
        price: 379.5,
        categories: [await cateId("Tecnologia")],
    },
    {
        name: "Cámara Smart de Seguridad WiFi Smart",
        description: "Venta por kilo. Venta mínima de 160 gramos",
        photoUrl:
            "https://wongfood.vteximg.com.br/arquivos/ids/485305-1000-1000/C-mara-Smart-de-Seguridad-WiFi-Smart-1-201344977.jpg?v=637701468954630000",
        stock: 100,
        price: 179.9,
        categories: [await cateId("Tecnologia"), await cateId("Cámaras")],
    },
    {
        name: "Audífonos con Micrófono On Ear Turtle Beach Recon 70 Camo Azul",
        description:
            "Dispositivo con micrófono. Botones de operación. Tipo de imán: Neodimio",
        photoUrl:
            "https://wongfood.vteximg.com.br/arquivos/ids/529859-1000-1000/Aud-fonos-Gamer-Turtle-Beach-Recon-70-Blue-Camo-1-165005002.jpg?v=637825871521670000",
        stock: 100,
        price: 179.0,
        categories: [await cateId("Tecnologia"), await cateId("Gamer")],
    },
];
