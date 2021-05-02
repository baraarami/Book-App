'use strict'

const express =require('express');
const superagent=require('superagent');

const app =express();
app.use(express.urlencoded({extend:true}));
app.use(express.static('public'));
const PORT =process.env.PORT || 4000;

app.set('view engine', 'ejs');

app.get('/' , renderHomePage);
app.get ('/searches/new',showForm);
app.get('/searches',creatSearch);

app.get('*' ,(request , response) => 
response.status(404).send ('The Page Does Not Exist'));

app.listen(PORT , ()=> 
console.log (`listining on port:${PORT}`));



function Book(info){
   const placeholderImage= 'https://i.imgur.com/J5LVHEL.jpg';
   this.img=info.imageLinks || placeholderImage;
   this.title=info.title || 'No Title Available ';
   this.auther=info.auther || 'No Auther Available';
   this.descreption=info.descreption || 'No Description Available';
}

function renderHomePage(request ,response){
    response.render('pages/index.ejs');
}

function showForm(request , response){
    response.render('pages/searches/new'); //put in the chrom :localhost:4000//searches/new
}
function creatSearch(request , response){
    let url =`https://www.googleapis.com/books/v1/volumes?q=search+terms`;
    const searchBy=request.body.searchBy;
    const searchValue=request.body.searchby;
    const queryObj={};
    if (searchBy === 'title'){
        queryObj['q']=`+intitle:${searchValue}`;
    }else if (searchBy === 'auther'){
        queryObj['q']=`+intitle:${searchValue}`;

    }

    superagent.get(url).query(queryObj).then(apiResponse =>{
        return apiResponse.body.items.map(bookResult => new Book(bookResult.volumeInfo))
    }).then(results =>{
        response.render('pages/searches/show' , {searchResult : results})
    });
}


