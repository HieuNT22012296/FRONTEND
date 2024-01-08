import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader } from './style'
import { WrapperUploadFile } from '../../pages/Profile/style'
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Form, Space } from 'antd'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import Loading from '../LoadingComponent/Loading'
import { useMutationHooks } from '../../hooks/useMutationHook'
import { useQuery } from '@tanstack/react-query'
import * as UserService from '../../services/UserService'
import * as message from '../../components/Message/Message'
import { getBase64 } from '../../utils'
import { useSelector } from 'react-redux'
import ModalComponent from '../ModalComponent/ModalComponent'


const AdminUser = () => {
  
  const [rowSelected, setRowSelected] = useState('')
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
  const user = useSelector((state) => state?.user)
  const searchInput = useRef(null);

  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    email: '',
    phone: '',
    isAdmin: false,
    avatar: '',
    address: ''
  })

  const [form] = Form.useForm()

  // const mutation = useMutationHooks(
  //   (data) => {
  //       const {  
  //       name,
  //       email,
  //       phone,
  //       } = data
  //       const res = UserService.signUpUser({  
  //         name,
  //         email,
  //         phone,
  //       })
  //       return res
  //   }
  // )

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

  const mutationDelete = useMutationHooks(
    (data) => {
      const {  
      id,
      token
      } = data
      const res = UserService.deleteUser(
        id,
        token
      )
      return res
    }
  )

  const mutationDeleteMany = useMutationHooks(
    (data) => {
      const {  
      token,
      ...ids
      } = data
      const res = UserService.deleteManyUser(
        ids,
        token
      )
      return res
    }
  )

  const handleDeleteManyUser = (ids) => {
    mutationDeleteMany.mutate({ids: ids, token: user?.access_token}, {
      onSettled: () => {
        queryUser.refetch()
      }
    })
  }

  const getAllUsers = async () => {
    const res = await UserService.getAllUser(user?.access_token)
    return res
  }

  const fetchGetDetailsUser = async (rowSelected) => {
    const res = await UserService.getDetailsUser(rowSelected)
    if (res?.data) {
      setStateUserDetails({
        name: res?.data.name,
        email: res?.data.email,
        phone: res?.data.phone,
        address: res?.data.address,
        isAdmin: res?.data.isAdmin,
        avatar: res?.data.avatar
      })
    }
    setIsLoadingUpdate(false)
  }

  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsLoadingUpdate(true)
      fetchGetDetailsUser(rowSelected)
    }
  }, [rowSelected, isOpenDrawer])

  const handleDetailsUser = () => {
    setIsOpenDrawer(true)
  }

  // const {data, isLoading, isSuccess, isError} = mutation
  const {data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated} = mutationUpdate
  const {data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted} = mutationDelete
  const {data: dataDeletedMany, isLoading: isLoadingDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany} = mutationDeleteMany

  const queryUser = useQuery({queryKey: ['users'], queryFn: getAllUsers})
  const {isLoading: isLoadingUsers, data: users} = queryUser
  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined style={{color: 'red', fontSize: '20px', cursor: 'pointer'}} onClick={() => setIsModalOpenDelete(true)}/>
        <EditOutlined style={{color: 'blue', fontSize: '20px', cursor: 'pointer'}} onClick={handleDetailsUser}/>
      </div>
    )
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    // setSearchText('');
  };
   const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     <Highlighter
    //       highlightStyle={{
    //         backgroundColor: '#ffc069',
    //         padding: 0,
    //       }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ''}
    //     />
    //   ) : (
    //     text
    //   ),
  });
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('name')
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email.length - b.email.length,
      ...getColumnSearchProps('email')
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      sorter: (a, b) => a.phone - b.phone,
      ...getColumnSearchProps('phone')
    },
    {
      title: 'Address',
      dataIndex: 'address',
      sorter: (a, b) => a.address.length - b.address.length,
      ...getColumnSearchProps('address')
    },
    {
      title: 'Admin',
      dataIndex: 'isAdmin',
      filters: [
        {
          text: 'True',
          value: true,
        },
        {
          text: 'False',
          value: false,
        },
      ],
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction
    },
];
const dataTable = users?.data?.length && users?.data?.map((user) => {
  return {...user, key: user._id, isAdmin: user.isAdmin? 'TRUE' : 'FALSE'}
})

  // useEffect(() => {
  //   if(isSuccess && data?.status === 'OK') {
  //     message.success()
  //     handleCancel()
  //   } else if (isError) {
  //     message.error()
  //   }
  // }, [isSuccess])

  useEffect(() => {
    if(isSuccessUpdated && dataUpdated?.status === 'OK') {
      message.success()
      handleCloseDrawer()
    } else if (isErrorUpdated) {
      message.error()
    }
  }, [isSuccessUpdated])
 
  useEffect(() => {
    if(isSuccessDeleted && dataDeleted?.status === 'OK') {
      message.success()
      handleCancelDelete()
    } else if (isErrorDeleted) {
      message.error()
    }
  }, [isSuccessDeleted])

  useEffect(() => {
    if(isSuccessDeletedMany && dataDeletedMany?.status === 'OK') {
      message.success()
    } else if (isErrorDeletedMany) {
      message.error()
    }
  }, [isSuccessDeletedMany])
  
  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateUserDetails({
      name:'',
      email:'',
      phone:'',
      isAdmin:''
    })
    form.resetFields()
  }

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }

  const handleDeleteUser = () => {
    mutationDelete.mutate({id: rowSelected, token: user?.access_token}, {
      onSettled: () => {
        queryUser.refetch()
      }
    })
  }

  // const handleCancel = () => {
  //   setIsModalOpen(false);
  //   setStateUser({
  //     name:'',
  //     type:'',
  //     price:'',
  //     countInStock:'',
  //     rating:'',
  //     description:'',
  //     image:''
  //   })
  //   form.resetFields()
  // }

  // const onFinish = () => {
  //   mutation.mutate(stateUser, {
  //     onSettled: () => {
  //       queryUser.refetch()
  //     }
  //   })
  // }

  // const handleOnChange = (e) => {
  //   setStateUser({
  //     ...stateUser,
  //     [e.target.name]: e.target.value
  //   })
  // }

  const handleOnChangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  }

  const handleOnChangeAvatarDetails = async ({fileList}) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
    }
    setStateUserDetails({
      ...stateUserDetails,
      avatar: file.preview
    })
  }

  const onUpdateUser = () => {
    mutationUpdate.mutate({id: rowSelected, token: user?.access_token, ...stateUserDetails}, {
      onSettled: () => {
        queryUser.refetch()
      }
    })
  }
  return (
    <div>
      <WrapperHeader>QUẢN LÝ NGƯỜI DÙNG</WrapperHeader>
      {/* <div style={{marginTop: '30px'}}>
        <Button style={{height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed'}} onClick={() => setIsModalOpen(true)}><PlusOutlined style={{fontSize: '35px'}}/></Button>
      </div> */}
      <div style={{marginTop: '30px'}}>
        <TableComponent handleDeleteMany={handleDeleteManyUser} columns={columns} isLoading={isLoadingUsers} data={dataTable} onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              setRowSelected(record._id)
            }
          }
        }}/>
        {/* <ModalComponent forceRender title="Tạo Sản Phẩm" open={isModalOpen} onCancel={handleCancel} footer={null}>
          <Loading isLoading={isLoading}>
            <Form
              name="basic"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              style={{ maxWidth: 600 }}
              onFinish={onFinish}
              autoComplete="on"
              form={form}
            >

              <Form.Item
                label="NAME"
                name="name"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <InputComponent value={stateUser.name} onChange={handleOnChange} name="name"/>
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
              >
                <InputComponent value={stateUser.email} onChange={handleOnChange} name="email"/>
              </Form.Item>

              <Form.Item
                label="Phone"
                name="phone"
                rules={[{ required: true, message: 'Please input your phone!' }]}
              >
                <InputComponent value={stateUser.phone} onChange={handleOnChange} name="phone"/>
              </Form.Item>

              <Form.Item
                label="Admin"
                name="isAdmin"
                rules={[{ required: true, message: 'Please input your count Admin!' }]}
              >
                <InputComponent value={stateUser.isAdmin} onChange={handleOnChange} name="isAdmin"/>
              </Form.Item>
              <Form.Item
                label="IMAGE"
                name="image"
                rules={[{ required: true, message: 'Please input your image!' }]}
              >
                <WrapperUploadFile onChange={handleOnChangeAvatar} maxCount={1}>
                  <Button style={{marginLeft: '100px', display: 'flex'}}>Chọn ảnh</Button>
                  {stateUser?.image && (
                    <img src={stateUser?.image} style={{
                        height: '60px',
                        width: '60px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        marginLeft: '115px',
                        marginTop: '10px'
        
                    }} alt="avatar"/>
                  )}
                </WrapperUploadFile>
              </Form.Item>
              
              <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Loading>
        </ModalComponent> */}
        <DrawerComponent title='Chi Tiết Tài Khoản' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width='50%'>
        <Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
            <Form
              name="basic"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              style={{ maxWidth: 600 }}
              onFinish={onUpdateUser}
              autoComplete="off"
              form={form}
            >

              <Form.Item
                label="NAME"
                name="name"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <InputComponent value={stateUserDetails.name} onChange={handleOnChangeDetails} name="name"/>
              </Form.Item>

              <Form.Item
                label="EMAIL"
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
              >
                <InputComponent value={stateUserDetails.email} onChange={handleOnChangeDetails} name="email"/>
              </Form.Item>

              <Form.Item
                label="PHONE"
                name="phone"
                rules={[{ required: true, message: 'Please input your phone!' }]}
              >
                <InputComponent value={stateUserDetails.phone} onChange={handleOnChangeDetails} name="phone"/>
              </Form.Item>

              <Form.Item
                label="ADDRESS"
                name="address"
                rules={[{ required: true, message: 'Please input your address!' }]}
              >
                <InputComponent value={stateUserDetails.address} onChange={handleOnChangeDetails} name="address"/>
              </Form.Item>

              <Form.Item
                label="ADMIN"
                name="isAdmin"
                rules={[{ required: true, message: 'Please input your count InStock!' }]}
              >
                <InputComponent value={stateUserDetails.isAdmin} onChange={handleOnChangeDetails} name="isAdmin"/>
              </Form.Item>

              <Form.Item
                label="AVATAR"
                name="avatar"
                rules={[{ required: true, message: 'Please input your avatar!' }]}
              >
                <WrapperUploadFile onChange={handleOnChangeAvatarDetails} maxCount={1}>
                  <Button style={{marginLeft: '170px', marginBottom: '10px', display: 'flex'}}>Chọn ảnh</Button>
                  {stateUserDetails?.avatar && (
                    <img src={stateUserDetails?.avatar} style={{
                        height: '60px',
                        width: '60px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        marginLeft: '185px',
                        marginTop: '10px'
        
                    }} alt="avatar"/>
                  )}
                </WrapperUploadFile>
              </Form.Item>
              

              <Form.Item wrapperCol={{ offset: 13, span: 16 }}>
                <Button style={{margin: '5px'}} type="primary" htmlType="submit">
                  Apply
                </Button>
              </Form.Item>
            </Form>
          </Loading>
        </DrawerComponent>
        <ModalComponent forceRender title="Xóa Tài Khoản" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser}>
          <Loading isLoading={isLoadingDeleted}>
            <div>Bạn Có Chắc Xóa Tài Khoản Này Không?</div>
          </Loading>
        </ModalComponent>
      </div>
    </div>
  )
}

export default AdminUser
