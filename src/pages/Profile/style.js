import { Upload } from "antd";
import styled from "styled-components";

export const WrapperHeader = styled.h1`
    border-radius: 10px;
    width: 700px;
    background: #DCDCDC;
    color: #000;
    font-size: 30px;
    margin: 4px 0;
    padding: 30px;
    text-align: center;
    margin: 50px auto;
`
export const WrapperContentProfile = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    width: 500px;
    margin: 0 auto;
    padding: 40px;
    border-radius: 10px;
    gap: 35px;
`
export const WrapperLabel = styled.label`
    color: #000;
    font-size: 12px;
    line-height: 30px;
    font-weight: 600;
    width: 70px;
    text-align: left;
`
export const WrapperInput = styled.div`
    display: flex;
    align-items: center;
    gap: 20px;
`
export const WrapperUploadFile = styled(Upload)`
    & .ant-upload.ant-upload-select.ant-upload-select-picture-card {
        width: 60px;
        height: 60px;
        border-radius:50%;
        
    }
    & .ant-upload-list-item-container {
        display: none;
    }
`