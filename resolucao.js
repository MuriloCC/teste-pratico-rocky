const fs = require('fs');
const express = require('express');
const axios = require('axios');

const app = express();

app.get('/', async (req, res) => {
    try{
        const { data } = await axios('https://gitlab.com/-/snippets/1818996/raw/master/broken-database.json');
        
        data.forEach(product =>{
            product.name = fixName(product.name);
            product.price = fixPrice(product.price);
            product.quantity = fixQuantity(product.quantity);
        });
        dataSorting(data);
        totalPriceByCategory(data);

        fs.writeFile ("saida.json", JSON.stringify(data), function(err){
            if (err) throw err;
        });

        return res.json(data);

    } catch (error){
        console.log(error);
        throw error;
    }
});

function fixName(name){
    return name = name
                .replace(/æ/gi, 'a')
                .replace(/ø/gi, 'o')
                .replace(/ß/gi, 'b')
                .replace(/¢/gi, 'c');  
}

function fixPrice(price){
    return parseFloat(price);
}

function fixQuantity(quantity){
    if(!quantity)
        quantity = 0;

    return quantity;
}

function dataSorting(data){
    data.sort((a, b) => {
        let categoryA = a.category.toLowerCase(),
            categoryB = b.category.toLowerCase();
        let idA = a.id,
            idB = b.id;
        
        return categoryA > categoryB ? 1 : categoryA < categoryB ? -1: 0 || idA > idB ? 1 : idA < idB ? -1: 0;
    });
}

function totalPriceByCategory(data){
    let total = {};

    data.forEach(product => {
        total[product.category] = 0;
        total[product.category] += product.quantity * product.price; 
    });

    console.log(total);  
}
app.listen(8000);