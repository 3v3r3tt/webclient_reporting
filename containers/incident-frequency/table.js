import React, { Component } from 'react'
import { connect } from 'react-redux'

import moment from 'moment'

import InnerTable from './inner-table'

import {
  incidentFrequencyTableGet,
  incidentFrequencyInnerTableReset
} from 'reporting/actions/incident-frequency'

import Victory from '@victorops/victory'
const { Table } = Victory

function mapStateToProps (state) {
  return {
    rows: state.incidentFrequency.getIn(['graphData', 'segments']),
    reducedData: state.incidentFrequency.get('reducedData'),
    reducedRows: state.incidentFrequency.getIn(['reducedData', 'reducedRows']),
    innerTableIncidentData: state.incidentFrequency.get('innerTableIncidentData'),
    resolutionType: state.incidentFrequency.get('resolutionType')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getTableData: (payload) => dispatch(incidentFrequencyTableGet(payload)),
    resetTableData: (payload) => dispatch(incidentFrequencyInnerTableReset(payload))
  }
}

class IncidentFrequencyTable extends Component {
  _generateIncidentFrequencyTableRows (incidentFrequencyData) {
    if (!incidentFrequencyData) return []
    const generatedRows = incidentFrequencyData.map((segment, index) => {
      return ({
        id: segment.segment_name,
        key: index,
        columns: [{
          id: `segment-name-${index}`,
          type: 'component',
          component: InnerTable,
          content: {
            name: segment.segment_name,
            bucketTotal: segment.bucket_total,
            getInnerTableData: this.props.getTableData,
            resetInnerTableData: this.props.resetTableData,
            innerTableIncidentData: this.props.innerTableIncidentData,
            colorList: this.props.colorList,
            outerTableIndex: index
          }
        }]
      })
    })
    return generatedRows
  }

  _determineResolutionMomentType (label) {
    switch (label) {
      case 'Display daily': return 'day'
      case 'Display weekly': return 'week'
      case 'Display monthly': return 'month'
      default: throw new Error('Unexpected date resolution type!')
    }
  }

  _determineDateRangeLabel (columnTitle) {
    const clickDate = moment(columnTitle, 'MMM D').date()
    const clickMonth = moment(columnTitle, 'MMM D').month()
    const clickYear = moment().month() > clickMonth ? moment().year() : moment().year() - 1
    const fromDate = moment(new Date(clickYear, clickMonth, clickDate))
    const dateResolution = this._determineResolutionMomentType(this.props.resolutionType)
    const toDate = fromDate.clone().add(1, dateResolution)
    return `# of Incidents (${fromDate.format('MMM D')} - ${toDate.format('MMM D')})`
  }

  render () {
    const columnTitle = this.props.reducedData.get('columnTitle')
    let incidentColumnLabel = '# of Incidents'
    if (columnTitle) {
      incidentColumnLabel = this._determineDateRangeLabel(columnTitle)
    }

    let generatedRows = []
    if (this.props.reducedRows) {
      generatedRows = this._generateIncidentFrequencyTableRows(this.props.reducedRows.toJS())
    } else if (this.props.rows) {
      generatedRows = this._generateIncidentFrequencyTableRows(this.props.rows.toJS())
    }

    const TableHeader =
      <div className='row'>
        <div className='col-8'>
          <span>Service</span>
        </div>
        <div className='col-4'>
          <span className='pull-right'>{incidentColumnLabel}</span>
        </div>
      </div>

    const incidentFrequencyTableConfig = {
      columnHeaders: [
        {
          label: TableHeader
        }],
      rowItems: generatedRows,
      customClasses: ['incident-frequency--main-incident-table']
    }

    return (
      <div className='has-loading-gradient margin-top-10'>
        <Table {...incidentFrequencyTableConfig} showLoader={this.props.isLoading} />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IncidentFrequencyTable)
