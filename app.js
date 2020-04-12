const express=require('express');
const app=express();
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
app.set('views','./views');
app.set('view engine','ejs');
app.use(express.urlencoded({extended:false}));
app.listen(30);

async function fn(html,req,res)
{
   const writeStream = fs.createWriteStream('./files/AmazonPrices.csv');

   writeStream.write(`S.No,Product Name, Amazon Price($) \n\n`);
    const $ = cheerio.load(html);
   var i=0,j=0,average=0;
        for(i=0;i<20;i++)
       {
       var a="[data-index='"+i+"']";
       const productname=$(a).find('.a-size-base-plus').text().replace(/,/g, '-');
   const price = $(a).find('.a-offscreen').text().replace("$", "");
   const prodctprice= parseFloat(price);
   
   if(!isNaN(prodctprice))
   {
       j++;
       writeStream.write(`${j}, ${productname}, ${prodctprice} \n`);
       
       average+=prodctprice;
   }
  
}

writeStream.write(`\n --------------,Average Price, ${average/j}, ------------- \n`);

setTimeout(function(){
const file = `${__dirname}/files/AmazonPrices.csv`;

res.download(file);

},5000);
}


app.get('/',function(req,res){
    res.render('home');
});


app.post('/',function(req,res){

const url='https://www.amazon.com/s?k='+req.body.product+'&ref=nb_sb_noss';
 request(url, (error, response, html) => {
  if (error || response.statusCode != 200) {
      
      throw error;
  }
       fn(html,req,res);
});   
})
