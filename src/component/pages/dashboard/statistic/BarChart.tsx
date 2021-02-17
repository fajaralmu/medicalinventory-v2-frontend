
import React, { Component, Fragment } from 'react';
import './ChartSvg.css';  
import DataSet from '../../../../models/settings/DataSet';
import { beautifyNominal } from '../../../../utils/StringUtil';
interface IProps {
    dataSet: DataSet[],
    updated: Date,
    onClick?:(index:number)=>void
    onUnHover?:()=>void
}
class IState {
    hoveredIndex: number = -1;
    updated: Date = new Date();
}
export default class DashboardBarChart extends Component<IProps, IState>
{
    middleYAxisValue: number = 0;
    bottomYAxisValue: number = 0;
    offsetX: number = 100;
    offsetY: number = 50;
    baseYIndex: number = 200;
    baseHeight: number = 150;
    lineWidth: number = 0;
    maxValue: number = 0;
    state: IState = new IState();
    constructor(props: IProps) {
        super(props);
        this.updateSizes();

    }
    maxAmount:(cashflows: DataSet[])=>number = (cashflows: DataSet[]): number => {
        let max = 0;
        for (let i = 0; i < cashflows.length; i++) {
            const element = cashflows[i];
            
            if (element.getAmount() > max) {
                max = element.getAmount();
            }
        }

        return max;
    }
    updateSizes = () => {
        this.maxValue = this.maxAmount(this.props.dataSet);
        this.middleYAxisValue = Math.round(this.maxValue * 2 / 3);
        this.bottomYAxisValue = Math.round(this.maxValue * 1 / 3);
        this.lineWidth = (23) * (this.props.dataSet.length) + 100;
    }
    componentDidUpdate() {
        this.updateSizes();
        if (this.props.updated != this.state.updated) {
            this.setState({ updated: this.props.updated });
        }
    }
    hover = (index: number) => {
        this.setState({ hoveredIndex: index });
        
    }
    onClick = (index:number) => {
        if (this.props.onClick) {
            this.props.onClick(index);
        }
    }
    unHover = () => {
        this.setState({ hoveredIndex: -1 });
        // if (this.props.onUnHover) {
        //     this.props.onUnHover();
        // }
    }
  
    render() {
        const props = this.props;
        return (
           <Fragment>
                <div className="text-center border border-secondary" style={{ 
                    minHeight: '300px', overflowX: 'scroll',
                    paddingTop:'10px', paddingBottom: '10px'
                     }}>
                    <svg onMouseOut={this.unHover} className="bg-light border" version="1.1" baseProfile="full" width={this.offsetX * 2 + (23) * (props.dataSet.length)+ 100} height={300} xmlns="http://www.w3.org/2000/svg">

                        {props.dataSet.map((data, i) => {
                            const percentage = (data.getAmount() / this.maxValue) * this.baseHeight;
                            const labelY = this.baseYIndex + 15, labelX = this.offsetX + 10 + (23) * (i);
                            const xTranslated = 0, yTranslated = 0;
                            const transform = "translate(" + xTranslated + "," + yTranslated + ") rotate(-30," + labelX + "," + labelY + ")";
                            const hovered = i == this.state.hoveredIndex;
                            return (
                                <g style={hovered ? { cursor: 'pointer' } : {}} className="chart-group"
                                 onMouseOver={(e) => this.hover(i)} onClick={(e) => this.onClick(i)} onMouseOut={this.unHover} key={ "bar-item-chart-" + i}>
                                    <rect fill={hovered ? "red" : "green"} x={this.offsetX + (23) * (i)} y={this.baseYIndex - percentage} height={percentage} width={20} ></rect>
                                    <text fill={hovered ? "red" : "black"} textAnchor="end" fontSize={10} x={labelX} y={labelY} transform={transform}>{data.getLabel()}</text>
                                    <circle cx={this.offsetX + (23) * (i + 1)} cy={this.baseYIndex} r="3" fill="red" />
                                </g>
                            )
                        })}
                        <rect name="base_axis_x" x={this.offsetX} y={this.baseYIndex} height={2} width={this.lineWidth} />
                        <rect name="ruler_line_top" fill="rgb(100,100,100)" x={this.offsetX} y={this.offsetY} height={1} width={this.lineWidth} />
                        <rect name="ruler_line_middle" fill="rgb(100,100,100)" x={this.offsetX} y={this.offsetY + this.baseHeight * 1 / 3} height={1} width={this.lineWidth} />
                        <rect name="ruler_line_bottom" fill="rgb(100,100,100)" x={this.offsetX} y={this.offsetY + this.baseHeight * 2 / 3} height={1} width={this.lineWidth} />
                        <rect name="base_axis_y" x={this.offsetX} y={this.offsetY} height={this.baseHeight} width={2} />

                        <text textAnchor="end" name="top_val" fontSize={10} x={this.offsetX} y={this.offsetY}>{beautifyNominal(this.maxValue)}</text>
                        <text textAnchor="end" name="middle_val" fontSize={10} x={this.offsetX} y={this.offsetY + this.baseHeight * 1 / 3}>{beautifyNominal(this.middleYAxisValue)}</text>
                        <text textAnchor="end" name="bottom_val" fontSize={10} x={this.offsetX} y={this.offsetY + this.baseHeight * 2 / 3}>{beautifyNominal(this.bottomYAxisValue)}</text>
                    </svg>
                </div>
                <p><i className="fas fa-history" /> {new Date(this.state.updated).toString()}</p> 
            </Fragment>
        )
    }
}
