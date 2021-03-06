import React, {memo, useEffect} from 'react';
import {Button, Input, Pagination, Select, Table} from "antd";
import {useAgent,useBranch} from "use-agent-reducer";
import {ClassifyQueryAgent} from "@/module";
import {Position} from "./type";
import Column from "antd/lib/table/Column";
import {BranchResolvers} from "agent-reducer";

const PositionSelect=memo(({value,onChange}:{value:Position,onChange:(v:Position)=>void})=>{
    console.log('render...')
    return (
        <Select style={{width: 160, marginRight: 8}} value={value}
                onChange={onChange}>
            <Option value={Position.USER}>user</Option>
            <Option value={Position.MASTER}>master</Option>
            <Option value={Position.ADMIN}>admin</Option>
        </Select>
    );
});

const Option = Select.Option;

export default memo(() => {

    const agent = useAgent(ClassifyQueryAgent);

    const {state, handleFormNameChange} = agent;

    const {handleQueryClick, handlePageChange}=useBranch(agent,BranchResolvers.takeLatest());

    useEffect(() => {
        handleQueryClick();
    }, []);

    return (
        <div style={{padding: 12}}>
            <div style={{padding: '12px 0'}}>
                <label>name：</label>
                <Input style={{width: 160, marginRight: 8}} value={state.form.name}
                       onChange={(e) => handleFormNameChange(e.target.value)}/>
                <label>position：</label>
                <PositionSelect value={state.form.position} onChange={agent.handleFormPositionChange}/>
                <Button type="primary" onClick={handleQueryClick}>search</Button>
            </div>
            <Table dataSource={state.list} loading={state.loading} pagination={false} rowKey="id">
                <Column title="id" dataIndex="id"/>
                <Column title="name" dataIndex="name"/>
                <Column title="position" dataIndex="position"/>
            </Table>
            <Pagination current={state.page} total={state.total} pageSize={10} onChange={handlePageChange}/>
        </div>
    );
});