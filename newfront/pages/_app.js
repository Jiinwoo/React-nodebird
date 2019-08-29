import React from 'react'
import Head from 'next/head'
import AppLayout from '../component/AppLayout'
const Blog = ({Component})=>{
    return (
        <>
            <Head>
                <title>JinWoo's Blog</title>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.22.2/antd.css"/>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/antd/3.22.2/antd.js"/>
            </Head>
            <AppLayout>
                <Component/>
            </AppLayout>
        </>
    )
}
export default Blog