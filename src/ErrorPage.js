import './App.css';
function ErrorPage(){
    return(
        <div className='Error'>
        <h1>Error 404!</h1>
        <img 
        className='img-error'
        draggable={false}
        // src='https://media2.giphy.com/media/gKH0yJ21ia3chGqPxu/giphy.gif'
        src='https://media.tenor.com/F0z2mTEa7aIAAAAi/interminable-rooms-a-404.gif'
        />
        </div>
    )
}

export default ErrorPage;