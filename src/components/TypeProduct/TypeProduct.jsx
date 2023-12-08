import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CustomCol } from './style'

const TypeProduct = ({ name }) => {
  const navigate = useNavigate()
  const handleNavigatetype = (type) => {
    navigate(`/product/${type.normalize('NFD').replace(/[\u0300-\u036f]/g, '')?.replace(/ /g, '_')}`, {state: type})
  }
  return (
    <CustomCol xs={12} lg={11} onClick={() => handleNavigatetype(name)}>{name}</CustomCol>
  )
}

export default TypeProduct