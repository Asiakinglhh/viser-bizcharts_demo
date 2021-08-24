import React, { Component } from 'react';
import { LocaleProvider,Form,DatePicker,Button,PageHeader,Tabs,Icon,Spin,Table } from 'antd';
import { Chart, Tooltip, Axis, Legend, Line, Point } from 'viser-react';
import axios from 'axios';
import $ from 'jquery';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { MonthPicker } = DatePicker;
const { TabPane } = Tabs;
const DataSet = require('@antv/data-set');

class Test extends Component {
    constructor(props) {
        super(props);
        this.state = {
            summarycolumns:[{title:'营销中心',dataIndex:'vfree1',key:0,width:60,className:'first'}, {title:'仓库',dataIndex:'materialspec',key:1,width:60},
                            {title:'一月',dataIndex:'Jan',key:2,width:60}, {title:'二月',dataIndex:'Feb',key:3,width:60},
                            {title:'三月',dataIndex:'Mar',key:4,width:60}, {title:'四月',dataIndex:'Apr',key:5,width:60},
                            {title:'五月',dataIndex:'May',key:6,width:60}, {title:'六月',dataIndex:'Jun',key:7,width:60},
                            {title:'七月',dataIndex:'Jul',key:8,width:60}, {title:'八月',dataIndex:'Aug',key:9,width:60},
                            {title:'九月',dataIndex:'Sep',key:10,width:60}, {title:'十月',dataIndex:'Oct',key:11,width:60},
                            {title:'十一月',dataIndex:'Nov',key:12,width:60}, {title:'十二月',dataIndex:'Dec',key:13,width:60}
            ],
            columns:[{title:'营销中心',dataIndex:'vfree1',key:0,width:90,className:'first'}, {title:'规格',dataIndex:'materialspec',key:1,width:90},
                    {title:'可用量',dataIndex:'natpnum',key:2,width:90}, {title:'未提货量',dataIndex:'nonhandnum',key:3,width:90},
                    {title:'冻结量',dataIndex:'noutnum',key:4,width:90}, {title:'总库存',dataIndex:'nfreezenum',key:5,width:90},
                    {title:'考核库存',dataIndex:'numm',key:6,width:90}
            ],
            sourcedata:[{ month:'', 总库存:'', 狮山:'', OEM:'',河源:'',东源:'' }],
            summarydata:[],
            data:[],
            loading: true
        };
    }

