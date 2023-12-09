import {Checkbox, Form, Radio } from 'antd'
import React, { useEffect, useMemo, useState } from 'react'
import { Lable, WrapperInfo, WrapperLeft, WrapperRadio, WrapperRight, WrapperTotal } from './style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as UserService from '../../services/UserService'
import * as OrderService from '../../services/OrderService'
import Loading from '../../components/LoadingComponent/Loading';
import { updateUser } from '../../redux/slides/userSlide';
import { useNavigate } from 'react-router-dom';
import * as message from '../../components/Message/Message';
import { removeAllOrderProduct } from '../../redux/slides/orderSlide';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import * as PaymentService from '../../services/PaymentService'


const PaymentPage = () => {
    const order = useSelector((state) => state.order)
    const user = useSelector((state) => state.user)

    const [delivery, setDelivery] = useState('fast')
    const [payment, setPayment] = useState('later_money')
    const navigate = useNavigate()
    const [sdkReady, setSdkReady] = useState(false)
    const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false)
    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        phone: '',
        city: '',
        address: ''
    })

    const [form] = Form.useForm()

    const dispatch = useDispatch()

    useEffect(() => {
        form.setFieldsValue(stateUserDetails)
      }, [form, stateUserDetails])    

    useEffect(() => {
        if(isOpenModalUpdateInfo) {
            setStateUserDetails({
                city: user?.city,
                name: user?.name,
                address: user?.address,
                phone: user?.phone
            })
        }
    }, [isOpenModalUpdateInfo])

    const handleChangeAddress = () => {
        setIsOpenModalUpdateInfo(true)
    }

    const priceMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            return total + ((cur.price * cur.amount))
        }, 0)
        return result
    }, [order])

    const priceDiscountMemo = useMemo(() => {
        const result = order?.orderItemsSelected?.reduce((total, cur) => {
            const totalDiscount = cur.discount ? cur.discount : 0
            return total + (priceMemo * (totalDiscount * cur.amount) / 100)
        }, 0)
        if(Number(result)) {
            return result
        }
        return 0
    }, [order])

    const deliveryPriceMemo = useMemo(() => {
        if(priceMemo > 200000) {
            return 10000
        }else if(priceMemo === 0) {
            return 0
        }else {
            return 20000
        }
    }, [priceMemo])

    const totalPriceMemo = useMemo(() => {
        return Number(priceMemo) - Number(priceDiscountMemo) + Number(deliveryPriceMemo)
    }, [priceMemo, priceDiscountMemo, deliveryPriceMemo])
    
    const handleAddOrder = () => {
        if(user?.access_token && order?.orderItemsSelected && user?.name
            && user?.address && user?.phone && user?.city && priceMemo && user?.id){
               // eslint-disable-next-line no-unused-expressions
                mutationAddOrder.mutate({
                    token: user?.access_token,
                    orderItems: order?.orderItemsSelected,
                    fullName: user?.name,
                    address: user?.address, 
                    phone: user?.phone, 
                    city: user?.city,
                    paymentMethod: payment,
                    itemsPrice: priceMemo,
                    shippingPrice: deliveryPriceMemo,
                    totalPrice: totalPriceMemo,
                    user: user?.id,
                    email: user?.email,
                    id: user?.id
                })
            }
        
    }

    const handleCancleUpdate = () => {
        setStateUserDetails({
            name:'',
            email:'',
            phone:'',
            isAdmin:''
        })
    form.resetFields()
        setIsOpenModalUpdateInfo(false)
    }

    const mutationUpdate = useMutationHooks(
        (data) => {
          const {  
          id,
          token,
          ...rests
           } = data
          const res = UserService.updateUser(
            id,
            {...rests},
            token
          )
          return res
        }
    )

    const mutationAddOrder = useMutationHooks(
        (data) => {
          const {
            id,  
          token,
          ...rests
           } = data
          const res = OrderService.createOrder(
            id,
            {...rests},
            token
          )
          return res
        }
    )

    const {isLoading, data} = mutationUpdate

    const {data: dataAddOrder, isLoading: isLoadingAddOrder, isSuccess, isError} = mutationAddOrder

    useEffect(() => {
        const arrOrderedName = []
        const arrOrderedProductId = []

        if(isSuccess && dataAddOrder?.status === 'OK') {
           
            order?.orderItemsSelected?.forEach(element => {
                arrOrderedProductId.push(element.product)
            })

            dispatch(removeAllOrderProduct({listChecked: arrOrderedProductId}))
            message.success('Đặt hàng thành công')
            navigate('/ordersuccess', {  
                state: {
                    delivery,
                    payment,
                    orders: order?.orderItemsSelected,
                    totalPriceMemo: totalPriceMemo
                }
            })
        }else if(dataAddOrder?.status === 'ERR'){

            order?.orderItemsSelected?.forEach(element => {
                if(element?.countInStock <= 311)
                arrOrderedName.push(element.name)
            })

            message.error(`Sản phẩm ${arrOrderedName.join(', ')} đã hết hàng`)
        }else if (isError) {
          message.error()
        }
      }, [isSuccess, isError])
      
    const handleUpdateInforUser = () => {
        const { name, phone, address, city } = stateUserDetails
        if(name && phone && address && city) {
            mutationUpdate.mutate({id: user?.id, token: user?.access_token, ...stateUserDetails}, {
                onSuccess: () => {
                    dispatch(updateUser(name, address, phone, city))
                    setIsOpenModalUpdateInfo(false)
                }
            })
        }
    }

    const handleOnChangeDetails = (e) => {
        setStateUserDetails({
          ...stateUserDetails,
          [e.target.name]: e.target.value
        })
    }

    const handleDelivery = (e) => {
        setDelivery(e.target.value)
    }

    const handlePayment = (e) => {
        setPayment(e.target.value)
    }

    const addPaymentScript = async () => {
        const {data} = await PaymentService.getConfig()
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = `https://www.paypal.com/sdk/js?client-id=${data}`
        script.async = true
        script.onload = () => {
            setSdkReady(true)
        }
        document.body.appendChild(script)
    }


    const onApprove = async () => {
        const data = {
          id: user?.id,
          token: user?.access_token,
          orderItems: order?.orderItemsSelected,
          fullName: user?.name,
          address: user?.address,
          phone: user?.phone,
          city: user?.city,
          paymentMethod: payment,
          itemsPrice: priceMemo,
          shippingPrice: deliveryPriceMemo,
          totalPrice: totalPriceMemo,
          user: user?.id,
          isPaid: true,
          email: user?.email,
        };
        // Use the mutate function provided by useMutation
        const result = await mutationAddOrder.mutateAsync(data);
    
        // Assuming that the result contains the order ID
        return result.orderId; // Replace with the actual property in the result
      };


    useEffect(() => {
        if(!window.paypal) {
            addPaymentScript()
        }else {
            setSdkReady(true)
        }
    }, [])

    return (
        <div style={{background: '#f5f5fa', with: '100%', height: '100vh'}}>
            <Loading isLoading={isLoadingAddOrder}>
                <div style={{height: '100%', width: '1270px', margin: '0 auto'}}>
                    <h3 style={{fontWeight: 'bold'}}>Thanh Toán</h3>
                    <div style={{ display: 'flex', justifyContent: 'center'}}>
                        <WrapperLeft>
                            <WrapperInfo>
                                <div>
                                    <Lable>Chọn phương thức giao hàng</Lable>
                                    <WrapperRadio onChange={handleDelivery} value={delivery}> 
                                        <Radio  value="fast"><span style={{color: '#ea8500', fontWeight: 'bold'}}>FAST</span> Giao hàng tiết kiệm</Radio>
                                        <Radio  value="gojek"><span style={{color: '#ea8500', fontWeight: 'bold'}}>GO_JEK</span> Giao hàng tiết kiệm</Radio>
                                    </WrapperRadio>
                                </div>
                            </WrapperInfo>
                            <WrapperInfo>
                                <div>
                                    <Lable>Chọn phương thức thanh toán</Lable>
                                    <WrapperRadio onChange={handlePayment} value={payment}> 
                                        <Radio value="later_money"> Thanh toán tiền mặt khi nhận hàng</Radio>
                                        <Radio value="paypal"> Thanh toán tiền bằng paypal</Radio>
                                    </WrapperRadio>
                                </div>
                            </WrapperInfo>
                            
                        </WrapperLeft>
                        <WrapperRight>
                            <div style={{width: '100%'}}>
                                <WrapperInfo>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span>Địa chỉ: </span>
                                        <span style={{fontWeight: 'bold'}}>{ `${user?.address} ${user?.city}`} </span>
                                        <span onClick={handleChangeAddress} style={{color: '#9255FD', cursor:'pointer', fontWeight: 'bold'}}>Thay đổi</span>
                                    </div>
                                </WrapperInfo> 
                            <WrapperInfo>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <span>Giá Sản Phẩm</span>
                                <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(priceMemo)}</span>
                                </div>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <span>Giảm giá</span>
                                <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(priceDiscountMemo)}</span>
                                </div>
                                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                <span>Phí giao hàng</span>
                                <span style={{color: '#000', fontSize: '14px', fontWeight: 'bold'}}>{convertPrice(deliveryPriceMemo)}</span>
                                </div>
                            </WrapperInfo>
                            <WrapperTotal>
                                <span>Tổng tiền</span>
                                <span style={{display:'flex', flexDirection: 'column'}}>
                                <span style={{color: 'rgb(254, 56, 52)', fontSize: '24px', fontWeight: 'bold'}}>{convertPrice(totalPriceMemo)}</span>
                                <span style={{color: '#000', fontSize: '11px'}}>(Đã bao gồm VAT nếu có)</span>
                                </span>
                            </WrapperTotal>
                            </div>
                            {payment === 'paypal' && sdkReady ? (
                                <div style={{width: '320px'}}>
                                    <PayPalScriptProvider >
                                        <PayPalButtons
                                            amount={Math.round(totalPriceMemo / 10000000)}
                                            // createOrder={createOrder}
                                            onApprove={onApprove}
                                            onError={() => {
                                                alert('Error')
                                              }}
                                        />
                                    </PayPalScriptProvider>
                                </div>
                                 
                            ) : (
                                <ButtonComponent
                                    onClick={() => handleAddOrder()}
                                    size={40}
                                    styleButton={{
                                        background: 'rgb(255, 57, 69)',
                                        height: '48px',
                                        width: '320px',
                                        border: 'none',
                                        borderRadius: '4px',
                                    }}
                                    textButton={'Đặt hàng'}
                                    styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}>
                                </ButtonComponent>
                            )}
                           
                        </WrapperRight>
                    </div>
                </div>
                <ModalComponent title="Cập nhật thông tin giao hàng" open={isOpenModalUpdateInfo} onCancel={handleCancleUpdate} onOk={handleUpdateInforUser}>
                    <Loading isLoading={isLoading}>
                    <Form
                        name="basic"
                        labelCol={{ span: 4 }}
                        wrapperCol={{ span: 20 }}
                        // onFinish={onUpdateUser}
                        autoComplete="on"
                        form={form}
                    >
                        <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input your name!' }]}
                        >
                        <InputComponent value={stateUserDetails['name']} onChange={handleOnChangeDetails} name="name" />
                        </Form.Item>
                        <Form.Item
                        label="City"
                        name="city"
                        rules={[{ required: true, message: 'Please input your city!' }]}
                        >
                        <InputComponent value={stateUserDetails['city']} onChange={handleOnChangeDetails} name="city" />
                        </Form.Item>
                        <Form.Item
                        label="Phone"
                        name="phone"
                        rules={[{ required: true, message: 'Please input your  phone!' }]}
                        >
                        <InputComponent value={stateUserDetails.phone} onChange={handleOnChangeDetails} name="phone" />
                        </Form.Item>

                        <Form.Item
                        label="Address"
                        name="address"
                        rules={[{ required: true, message: 'Please input your  address!' }]}
                        >
                        <InputComponent value={stateUserDetails.address} onChange={handleOnChangeDetails} name="address" />
                        </Form.Item>
                    </Form>
                    </Loading>
                </ModalComponent>
            </Loading>
        </div>
    )
}

export default PaymentPage