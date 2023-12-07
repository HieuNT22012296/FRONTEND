import styled from "styled-components";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
// import 'bootstrap/dist/css/bootstrap.min.css';

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