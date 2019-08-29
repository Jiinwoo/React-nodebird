import React, {useState, useCallback} from 'react'
import {Layout, Menu, Breadcrumb, Drawer, Button, Icon, Row, Col, Typography, Input} from 'antd'
import LoginForm from './LoginForm';
const { Header, Content, Footer } = Layout;
const {Title} = Typography;

const AppLayout = ({children})=>{
    const [visible,setVisible] = useState(false)
    const [placement,setPlacement] = useState('left')
    const showDrawer = useCallback(()=>{
        setVisible(true);
    },[visible])
    const onClose = useCallback(()=>{
        setVisible(false);
    })
    
    return (
        <Layout className="layout" >
            <Header >
            <div className="logo" />
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['2']}
                style={{ lineHeight: '64px' }}
            >
                {/* <Button type="primary" onClick={showDrawer}>
                    Open
                </Button> */}
                <Menu.Item>
                    <Icon type="unordered-list" style={{}}onClick={showDrawer}/>
                </Menu.Item>
                
                <Menu.Item key="1">Jinwoo's Brunch</Menu.Item>
                <Menu.Item key="2" style={{float:"right"}}>
                    <Input placeholder="Search"/>
                    <Icon style={{paddingLeft:30}}type="search" />
                </Menu.Item>
                
            </Menu>
            <Drawer
                title="로그인 및 회원가입"
                placement={placement}
                closable={false}
                onClose={onClose}
                visible={visible}
                >
                 <LoginForm>
                </LoginForm>   
                
                </Drawer>
            </Header>
            <Content style={{ padding: '0 50px' }}>
                <Row>
                    <Col span={8}></Col>
                    <Col span={8}>
                        <Title style={{textAlign: "center",marginTop:60,marginBottom:40}}> IT 트렌드 </Title>
                    </Col>
                    <Col span={8}></Col>
                </Row>
                
                <Row gutter={8}>
                <Col xs={24} md={6}>
                    
                    
                </Col>
                <Col xs={24} md={12}>
                    {children}
                </Col>
                <Col xs={24} md={6}>

                </Col>
            </Row>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
    )
}
export default AppLayout;