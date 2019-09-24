import React from "react";
import { Comment, Avatar, Input, Button } from "antd";
import styled from "styled-components";

const DivWrapper = styled.div`
  background-color: #bbdefb;
  width: 100%;
  height: 400px;
  overflow: scroll;
`;
const tempData = {
  chatContent: [
    {
      user: "정진우",
      content:
        "We supply a series of design principles, practical patterns and\
high quality design resources (Sketch and Axure), to help people\
create their product prototypes beautifully and efficiently.",
      isMine: true
    },
    {
      user: "다른사람",
      content: "채팅내용입니다.",
      isMine: false
    }
  ]
};
const Chat = () => {
  return (
    <>
      <DivWrapper>
        <Comment
          style={{ float: "bottom" }}
          author={
            <a style={{ position: "relative", left: "450px", top: "10px" }}>
              {tempData.chatContent[0].user}
            </a>
          }
          avatar={
            <Avatar
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              alt="Han Solo"
              style={{ position: "absolute", left: "500px" }}
            />
          }
          content={
            <p style={{ marginTop: "20px" }}>
              {tempData.chatContent[0].content}
            </p>
          }
        />
        <Comment
          author={
            <a style={{ position: "relative", top: "10px" }}>
              {tempData.chatContent[1].user}
            </a>
          }
          avatar={
            <Avatar
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              alt="Han Solo"
              style={{ float: "right" }}
            />
          }
          content={
            <p style={{ marginTop: "20px" }}>
              {tempData.chatContent[1].content}
            </p>
          }
        />
      </DivWrapper>
      <div style={{ float: "bottom" }}>
        <Input style={{ float: "left", width: "90%" }}></Input>
        <Button style={{ float: "right", width: "10%" }}>입력</Button>
      </div>
    </>
  );
};

export default Chat;
