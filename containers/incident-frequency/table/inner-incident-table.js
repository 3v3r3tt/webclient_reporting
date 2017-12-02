import React, { Component } from 'react'
import Victory from '@victorops/victory'

import moment from 'moment'

import InnerIncidentModal from './inner-incident-modal'

const {
  ExpandingCard,
  Table
} = Victory

class IncidentFrequencyTable extends Component {
  constructor (props) {
    super(props)

    this._setExpanded = this._setExpanded.bind(this)
    this._generateInnerIncidentRows = this._generateInnerIncidentRows.bind(this)
    this._rowClickFnGenerator = this._rowClickFnGenerator.bind(this)
  }

  _setExpanded () {
    const lastSelectedRow = this.props.innerTableIncidentData ? this.props.innerTableIncidentData.get('segment') : null
    if (this.props.name !== lastSelectedRow) {
      this.props.getInnerTableData({segmentName: this.props.name})
    } else {
      this.props.resetInnerTableData()
    }
  }

  _generateInnerIncidentRows (incidents) {
    if (!incidents) return []
    const generatedRows = incidents.map((rowItem, index) => {
      return ({
        id: rowItem.incident,
        key: index,
        columns: [{
          id: 'incident',
          type: 'cell',
          content: rowItem.incident,
          value: rowItem.incident
        }, {
          id: 'date',
          type: 'cell',
          content: moment(rowItem.date).format('MMM. D, YYYY'),
          value: rowItem.date
        }, {
          id: 'service',
          type: 'cell',
          content: rowItem.service,
          value: rowItem.service
        }, {
          id: 'host',
          type: 'cell',
          content: rowItem.host,
          value: rowItem.host
        }, {
          id: 'integration',
          type: 'cell',
          content: rowItem.monitoring_tool,
          value: rowItem.monitoring_tool
        }, {
          id: 'team',
          type: 'cell',
          content: Array.isArray(rowItem.teams) ? rowItem.teams.join(',') : '',
          value: Array.isArray(rowItem.teams) ? rowItem.teams.join(',') : ''
        }]
      })
    })
    return generatedRows
  }

  _rowClickFnGenerator (rowId) {
    return () => {
      this._openIncidentDetailModal(rowId)
    }
  }

  _openIncidentDetailModal (rowId) {
    const incidentId = rowId.match(/^\[#(.*)\]/) && rowId.match(/^\[#(.*)\]/)[1]
    const modalConfig = {
      modalType: 'confirm',
      modalProps: {
        title: `Incident #${incidentId}`,
        component: <InnerIncidentModal />,
        onCancel: () => this.props.hideModal(),
        cancelButtonText: 'OK'
      }
    }
    this.props.showModal(modalConfig)
  }

  render () {
    let currentSegment = null
    let innerIncidents = null
    if (this.props.innerTableIncidentData) {
      currentSegment = this.props.innerTableIncidentData.get('segment')
      innerIncidents = this.props.innerTableIncidentData.get('incidents').toJS()
    }

    const CollapsedContent =
      <div className='row' onClick={this._setExpanded}>
        <div className='col-8 margin-bottom-20'>
          <span className='incident-frequency--inner-incident-table--card-header'>
            <i className='fa fa-sm fa-circle margin-right-10' style={{color: `${this.props.colorList[this.props.outerTableIndex]}`}} />
            {this.props.name}
          </span>
        </div>
        <div className='col-4'>
          <span className='pull-right incident-frequency--inner-incident-table--card-header'>{this.props.bucketTotal}</span>
        </div>
      </div>

    const innerIncidentTableConfig = {
      columnHeaders: [
        {
          label: 'Incidents',
          isSortable: true
        },
        {
          label: 'Date',
          isSortable: true
        },
        {
          label: 'Service',
          isSortable: true
        },
        {
          label: 'Host',
          isSortable: true
        },
        {
          label: 'Integration',
          isSortable: true
        },
        {
          label: 'Team',
          isSortable: true
        }],
      rowItems: this._generateInnerIncidentRows(innerIncidents),
      customClasses: ['incident-frequency--inner-incident-table'],
      columnWidths: ['20%', '15%', '20%', '15%', '15%', '15%'],
      generateRowClickFn: this._rowClickFnGenerator
    }

    const ExpandedContent =
      <div className='row'>
        <div className='col-8 margin-bottom-20'>
          <span className='incident-frequency--inner-incident-table--card-header'>
            <i className='fa fa-sm fa-circle margin-right-10' style={{color: `${this.props.colorList[this.props.outerTableIndex]}`}} />
            {this.props.name}
          </span>
        </div>
        <div className='col-4'>
          <span className='pull-right'>{this.props.bucketTotal}</span>
        </div>

        <div className='col-12'>
          <Table {...innerIncidentTableConfig} />
        </div>
      </div>

    return (
      <ExpandingCard
        headerComponent={CollapsedContent}
        contentComponent={ExpandedContent}
        handleClick={this._setExpanded}
        isExpanded={currentSegment === this.props.name}
      />
    )
  }
}

export default IncidentFrequencyTable
