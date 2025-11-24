import React from "react";
import { useState, useEffect, useCallback } from "react";
import { 
  Form, 
  Input, 
  Button, 
  Card, 
  Popover, 
  notification,
  Checkbox
} from "antd";
import { useAuth } from "../../context/AuthContext";
import { gql } from '@apollo/client'
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { LoginOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import Iridescence from "./Iridescence/Iridescence.jsx"
// import Iridescence from './Iridescence';

// запрос на атворизацию пользователя и получение токена
const AUTH_USER = gql`
  mutation Auth($data: LoginInput!){
    auth(data: $data) {
      accessToken
    }
  }
`

const LoginPage = () => {
  const { login } = useAuth();
  const [auth, {loading}] = useMutation(AUTH_USER)
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();
  const [isRememberMe, setIsRememberMe] = useState(false)

  // для срабатывания анимации появления
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    document.title = "Авторизация"
    
    // установка состояния авторизации при входе на страницу
    const rememberMe = localStorage.getItem('isRembmerMe')
    if (rememberMe) {
      setIsRememberMe(true)
    };

    return () => {
      document.title = "-- Web AD-Tools --"
    }
  }, []); 

  // удаляем сохраненые данные если убрали галочку "Запомнить меня"
  const handleRememberMeChange = useCallback((e) => {
    setIsRememberMe(e.target.checked)

    if (!e.target.checked) {
      localStorage.removeItem('isRembmerMe')
      localStorage.removeItem('username')
    }
  },[]);

  // устанавливаем и сохраняем данные пользователя в localStorage
  const setRememberMe = useCallback((username) => {
    if (isRememberMe) {
      localStorage.setItem('isRembmerMe', true)
      localStorage.setItem('username', username)
    }
  },[isRememberMe]);

  // вызов уведомления
  const openNotification = (text,type) => {
    api.open({
      message: 'Оповещение',
      description: text,
      showProgress: true,
      pauseOnHover: true,
      placement: 'bottom',
      type,
    })
  }

  const handleAuthError = useCallback((error) => {
    let message = 'Произошла неизвестная ошибка';
    
    if (error.message === 'Failed to fetch') {
      message = 'Ошибка соединения с сервером. Проверьте подключение к интернету.';
    } else if (error.message === 'Unauthorized') {
      message = 'Неверный логин или пароль.';
    } else if (error.graphQLErrors?.length > 0) {
      message = error.graphQLErrors[0].message;
    } else {
      message = error.message;     
    }
    
    openNotification(message, 'error');
  }, []);

  // функция на сабмит формы  - авторизация и получение токена с сервера
  const onFinish = async (values) => {
    try{
      const {data} = await auth({
        variables: {
          data:{
            username:values.username,
            password:values.password
          }
        }
      })
      if (!data.auth.accessToken) throw new Error('Unauthorized')
      login(data.auth.accessToken);
      setRememberMe(values.username)
      navigate('/main') 
    }
    catch(err) {
      handleAuthError(err);
    }
  };

  return (
    <Iridescence 
      color={[1, 1, 1]}
      mouseReact={false}
      amplitude={0.1}
      speed={1.0}
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.4s ease-out', 
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        zIndex: 1,
        transform: isVisible ? 'scale(1)' : 'scale(0.8)',
        opacity: isVisible ? 1 : 0,
        transition: 'transform 0.4s ease-out, opacity 0.4s ease-out',
      }}>
        {contextHolder}
        <Card 
          title="Вход" 
          style={{ 
            width: 400,
            background: 'rgba(255,255,255,0.3)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 32px rgba(0,0,0,0.15)',
            border: '1px solid rgba(255,255,255,0.4)' 
          }} 
          extra={
            <Popover title="Информация" trigger={"hover"} content={<p>Для авторизацию в программу используй логин и пароль своей учетной записи от ПК</p>}>
              <a href="#">?</a>
            </Popover>
          }>
          <Form onFinish={onFinish} size="large" initialValues={{ username: localStorage.getItem('username')}}>
            <Form.Item 
              hasFeedback 
              name="username" 
              validateDebounce={500} 
              rules={[{ required: true, message: "Введите логин", min:6 }]}
            >
              <Input prefix={<UserOutlined />} placeholder="User name"/>
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: "Введите пароль" }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
            </Form.Item>
            <Form.Item style={{marginBottom:0}}>
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                loading={loading} 
                icon={<LoginOutlined />}
              >
                Войти
              </Button>
            </Form.Item>
            <Form.Item style={{ textAlign: "right", margin:0 }}>
              <Checkbox checked={isRememberMe} onChange={(e) => handleRememberMeChange(e)}>
                Запомнить меня
              </Checkbox>
              <Popover title="Важно" trigger={"hover"} content={<p>Сохраняет и подставляет ваш Лоигн автоматически </p>}>
                <a href="#">?</a>
              </Popover>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </Iridescence>
  )
}

export default LoginPage;