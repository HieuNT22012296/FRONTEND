import React, { Component, Fragment, useEffect, useState } from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import DefaultComponent from './components/DefaultComponent/DefautComponent'
import { routes } from './routes'
import { useQuery } from '@tanstack/react-query'
import { isJsonString } from './utils'
import * as UserService from './services/UserService'
import jwt_decode from "jwt-decode";
import { useDispatch, useSelector } from "react-redux";
import { resetUser, updateUser } from './redux/slides/userSlide'
import axios from 'axios'
import Loading from './components/LoadingComponent/Loading'
import HomePage from './pages/HomePage/HomePage'



function App() {

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false)
  const user = useSelector((state) => state.user)

  useEffect(() => {
    setIsLoading(true)
    const { decoded, storageData } = handleDecoded()
    if (decoded?.id) {
      handleGetDetailsUser(decoded?.id, storageData)
    } 
    setIsLoading(false)
  }, [])

  // useEffect(() => {
  //   setIsLoading(true);
  //   const { decoded, storageData } = handleDecoded();
  
  //   if (decoded?.id) {
  //     // Check if the token is not expired before making the API call
  //     const currentTime = new Date();
  //     if (decoded.exp > currentTime.getTime() / 1000) {
  //       handleGetDetailsUser(decoded.id, storageData);
  //     }
  //   } else {
  //     // Handle the case when the user is not authenticated
  //     // You can redirect to a login page or perform other actions as needed.
  //     // For example, you can use the 'useNavigate' hook from react-router-dom to navigate to a login page.
  //   }
    
  //   setIsLoading(false);
  // }, []);
  
  const handleDecoded = () => {
    let storageData = localStorage.getItem('access_token')
    let decoded = {}
    if(storageData && isJsonString(storageData)) {
      storageData = JSON.parse(storageData)   
      decoded = jwt_decode(storageData)
    }
    return { decoded, storageData}
  }

  UserService.axiosJWT.interceptors.request.use(async (config) => {
    // Do something before request is sent
    const currentTime = new Date()
    const { decoded } = handleDecoded()
    let storageRefreshToken = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storageRefreshToken)
    const decodedRefreshToken = jwt_decode(refreshToken)
    if(decoded?.exp < currentTime.getTime() / 1000) {
      if(decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
        const data = await UserService.refreshToken(refreshToken)
        config.headers['token'] = `Bearer ${data?.access_token}`
      }else {
        dispatch(resetUser())
      }  
    }
    return config;
  }, (err) => {
    return Promise.reject(err);
  })

  const handleGetDetailsUser = async (id, token) => {
    let storageRefreshToken = localStorage.getItem('refresh_token')
    const refreshToken = JSON.parse(storageRefreshToken)
    const res = await UserService.getDetailsUser(id, token)
    dispatch(updateUser({...res?.data, access_token: token, refreshToken: refreshToken}))
  }

  
  return (
    <div>
      <Loading isLoading={isLoading}>
        <Router>
            <Routes>
              {routes.map((route) => {
                const Page = route.page
                const isCheckAuth = !route.isPrivate || user.isAdmin
                const Layout = route.isShowHeader ? DefaultComponent : Fragment
                return (
                  <Route key={route.path} path={isCheckAuth ? route.path: ''} element={
                    <Layout>
                      <Page />
                    </Layout>
                  } />
                )
              })}
            </Routes>
        </Router>
      </Loading>
    </div>
  )
  
}
export default App