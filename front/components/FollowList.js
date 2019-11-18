import React from 'react';
import { Button, List, Icon, Card } from 'antd';

const FollowList = ({header,hasMore,onClickMore,data,onClickStop})=>{
return (<List
        style={{ marginBottom: '20px' }}
        grid={{ gutter: 4, xs: 2, md: 3 }}
        size="small"
header={<div>{header}}</div>}
        loadMore={
           hasMore&& (
            <Button style={{ width: '100%' }} onClick={onClickMore}>
              더 보기
            </Button>
          )
        }
        bordered
        dataSource={data}
        renderItem={(item) => (
          <List.Item style={{ marginTop: '20px' }}>
            <Card
              actions={[
                <Icon key="stop" type="stop" onClick={onClickStop} />,
              ]}
            >
              <Card.Meta description={item.nickname} />
            </Card>
          </List.Item>
        )}
      />);
};

export default FollowList;