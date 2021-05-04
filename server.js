'use strict'

require('dotenv').config();
const express =require('express');
const superagent=require('superagent');






const PORT =process.env.PORT || 4000;
const app =express();

app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({extend:true}));

const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);


app.get('/hello' , (request , response)=>{
    response.render('pages/index');
});
 
app.get('/' , (request , response)=>{
    let SQL=`SELECT * FROM books;`;
    client.query(SQL)
    .then(data =>{
        response.render('pages/index' , {booksdata: data.rows});
    });
});


app.get ('/searches/new',(request , response)=>{
    response.render('pages/searches/new'); //put in the chrom :localhost:4000//searches/new
});

app.get('/searches',(request , response)=>{


    let search = request.body.search;
    let type = request.body.type;
    let url=`https://www.googleapis.com/books/v1/volumes?q=search+${type}:${search}&maxResults=10`;


    superagent.get(url)
    .then(booksdata => {
        let bookdata=booksdata.body.items;
        let bookinfo=bookdata.map((item) => {
            return new Book(item);
        });
        response.render('pages/searches/show' , {bookArr : bookinfo});
    })
    .catch(error =>{
        response.send(error);
    });
});
app.post('/addbook' , (request, response)=>{
    let SQL = 'INSERT INTO books (url , title , auther , description) VALUES ($1 , $2 ,$3 , $4) RETURNING *;';
    let safevalue = [request.body.url , request.body.title , request.body.auther , request.body.descreption];
    client.query(SQL , safevalue).then (result =>{
        response.redirect('/books/${result.row[0].id}');
    }).catch (error =>{
        response.render('pages/error' , {error:error});
    });
});



app.get('/books/:id' , (request , response)=>{
    let bookId=request.params.id;
    let SQL= `SELECT * FROM books WHERE id =$1;`;
    let safevalue=[bookId];
    client.query(SQL , safevalue).then(result=>{
        response.render('pages/detail' , {book :result.rows[0]});
    }).catch(error =>{
        response.render('pages/error' ,{error:err});
    });
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







