
const refreshCaptchaBtn=document.getElementById('refresh-captcha-button');

refreshCaptchaBtn.addEventListener('click',async (e)=>{
    e.preventDefault()
    console.log("Refresh captcha button clicked")
    const response=await fetch('/captcha/refresh',{method:'GET'})
    const {data,success}=await response.json()

    if(success){
        document.getElementById('captcha-value').innerHTML=data.captcha
    }
})