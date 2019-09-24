import React from "react";
import { List, Avatar } from "antd";
const ladder = () => {
  const tempData = {
    chatList: [
      {
        title: "1번방임",
        participants: ["jung", "ab"]
      },
      {
        title: "2번방입니다.",
        participants: null
      },
      {
        title: "A2번방입니다",
        participants: null
      },
      {
        title: "4번방방금만듬",
        participants: null
      }
    ]
  };
  return (
    <div>
      <List
        header={<div>방 목록</div>}
        itemLayout="horizontal"
        dataSource={tempData.chatList}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              }
              title={
                <div>
                  <a href="https://ant.design">{item.title}</a>
                  <button style={{ float: "right" }}>입장</button>
                </div>
              }
              description={item.participants}
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default ladder;
