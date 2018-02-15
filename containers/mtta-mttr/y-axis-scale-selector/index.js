import React, {Component} from 'react'
import { Map } from 'immutable'

class MttaMttrGraphYAxisSelect extends Component {
  constructor (props) {
    super(props)

    this._setAxisType = this._setAxisType.bind(this)
  }

  _setAxisType (type) {
    return () => {
      let payload = null
      if (type === 'linear') {
        payload = { yAxisType: Map({name: 'Linear', type: 'linear'}) }
      } else {
        payload = { yAxisType: Map({name: 'Logarithmic', type: 'logarithmic'}) }
      }
      this.props.setFilterMttaMttr(payload)
      this.props.getMttaMttrGraph()
    }
  }

  render () {
    return (
      <div className='reports--yaxisradios'>
        <span>Time scale:</span>
        <span className='reports--yaxisradiocontainer'>
          <label>
            <input type='radio' checked={this.props.yAxisTypeName === 'Linear'} onChange={this._setAxisType('linear')} />
            Linear
          </label>
          <label>
            <input type='radio' checked={this.props.yAxisTypeName === 'Logarithmic'} onChange={this._setAxisType('logarithmic')} />
            Logarithmic
          </label>
        </span>
      </div>
    )
  }
}

export default MttaMttrGraphYAxisSelect
