import React,{useState,useCallback,useEffect,useRef} from 'react'
import {useSelector,useDispatch} from 'react-redux';
import {Button,Input,Form} from 'antd';
import { ADD_POST_REQUEST, UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE } from '../reducers/post';

const PostForm = ()=>{
    const dispatch = useDispatch();
    const [text,setText] = useState('');
    const {imagePaths,isAddingPost,postAdded} = useSelector(state=>state.post);
    const imageInput = useRef()
    const onRemoveImage = useCallback((index)=>()=>{
        dispatch({
            type : REMOVE_IMAGE,
            index,
        });
    },[])
    useEffect(()=>{
        setText('');
    },[postAdded===true]);
    const onChangeImage = useCallback((e)=>{
        console.log(e.target.files);
        const imageFormData = new FormData();
        [].forEach.call(e.target.files,(f)=>{
            imageFormData.append('image',f);
        })
        dispatch({
            type :UPLOAD_IMAGES_REQUEST,
            data : imageFormData,
        });
    },[])
    const onClickImageUpload = useCallback(()=>{
        imageInput.current.click();
    },[imageInput.current]);
    const onSubmitForm = useCallback((e)=>{
        e.preventDefault();
        if(!text || !text.trim()){
            return alert('게시글을 작성하세요');
        }
        const formData = new FormData();
        imagePaths.forEach((i)=>{
            formData.append('image',i);
            
        });
        formData.append('content',text);
        dispatch({
            type:ADD_POST_REQUEST,
            data:formData
        })
    },[text,imagePaths]);
    const onChangeText = useCallback((e)=>{
        setText(e.target.value);
    },[]);
    return (
        <Form style={{margin:'10px 0 20px'}} encType="multipart/form-data" onSubmit={onSubmitForm}>
                <Input.TextArea maxLength={140} placeholder="어떤 신기한 일이 있었나요?" value={text} onChange={onChangeText}/>
                <div>
                    <input type="file" multiple hidden ref={imageInput} onChange={onChangeImage}/>
                    <Button onClick={onClickImageUpload}>이미지 업로드</Button>
                    <Button type="primary" style={{float:'right'}} htmlType="submit" loading={isAddingPost}>쨱짹</Button>
                </div>
                <div>
                    {imagePaths.map((v,i)=>{
                        return(
                            <div key={v} style={{display:'inline-block'}}>
                                <img src={'http://localhost:8080/'+v} style={{width:'200px'}} alt={v}/>
                                <div>
                                    <Button onClick={onRemoveImage(i)}>제거</Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Form>
    )
}
export default PostForm;