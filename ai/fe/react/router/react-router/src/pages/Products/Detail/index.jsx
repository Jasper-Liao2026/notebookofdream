import{
    useParams
}from 'react-router-dom';

const ProductDetail =()=>{
    const {productId}= useParams();
    return(
        <>
        <h3>产品详情{ProductId}</h3>
        </>
    )
}
export default ProductDetail