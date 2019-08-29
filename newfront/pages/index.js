import React from 'react'
import {Card} from 'antd';
const Home = ()=>{
    return (
        <>
        <div style={{width:"100%", backgroundColor:"yellow"}}>
            <div style={{display:"inline-block",width:"100%"}}>
            <Card
                hoverable
                style={{ width:"100%"}}
                >
                {<img style={{ width:240,float:"left"}} alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                <Card.Meta style={{float:"left",textAlign:"center", paddingLeft:10}} title="Europe Street beat" description="www.instagram.com" />
                <div style={{}}>
                    공유0 댓글0 1시간전 by haily
                </div>
            </Card>
            </div>
            <div style={{display:"inline-block",width:"100%"}}>
            <Card
                hoverable
                style={{ width:"100%"}}
                
                >
                   {<img style={{ width:240,float:"left"}} alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                <Card.Meta style={{float:"left",textAlign:"center", paddingLeft:10}} title="Europe Street beat" description="www.instagram.com" />
            </Card>
            </div>
            
            
        </div>
           
        </>
    )
}

export default Home