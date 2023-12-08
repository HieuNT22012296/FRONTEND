import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import { WrapperProducts, WrapperButtonMore, WrapperTypeProduct } from "./style";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import Slider1 from '../../assets/images/Slider1.webp'
import Slider2 from '../../assets/images/Slider2.webp'
import Slider3 from '../../assets/images/Slider3.webp'
import Slider4 from '../../assets/images/Slider4.webp'
import Slider5 from '../../assets/images/Slider5.webp'
import Slider6 from '../../assets/images/Slider6.jfif'
import Slider7 from '../../assets/images/Slider7.jpg'
import Slider8 from '../../assets/images/Slider8.jfif'
import CardComponent from "../../components/CardComponent/CardComponent";
import * as ProductService from "../../services/ProductService"
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import Loading from "../../components/LoadingComponent/Loading";
import { useDebounce } from "../../hooks/useDebounce";
import ContactAndAboutUs from "../../components/ContactAndAboutUs/ContactAndAboutUs";


const HomePage = () => {
    const seacrhProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(seacrhProduct, 1000)
    const [loading, setLoading] = useState(false)
    const [limit, setLimit] = useState(5)
    const [typeProducts, setTypeProducts] = useState([])

    const fetchProductAll = async (context) => {
        const limit = context?.queryKey && context?.queryKey[1]
        const search = context?.queryKey && context?.queryKey[2]
        const res = await ProductService.getAllProduct(search, limit)
        
        return res
    }

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct()
        if(res?.status === 'OK') {
            setTypeProducts(res?.data)
        }
        
    }

    const {isLoading, data: products, isPreviousData} = useQuery(['products', limit, searchDebounce], fetchProductAll, {retry: 3, retryDelay: 1000, keepPreviousData: true})

    useEffect(() => {
        fetchAllTypeProduct()
        
    }, [])

    return (
        <Loading isLoading={isLoading || loading}>
           <Container fluid>
      <Row>
        {typeProducts.map((item) => (
          <Col md={1} key={item}>
            <TypeProduct name={item} />
          </Col>
        ))}
      </Row>
    </Container>

           
                {/* <Col md={9}> */}
                {/* <div className='body' style={{height: 'auto',width: '100%', backgroundColor: '#efefef', }}>
                <div id="container" style={{height: '100%', width: '1270px', margin: '0 auto' }}> */}
                <SliderComponent arrImages={[Slider1, Slider2, Slider3, Slider4, Slider5, Slider6, Slider7, Slider8]} />
                        
                        {/* <WrapperProducts> */}
                            {products?.data?.map((product) => {
                                return (
                                <CardComponent
                                    key={product._id}
                                    id={product._id}
                                    countInStock={product.countInStock}
                                    description={product.description}
                                    image={product.image}
                                    name={product.name}
                                    price={product.price}
                                    rating={product.rating}
                                    type={product.type}
                                    discount={product.discount}
                                    selled={product.selled}
                                />
                                )
                            })}
                        {/* </WrapperProducts> */}
                        <div style={{width:'100%', display:'flex', justifyContent:'center', marginTop: '50px', marginBottom: '200px'}}>
                        <WrapperButtonMore 
                            textButton={isPreviousData ? 'Load more': "Xem Thêm"} 
                            type="outline" 
                            styleButton={{
                                border: `1px solid rgb(11,116,229)`,
                                color: `${products?.total === products?.data?.length ? '#ccc' : 'rgb(11,116,229)'}`, 
                                width: '240px', 
                                height: '38px',
                                borderRadius: '4px'
                        }}
                        
                            disabled={products?.total === products?.data?.length || products?.totalPage === 1}
                            styleTextButton={{ fontWeight: 500, color: products?.total === products?.data?.length && '#fff' }}
                            onClick={() => setLimit((prev) => prev + 5)}
                        />

                        {/* </div> */}
                        {/* </div> */}
                    <ContactAndAboutUs />
                         </div>
                        {/* </Col> */}
                        
                
            {/* </Row> */}
                        {/* </Container> */}
        </Loading>   
    )
}

export default HomePage