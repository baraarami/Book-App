'use strict'

require('dotenv').config();
const { request, response } = require('express');
const express =require('express');
const superagent=require('superagent');

const PORT =process.env.PORT || 4000;
const app =express();

app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({extend:true}));





app.get('/' , (request , response)=>{
    response.render('pages/index');
});


app.get ('/searches/new',(request , response)=>{
    response.render('pages/searches/new'); //put in the chrom :localhost:4000//searches/new
});

app.get('/searches',(request , response)=>{


    let search = request.body.search;
    let type = request.body.type;
    let url=`https://www.googleapis.com/books/v1/volumes?q=${search}:${type}`;


    superagent.get(url)
    .then(booksdata => {
        let bookdata=booksdata.body.items;
        let bookinfo=bookdata.map((item) => {
            return new Book(item);
        });
        response.render('pages/searches/show' , {bookArr : bookinfo});
    })
    .catch(error =>{
        response.render('pages/error');
    });
});


app.get('/hello' , (request , response)=>{
    response.render('pages/index');
});

app.get('*' ,(request , response) => {
    response.render('pages/error');
});


app.listen(PORT , ()=> {
    console.log (`listining on port:${PORT}`);
});



function Book(booksdata){
    this.url=booksdata.volumeInfo.imageLinks;
    if(Object.keys(this.url).length !==0){
        this.url=this.url.thumbnail;
    }else {
        this.url = 'https://i.imgur.com/J5LVHEL.jpg';
    }
   this.title=booksdata.volumeInfo.title || 'No Title Available ';
   this.auther=booksdata.volumeInfo.auther || 'No Auther Available';
   this.descreption=booksdata.volumeInfo.descreption || 'No Description Available';
}







