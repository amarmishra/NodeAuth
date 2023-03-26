

function refreshCaptcha(req,res){

    let captcha=generateCaptcha(5)
     
    //refresh captcha in the session object
    req.session['captcha']=captcha;

    return res.json({
        success:true,
        data:{
            captcha:captcha      //return captcha of length 5
        }
    })

    
}



//helper functions
const digit=()=> Math.floor(Math.random() * 9) 
const capitalLetter=()=> String.fromCharCode(Math.floor((Math.random() * 25)+65))
const smallLetter=()=>String.fromCharCode(Math.floor((Math.random() * 25)+97))


function generateCaptcha(length){
   
    let newCaptcha=""
    let functions=[digit,capitalLetter,smallLetter]
    
    while(newCaptcha.length<length){
    
    // choose random function index between 0 and 2
        newCaptcha+=functions[Math.floor(Math.random()*2)]()
    
    }

    return newCaptcha
}

module.exports={refreshCaptcha,generateCaptcha}