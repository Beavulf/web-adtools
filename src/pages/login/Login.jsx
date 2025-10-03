import React from "react";
import { useState, useEffect } from "react";
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
import { LoginOutlined } from "@ant-design/icons";

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
  const [isRembmerMe, setIsRembmerMe] = useState(false)

  // для срабатывания анимации появления
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    setIsVisible(true);
    document.title = "Авторизация"
    return () => {
      document.title = "-- Web AD-Tools --"
    }
  }, []);

  // установка состояния авторизации при входе на страницу
  useEffect(() => {
    const check = localStorage.getItem('isRembmerMe')
    if (check) {
      setIsRembmerMe(true)
    };
  },[])

  // удаляем сохраненые данные если убрали галочку "Запомнить меня"
  const isRememberChange = (e) => {
    if (!e.target.checked) {
      localStorage.removeItem('isRembmerMe')
      localStorage.removeItem('username')
    }
    setIsRembmerMe(e.target.checked)
  }

  // устанавливаем и сохраняем данные пользователя в localStorage
  const setRememberMe = (username) => {
    if (isRembmerMe) {
      localStorage.setItem('isRembmerMe', true)
      localStorage.setItem('username', username)
    }
  }

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
      if (err.message === 'Failed to fetch') {
        openNotification(`Ошибка соединения с сервером (${err.message}).`, 'error')
        return;
      }
      if (err.message === 'Unauthorized') {
        openNotification(`Неверный логин или пароль (${err.message}).`, 'error')
        return;
      }
      openNotification(`Ошибка при попытке входа (${err.message}).`, 'error')
    }
  };

  return (
    <div 
      style={{
        height:'100vh', backgroundColor:'#a9f5f5', width:"100vw",
        backgroundImage: 'url(/BGLogin.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.4s ease-out', 
      }}
    >
      <div style={{
        display: "flex", justifyContent: "center", alignItems: "center", height: "100%",
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
              rules={[{ required: true, message: "Введите Логин минимум 6 символов", min:6 }]}
            >
              <Input placeholder="User name" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: "Введите пароль" }]}>
              <Input.Password placeholder="Пароль" />
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
              <Checkbox checked={isRembmerMe} onChange={(e) => isRememberChange(e)}>Запомнить меня</Checkbox>
              <Popover title="Важно" trigger={"hover"} content={<p>Сохраняет и подставляет ваш Лоигн автоматически </p>}>
                <a href="#">?</a>
              </Popover>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage;