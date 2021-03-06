import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import InnerTable from './inner-incident-table'

import {
  incidentFrequencyTableGet,
  incidentFrequencyInnerTableReset
} from 'reporting/actions/incident-frequency'

import {
  hideModal,
  showModal
} from 'reporting/actions/modal'

import { Table } from '@victorops/victory'

function mapStateToProps (state) {
  return {
    reducedData: state.incidentFrequency.get('reducedData'),
    reducedRows: state.incidentFrequency.getIn(['reducedData', 'reducedRows']),
    innerTableIncidentSegment: state.incidentFrequency.getIn(['innerTableIncidentData', 'segment'], ''),
    innerTableIncidentIncidents: state.incidentFrequency.getIn(['innerTableIncidentData', 'incidents']),
    resolutionType: state.incidentFrequency.get('resolutionType'),
    segmentationLabel: state.incidentFrequency.getIn(['segmentationType', 'label']),
    tableError: state.incidentFrequency.getIn(['error', 'table']),
    loadingTableData: state.incidentFrequency.get('loadingTableData', false),
    graphError: state.incidentFrequency.getIn(['error', 'graph']),
    graphDataSegments: state.incidentFrequency.getIn(['graphData', 'segments']),
    selectedTeam: state.incidentFrequency.get('selectedTeam'),
    beginDate: state.incidentFrequency.get('beginDate'),
    endDate: state.incidentFrequency.get('endDate')
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
  _tableDataSorter (a, b) {
    if (a.id === 'other') return 1 // other bucket always sort to bottom
    if (b.id === 'other') return -1
    if (a.columns[0].value > b.columns[0].value) return -1
    if (a.columns[0].value < b.columns[0].value) return 1
    return 0
  }

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
            bucketTotal: Math.floor(segment.total_incidents),
            getInnerTableData: this.props.getTableData,
            resetInnerTableData: this.props.resetTableData,
            innerTableIncidentSegment: this.props.innerTableIncidentSegment,
            innerTableIncidentIncidents: this.props.innerTableIncidentIncidents,
            colorList: this.props.colorList,
            outerTableIndex: index,
            showModal: this.props.showModal,
            hideModal: this.props.hideModal,
            loadingTableData: this.props.loadingTableData,
            CSV_SIZE_WARNING_LIMIT: this.props.CSV_SIZE_WARNING_LIMIT,
            totalIncidents: this.props.totalIncidents,
            beginDate: this.props.beginDate,
            endDate: this.props.endDate,
            selectedTeam: this.props.selectedTeam
          },
          value: Math.floor(segment.total_incidents)
        }]
      })
    })
    return generatedRows.sort(this._tableDataSorter)
  }

  render () {
    const graphIsEmpty = this.props.graphDataSegments != null && this.props.graphDataSegments.size === 0
    if (this.props.graphError || graphIsEmpty || this.props.graphIsEmpty) return null

    if (this.props.tableError) {
      return (
        <div className='incident-frequency--error--table'>
          Could not fetch data from server - reload to try again.
        </div>
      )
    }

    const columnTitle = this.props.reducedData.get('columnTitle')
    let incidentColumnLabel = '# of Incidents'
    if (columnTitle) {
      incidentColumnLabel = `# of Incidents (${columnTitle})`
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
          <span>{this.props.segmentationLabel}</span>
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

    const transitionKey = this.props.reducedData.get('reducedStart', 0)

    return (
      <div className='has-loading-gradient fade-in margin-top-10 incident-frequency--table-container' key={this.props.key}>
        <ReactCSSTransitionGroup
          transitionName='incident-frequency--transition'
          transitionAppear
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={200}>
          <Table
            {...incidentFrequencyTableConfig}
            key={transitionKey}
          />
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(IncidentFrequencyTable)
