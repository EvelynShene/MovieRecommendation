import React from 'react'
import { Layout } from 'antd'
const {  Footer } = Layout

function CommonFooter(props) {
    return (
        <Footer style={{ textAlign: 'center', background: '#ffffff' }}>
            Movie Recommendation ©2017 Created by Group
        </Footer>
    )
}


export default CommonFooter