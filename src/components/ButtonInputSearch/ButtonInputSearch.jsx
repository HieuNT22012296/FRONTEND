import { Button } from 'antd';
import React from 'react';
import {SearchOutlined} from '@ant-design/icons'
import InputComponent from '../InputComponent/InputComponent';
import ButtonComponent from '../ButtonComponent/ButtonComponent';

const ButtonInputSearch = (props) => {
    const { 
            size, placeholder, textButton,
            bordered, backgroundColorInput = '#fff',
            backgroundColorButton= '#009966',
            colorButton= '#fff'} = props
    return (
        <div style={{display: 'flex'}}>
            <InputComponent 
            size={size}
            placeholder={placeholder} 
            bordered={bordered} 
            style={{backgroundColor: backgroundColorInput }}
            {...props} />
            <ButtonComponent
                size={size} 
                styleButton={{ background: backgroundColorButton, border: !bordered && 'none'}}
                textButton={textButton}
                styleTextButton={{color: colorButton}}
                icon={<SearchOutlined  color={colorButton} style={{color: '#fff'}}/>}
        >{textButton}</ButtonComponent>
        </div>
    )
}

export default ButtonInputSearch 