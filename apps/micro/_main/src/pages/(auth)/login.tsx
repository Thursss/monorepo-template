import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Flex, Form, Input, message } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router'
import { _login } from '../../request/auth/login'

interface Props {
  username?: string
  password?: string
  remember?: boolean
}

const Login: React.FC = () => {
  const nav = useNavigate()
  const [messageApi, contextHolder] = message.useMessage()

  const onFinish = async ({ username, password }: Props) => {
    if (username === undefined || password === undefined)
      return messageApi.error('用户名或密码不能为空')

    const res = await _login({
      username,
      password,
    })
    if (res?.code === 200) {
      localStorage.setItem('token', res.data?.token || '')
      nav('/')
    }
    else {
      messageApi.error('用户名或密码错误')
    }
  }

  return (
    <>
      {contextHolder}
      <Flex justify="center" align="center" style={{ height: '100vh' }}>
        <Form
          name="login"
          initialValues={{ remember: true }}
          style={{ minWidth: 390 }}
          onFinish={onFinish}
        >
          <Form.Item<Props>
            name="username"
            rules={[{ required: true, message: 'Please input your Username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item<Props>
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item<Props> name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a href="">Forgot password</a>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </>
  )
}

export default Login
