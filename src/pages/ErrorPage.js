import '../App.css';
import { Navigate, useNavigate } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import {useTranslation } from 'react-i18next';
function ErrorPage(){
    const { t } = useTranslation();
    document.title=t("not_found");
    localStorage.setItem('enter', 'false');
    const navigate = useNavigate(); 
    const goBack = () => {
        navigate('/');
        document.title='Polyvox';
    };
    return(
        // <div className='Error'>
        <Container 
        sx={{display:'flex',flexDirection:'column', justifyContent:'center',alignItems:'center', userSelect: 'none'}}>
            
        {/* <Typography variant='h2'>Error 404!</Typography>  */}
        <Typography  variant='h2'>{t("not_found")} :(</Typography>
        <br/>
        {/* <img 
        style={{display:'block',width:'200px'}}
        // className='img-error'
        draggable={false}
        // src='https://media2.giphy.com/media/gKH0yJ21ia3chGqPxu/giphy.gif'
        src='https://cdn-icons-png.flaticon.com/512/103/103085.png'
        // src='https://media2.giphy.com/media/vpbwRrGSizD5gt0MbP/giphy.gif?cid=6c09b952o1q11gtsi5thsesw0whtm6c7fxsgx7ovdfs2jx22&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=s'
        />*/}
        <Typography variant='h1'>404</Typography>
        <br/>
        {/* <Typography variant='h6'style={{textDecoration:'underline', cursor:'pointer'}} onClick={goBack}>Go to home page</Typography> */}
  <button style={{border:'none'}} onClick={goBack}>{t("visit_home_page")}</button>

        </Container>
        
    )
}

export default ErrorPage;