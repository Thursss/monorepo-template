import type { MenuProps } from 'antd'
import {
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Breadcrumb, Layout, Menu, theme } from 'antd'
import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'

const { Header, Content, Footer, Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem
}

const items: MenuItem[] = [
  getItem('首页', '/', <PieChartOutlined />),
  getItem('child-vue3', '/vue3', <UserOutlined />, [
    getItem('vue3', '/child/vue3', <FileOutlined />),
    getItem('关于vue3', '/child/vue3/about', <FileOutlined />),
    getItem('其他', '/child/vue3/other/sss', <FileOutlined />),
  ]),
  getItem('child-vue2', '/vue2', <FileOutlined />, [
    getItem('vue2', '/child/vue2', <FileOutlined />),
    getItem('element-ui', '/child/vue2/element-ui', <FileOutlined />),
    getItem('ant-design-vue', '/child/vue2/ant-design-vue', <FileOutlined />),
  ]),
  getItem('Team', 'sub2', <TeamOutlined />, [getItem('Team 1', '6'), getItem('Team 2', '8')]),
]

const App: React.FC = () => {
  const navigate = useNavigate()

  // 认证状态
  const isAuthenticated = localStorage.getItem('token')
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [navigate, isAuthenticated])

  const handleMenuClick = (e: MenuItem) => {
    navigate(e!.key as string)
  }

  const [collapsed, setCollapsed] = useState(false)
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={handleMenuClick} />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }} items={[{ title: 'User' }, { title: 'Bill' }]} />
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Ant Design ©
          {new Date().getFullYear()}
          {' '}
          Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  )
}

export default App
