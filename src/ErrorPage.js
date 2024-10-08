import './App.css';
import { Navigate, useNavigate } from 'react-router-dom';
function ErrorPage(){
    localStorage.setItem('enter', 'false');
    const navigate = useNavigate(); 
    const goBack = () => {
        navigate('/');
    };
    return(
        <div className='Error'>
            
        <h1>Error 404!</h1>
        <h4>Page not found</h4>
        <img 
        className='img-error'
        draggable={false}
        // src='https://media2.giphy.com/media/gKH0yJ21ia3chGqPxu/giphy.gif'
        // src='https://media.tenor.com/F0z2mTEa7aIAAAAi/interminable-rooms-a-404.gif'
        src='https://media2.giphy.com/media/vpbwRrGSizD5gt0MbP/giphy.gif?cid=6c09b952o1q11gtsi5thsesw0whtm6c7fxsgx7ovdfs2jx22&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=s'
        />
        <button className='go-back' onClick={goBack}>Go to home page</button>
        </div>
    )
}

export default ErrorPage;