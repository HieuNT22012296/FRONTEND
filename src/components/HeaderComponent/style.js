import { Row } from "antd";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const WrapperHeader = styled(Row)`
    background-color: var(--primary-color);
    align-items: center;
    gap: 16px;
    width: 1270px;
    padding: 10px 0;
`
export const WrapperTextHeader = styled(Link)`
    font-size: 18px;
    color: #fff;
    font-weight: bold;
    margin-left: 50px;
    &:hover {
        font-size: 18px;
        color: #fff;
}
`

export const WrapperHeaderAccount = styled.div`
    display: flex;
    align-items: center;
    color: #fff;
    gap: 10px;
    max-width: 200px;
`
export const WrapperTextHeaderSmall = styled.span`
    font-size: 15px;
    color: #fff;
    margin-left: 5px;
    white-space:nowrap;
`
export const WrapperContentPopup = styled.p`
    cursor: pointer;
    &:hover {
        color: #186c91;
    }
`
