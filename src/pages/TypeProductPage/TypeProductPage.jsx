import React, { useEffect, useState } from "react";
import NavBarComponent from '../../components/NavbarComponent/NavbarComponent'
import CardComponent from '../../components/CardComponent/CardComponent'
import { WrapperNavbar, WrapperProducts } from './style'
import * as ProductService from "../../services/ProductService"

import { Col, Pagination, Row } from "antd";
import { useLocation } from "react-router-dom";
import Loading from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hooks/useDebounce";


const TypeProductPage =() =>{
    const seacrhProduct = useSelector((state) => state?.product?.search)
    const searchDebounce = useDebounce(seacrhProduct, 1000)
    const {state} = useLocation()
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(false)
    const [panigation, setPanigation] = useState({
        page: 0,
        limit: 10,
        total: 1,
    })

    const fetchProductType  = async (type, page, limit) => {
        setLoading(true)
        const res = await ProductService.getProductType(type, page, limit)
        if(res?.status == 'OK') {
            setLoading(false)
            setProducts(res?.data)
            setPanigation({...panigation, total: res?.totalPage})
        }else {
            setLoading(false)
        }
    }

    useEffect(() => {
        if(state) {
            fetchProductType(state, panigation.page, panigation.limit)
        } 
    }, [state, panigation.page, panigation.limit])

    const onChange = (current, pageSize) => {
        setPanigation({...panigation, page: current - 1, limit: pageSize})
    }
return (
    <Loading isLoading={loading}>
        <div style={{ width: '100%', background:'#efefef', height: 'calc(100vh - 64px)'}}>
            <div style={{ width: '1270px', margin:'0 auto', height: '100%'}}>
                <Row style={{ flexWrap: 'nowrap', paddingTop: '10px',height: 'calc(100% - 20px)' }}>
                    <WrapperNavbar span={4} >
                        <NavBarComponent />
                    </WrapperNavbar>
                    <Col span={20} style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
                        <WrapperProducts>
                            {products?.filter((prod) => {
                                if(searchDebounce === '') {
                                    return prod
                                }else if(prod?.name?.toLowerCase()?.includes(searchDebounce?.toLowerCase())) {
                                    return prod
                                }
                            })?.map((product) => {
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
                        </WrapperProducts>
                    <Pagination defaultCurrent={panigation.page + 1} total={panigation?.total} onChange={onChange} style={{textAlign:'center', margin: '10px'}} />
                    </Col>
                </Row>
            </div>
                    
        </div>
    </Loading>
)
}

export default TypeProductPage