    getQueryVariable(variable){
        var query = this.props.location.search.substring(1);
        var vars =query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] === variable){return  decodeURI(pair[1]);}
        }
        return(false);
    }

    getAllData=(values)=>{
        var logo=this.getQueryVariable('logo');
        function getSummaryData(){
            return axios.get('/api/pms/report/getSaleOnICSum.shtml?',{
                params:{ logo:logo, type:2, meteDate:values }
            })
        }
        function getData(){
            return axios.get('/api/pms/report/getSaleOnICSum.shtml?',{
                params:{ logo:logo, type:1, meteDate:values }
            })
        }
        axios.all([getSummaryData(), getData()])
        .then(axios.spread((sumres, res)=>{
            // 两个请求现在都执行完成
            if(sumres.data.success||res.data.success){
                let sumdata=this.state.summarydata;
                for(let i=0; i<sumres.data.data.length; i++){
                    let obj = sumres.data.data[i];
                    sumdata.push({
                        key: i,
                        vfree1: obj.vfree1,
                        materialspec: obj.materialspec,
                        Jan: obj.Jan===undefined?"":obj.Jan.toFixed(2),
                        Feb: obj.Feb===undefined?"":obj.Feb.toFixed(2),
                        Mar: obj.Mar===undefined?"":obj.Mar.toFixed(2),
                        Apr: obj.Apr===undefined?"":obj.Apr.toFixed(2),
                        May: obj.May===undefined?"":obj.May.toFixed(2),
                        Jun: obj.Jun===undefined?"":obj.Jun.toFixed(2),
                        Jul: obj.Jul===undefined?"":obj.Jul.toFixed(2),
                        Aug: obj.Aug===undefined?"":obj.Aug.toFixed(2),
                        Sep: obj.Sep===undefined?"":obj.Sep.toFixed(2),
                        Oct: obj.Oct===undefined?"":obj.Oct.toFixed(2),
                        Nov: obj.Nov===undefined?"":obj.Nov.toFixed(2),
                        Dec: obj.Dec===undefined?"":obj.Dec.toFixed(2)
                    });
                }
                this.setState({
                    summarydata:sumdata,
                    sourcedata:sumres.data.list
                })
                // this.dealParallelrow();
                for(let i=0; i<res.data.data.length; i++){
                    let da=this.state.data;
                    let obj = res.data.data[i];
                    da.push({
                        key: i,
                        vfree1: obj.vfree1,
                        materialspec: obj.materialspec,
                        natpnum: obj.natpnum===undefined?"":obj.natpnum.toFixed(2),
                        nonhandnum: obj.nonhandnum===undefined?"":obj.nonhandnum.toFixed(2),
                        noutnum: obj.noutnum===undefined?"":obj.noutnum.toFixed(2),
                        nfreezenum: obj.nfreezenum===undefined?"":obj.nfreezenum.toFixed(2),
                        numm: obj.numm===undefined?"":obj.numm.toFixed(2)
                    });
                    this.setState({
                        data:da
                    })
                }
                this.setState({
                    loading:false
                })
            }else{
                this.setState({
                    loading:false
                })
            }
        }))
        .catch((error)=>{
            console.log(error);
            this.setState({
                loading:false
            })
        });
    }

    dealParallelrow(){
        var clo1Text = '';
        var cloNo = 1;
        var cloNullNo = 0;
        $('td.first').each(function(index,ele){
            var t = ele.textContent;
            var _ele = $(ele);
            _ele.attr('name',t);
            if(t===''){
                if(cloNullNo===0){
                    _ele.parent().css("background","rgb(81, 183, 236)");
                }
                cloNullNo++;
                return;
            }else if(clo1Text===t){
                _ele.remove();
                cloNo++;
            }else if(index!==0){
                $('td.first[name='+clo1Text+']').attr('rowspan',cloNo);
                cloNo = 1;
            }
            clo1Text = t;
        })
    }

    handleSubmit=(e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, fieldsValue)=>{
            if(err) {
                return
            }
            // Should format date value before submit.
            const values={
                ...fieldsValue,
                times: fieldsValue['month-picker'].format('YYYY-MM'),
            };
            this.setState({
                loading:true
            })
            console.log(values);
            this.getAllData(values.times);
        });
    }

    clearData=()=>{
        this.setState({
            summarydata:[],
            sourcedata:[],
            data:[]
        })
    }
        
    callback(key) {
        console.log(key);
    }

    componentWillMount(){
        this.getAllData();
    }
    
    render() {
        const { getFieldDecorator }=this.props.form;
        const Config={
            rules: [{ type:'object', required:true, message:'请选开始日期！' }]
        };
        const dv = new DataSet.View().source(this.state.sourcedata);
        dv.transform({
            type: 'fold',
            fields: ['总库存','狮山','OEM','河源','东源'],
            key: 'district',
            value: 'storage',
            tickCount:6
        });
        const data = dv.rows;
        const scale = [{
            dataKey: 'month',
            min: 0,
            max: 1,
            // range:[0,1],
            nice:true,
        }];
        const label = {
            formatter: function formatter(val) {
              return val + '万方';
            }
          }
        return (
            <LocaleProvider locale={zh_CN}>
                <div className="middlebody">
                    <Form layout="inline" onSubmit={this.handleSubmit}>
                        <Form.Item label="开始时间">
                            {getFieldDecorator('month-picker', Config)(<MonthPicker onChange={this.clearData} />)}
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" shape="round" htmlType="submit" >确定</Button>
                        </Form.Item>
                    </Form>
                    <PageHeader>
                        <Icon type="box-plot" theme="twoTone" style={{ fontSize: '20px' }} />
                        <Icon type="pie-chart" theme="twoTone" style={{ fontSize: '20px' }} />
                        上月库存分析
                        <Icon type="fund" theme="twoTone" style={{ fontSize: '20px' }} />
                        <Icon type="sliders" theme="twoTone" style={{ fontSize: '20px' }} />
                    </PageHeader>
                    <Tabs defaultActiveKey="1" onChange={this.callback}>
                        <TabPane tab={<span><Icon type="line-chart" />上月月末总仓库汇总库存</span>} key="1">
                            <Spin spinning={this.state.loading} size="large" >
                                <Table size="small" bordered columns={this.state.summarycolumns} dataSource={this.state.summarydata} pagination={{pageSize:80}} scroll={{x:1900,y:700}} />
                            </Spin>
                            <Chart forceFit height={400} data={data} scale={scale}>
                                <Tooltip />
                                <Axis dataKey="storage" label={label}/>
                                <Legend />
                                <Line position="month*storage" color="district" />
                                <Point position="month*storage" color="district" size={4} style={{ stroke: '#fff', lineWidth: 1 }} shape="circle"/>
                            </Chart>
                        </TabPane>
                        <TabPane tab={<span><Icon type="database" />上月月末总库存</span>} key="2">
                            <Spin spinning={this.state.loading} size="large" >
                                <Table size="small" bordered columns={this.state.columns} dataSource={this.state.data} pagination={{pageSize:80}} scroll={{x:1900,y:700}} />
                            </Spin>
                        </TabPane>
                    </Tabs>
                </div>
            </LocaleProvider>
        );
    }
}
Test=Form.create({})(Test);
export default Test;