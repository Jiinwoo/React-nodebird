import React, {useState, useCallback} from 'react'
import {Menu, Input, Icon} from 'antd'
const SearchForm = ()=>{
    const [text123,setText123] = useState('');
    const onChangeText = useCallback((e)=>{
        setText123(e.target.value);
    },{text123});
    return (
        <Menu.Item key="2" style={{float:"right"}}>
                    <Input placeholder="Search" value={text123} onChange={onChangeText}/>
                    <Icon style={{paddingLeft:30}}type="search" />
            </Menu.Item>
    )
}
export default SearchForm