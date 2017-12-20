import React, { Component } from 'react'
import Victory from '@victorops/victory'

import moment from 'moment'

import InnerIncidentModal from './inner-incident-modal'
import DownloadCSVRow from './download-csv-row'

const {
  ExpandingCard,
  Table
} = Victory

const INCIDENT_FREQUENCY_LIMIT = 100

class IncidentFrequencyTable extends Component {
  constructor (props) {
    super(props)

    this.state = {
      isExpanded: false
    }
    this._setExpanded = this._setExpanded.bind(this)
    this._generateInnerIncidentRows = this._generateInnerIncidentRows.bind(this)
    this._rowClickFnGenerator = this._rowClickFnGenerator.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.name !== nextProps.innerTableIncidentSegment && this.state.isExpanded) {
      this._toggleExpansion()
    }
  }

  _toggleExpansion () {
    this.setState({
      isExpanded: !this.state.isExpanded
    })
  }

  _setExpanded () {
    this._toggleExpansion()
    if (this.props.name !== this.props.innerTableIncidentSegment) {
      this.props.getInnerTableData({segmentName: this.props.name})
    } else {
      this.props.resetInnerTableData()
    }
  }

  _generateDownloadCSVRow () {
    return {
      id: 'incidentsSeeMore',
      columns: [{
        component: DownloadCSVRow,
        id: 'downloadCSV',
        content: {
          start: this.props.beginDate,
          end: this.props.endDate,
          team: this.props.selectedTeam
        },
        type: 'component',
        colspan: 6
      }]
    }
  }

  _generateInnerIncidentRows (incidents) {
    if (!incidents) return []
    let generatedRows = []
    incidents.forEach((rowItem, index) => {
      if (index < INCIDENT_FREQUENCY_LIMIT) {
        generatedRows.push({
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
            content: moment(rowItem.start_time).format('MMM. D, YYYY'),
            value: rowItem.start_time
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
      } else if (index === INCIDENT_FREQUENCY_LIMIT) {
        generatedRows.push(this._generateDownloadCSVRow())
      }
    })

    return generatedRows
  }

  _rowClickFnGenerator (rowId) {
    return () => {
      // TODO: Once IFR Modal Endpoint is finished
      // this._openIncidentDetailModal(rowId)
    }
  }

  _openIncidentDetailModal (rowId) {
    // const incidentId = rowId.match(/^\[#(.*)\]/) && rowId.match(/^\[#(.*)\]/)[1]
    const title = `Incident #12345`

    const modalConfig = {
      modalType: 'confirm',
      modalProps: {
        title: title,
        component: <InnerIncidentModal />,
        onCancel: () => this.props.hideModal(),
        cancelButtonText: 'OK'
      }
    }
    this.props.showModal(modalConfig)
  }

  render () {
    let innerIncidents = this.props.innerTableIncidentIncidents ? this.props.innerTableIncidentIncidents.toJS() : null

    const CollapsedContent =
      <div className='row hoverable top-row' onClick={this._setExpanded}>
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

    const generatedRows = this._generateInnerIncidentRows(innerIncidents)
    const csvRowClass = generatedRows.length > INCIDENT_FREQUENCY_LIMIT ? ['incident-frequency--too-many-rows-table'] : ''
    const innerIncidentTableConfig = {
      columnHeaders: [
        {
          label: 'Incident',
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
      rowItems: generatedRows,
      customClasses: ['incident-frequency--inner-incident-table', csvRowClass],
      columnWidths: ['20%', '15%', '20%', '15%', '15%', '15%'],
      generateRowClickFn: this._rowClickFnGenerator
    }

    const ExpandedContent =
      <div>
        <div className='row hoverable top-row' onClick={this._setExpanded}>
          <div className='col-8 margin-bottom-20'>
            <span className='incident-frequency--inner-incident-table--card-header'>
              <i className='fa fa-sm fa-circle margin-right-10' style={{color: `${this.props.colorList[this.props.outerTableIndex]}`}} />
              {this.props.name}
            </span>
          </div>
          <div className='col-4'>
            <span className='pull-right'>{this.props.bucketTotal}</span>
          </div>
        </div>
        <div className='row'>
          <div className='col-12'>
            <Table
              {...innerIncidentTableConfig}
              showLoader={this.props.loadingTableData}
            />
          </div>
        </div>
      </div>

    return (
      <ExpandingCard
        headerComponent={CollapsedContent}
        contentComponent={ExpandedContent}
        handleClick={this._setExpanded}
        isExpanded={this.state.isExpanded}
      />
    )
  }
}

export default IncidentFrequencyTable
