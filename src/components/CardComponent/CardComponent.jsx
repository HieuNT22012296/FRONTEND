import React from "react";
import { StarFilled } from '@ant-design/icons';
import { WrapperCardStyle, StyleNameProduct, WrapperReportText,WrapperPriceText,WrapperDiscountText, WrapperStyleTextSell } from "./style"; 
import logo from '../../assets/images/logo.png'
import { useNavigate } from "react-router-dom";
import { convertPrice } from "../../utils";
import { Col, Container, Row } from "react-bootstrap";


const CardComponent = (props) => {
  const {id, countInStock, description, image, name, price, rating, type, discount, selled} = props
  const navigate = useNavigate()
  const handleDetailsProduct = () => {
    navigate(`/product-details/${id}`)
  }

  return (

    <Col style={{alignItems:'center'}}xs={6} xl={2}>
      <WrapperCardStyle 
        hoverable
        headStyle={{ width: '200px', height: '200px' }}
        style={{ width: 185 , marginBottom: 25}}
        bodyStyle={{ padding: '20px' }}
        cover={<img alt="example" src={image} />}
        onClick={() => handleDetailsProduct(id)}
      >
        <img 
          src={logo} alt="logo"
          style={{
          width: '68px',
          height: '14px',
          position: 'absolute',
          top: -1,
          left: -1,
          borderTopLeftRadius: '3px'}} />
        <StyleNameProduct>{name}</StyleNameProduct>
        <WrapperReportText>
          <span style={{ marginRight: '4px' }}>
            <span>{rating}</span><StarFilled style={{fontSize: '12px', color: 'rgb(253, 216, 54'}} />
          </span>
          <WrapperStyleTextSell>| Đã bán {selled || 1000 }+</WrapperStyleTextSell>
        </WrapperReportText>
        <WrapperPriceText>
          <span style={{marginRight: '8px'}}>{convertPrice(price)}</span>
          <WrapperDiscountText>- {discount || 5} %</WrapperDiscountText>
        </WrapperPriceText>
      </WrapperCardStyle >
    </Col>
    
  )
}


export default CardComponent;
