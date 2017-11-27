import React, { Component } from 'react'
import { connect } from 'react-redux'

import moment from 'moment'

import InnerTable from './inner-incident-table'

import {
  incidentFrequencyTableGet,
  incidentFrequencyInnerTableReset
} from 'reporting/actions/incident-frequency'

import {
  hideModal,
  showModal
} from 'reporting/actions/modal'

import Victory from '@victorops/victory'
const { Table } = Victory

function mapStateToProps (state) {
  return {
    reducedData: state.incidentFrequency.get('reducedData'),
    reducedRows: state.incidentFrequency.getIn(['reducedData', 'reducedRows']),
    innerTableIncidentData: state.incidentFrequency.get('innerTableIncidentData'),
    resolutionType: state.incidentFrequency.get('resolutionType'),
    tableError: state.incidentFrequency.getIn(['error', 'table']),
    graphDataSegments: state.incidentFrequency.getIn(['graphData', 'segments'])
  }
}

function mapDispatchToProps (dispatch) {
  return {
    getTableData: (payload) => dispatch(incidentFrequencyTableGet(payload)),
    resetTableData: (payload) => dispatch(incidentFrequencyInnerTableReset(payload)),
    hideModal: (payload) => dispatch(hideModal(payload)),
    showModal: (payload) => dispatch(showModal(payload))
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
            bucketTotal: segment.total_incidents,
            getInnerTableData: this.props.getTableData,
            resetInnerTableData: this.props.resetTableData,
            innerTableIncidentData: this.props.innerTableIncidentData,
            colorList: this.props.colorList,
            outerTableIndex: index,
            showModal: this.props.showModal,
            hideModal: this.props.hideModal
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
    const graphIsEmpty = this.props.graphDataSegments != null && this.props.graphDataSegments.size === 0
    const columnTitle = this.props.reducedData.get('columnTitle')
    let incidentColumnLabel = '# of Incidents'
    if (columnTitle) {
      incidentColumnLabel = this._determineDateRangeLabel(columnTitle)
    }

    let generatedRows = []
    if (this.props.reducedRows) {
      generatedRows = this._generateIncidentFrequencyTableRows(this.props.reducedRows.toJS())
    } else if (this.props.graphDataSegments) {
      generatedRows = this._generateIncidentFrequencyTableRows(this.props.graphDataSegments.toJS())
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

    const table =
      <div className='has-loading-gradient margin-top-10'>
        {graphIsEmpty ? null : <Table {...incidentFrequencyTableConfig} showLoader={this.props.isLoading} />}
      </div>

    const tableError = <div className='incident-frequency--error--table'>Could not fetch data from server - reload to try again.</div>

    return (this.props.tableError ? tableError : table)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IncidentFrequencyTable)