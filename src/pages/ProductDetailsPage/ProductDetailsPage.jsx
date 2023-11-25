import React from "react";
import ProductDetailsComponent from "../../components/ProductDetailsComponent/ProductDetailsComponent";
import { useNavigate, useParams } from "react-router-dom";
import { HomeOutlined } from '@ant-design/icons'


const ProductDetailsPage = () =>{
    const {id} = useParams()
    const navigate = useNavigate()
    return(
        <div style={{ padding: '10px 120px',background: '#efefef' }}>
        <h5>
            <span style={{ color: 'red', borderRadius: '5px', fontSize: '15px', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => {navigate('/')}}>
            <HomeOutlined /> Trang Chủ
            </span> 
            <span style={{marginLeft: '400px', fontSize: '30px'}}>
                Chi Tiết Sản Phẩm
            </span> 
        </h5>
        
            
        
        <ProductDetailsComponent idProduct={id}/>
        </div>
    )
}

export default ProductDetailsPage