import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { Container, Row, Col } from 'react-bootstrap';


export const CustomContainer = styled(Container)`
  
`;

export const CustomRowType = styled(Row)`
  
`;

export const CustomColType = styled(Col)`
    @media (max-width: 768px) {
        .container-wrapper {
        overflow-y: auto;
        }
        .text-center {
            flex-wrap: nowrap;
        }
    
    }
`;

export const CustomRowSlider = styled(Row)`
  
`;

export const CustomRowProduct = styled(Row)`
  
`;

export const CustomColProduct = styled(Col)`
    margin: 20px 0; /* Khoảng cách giữa các sản phẩm */
    justify-content: space-around; /* Căn các sản phẩm giữa khoảng trống */
`;


export const WrapperTypeProduct = styled.div`
    display: flex;
    align-items: center;
    gap: 24px;
    justify-content: flex-start;
    height: 44px;
`
export const WrapperButtonMore = styled(ButtonComponent)`
    &:hover {
    color: #fff;
    background: rgb(13, 92, 182);
    span {
        color: #fff;
    }
    width: 100%;
    color: #9255FD;
    text-align: center;
    cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointers'}
`
export const WrapperProducts = styled.div`
    display: flex;
    gap: 14px;
    margin-top:20px;
    flex-wrap: wrap;
`