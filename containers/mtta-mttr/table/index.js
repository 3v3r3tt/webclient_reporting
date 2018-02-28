import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import DownloadCSVRow from './download-csv-row'

import moment from 'moment'

import {
  Range as iRange,
  Map as iMap
} from 'immutable'

import {
  Icon,
  Table
} from '@victorops/victory'

import MmrIncidentDetailModal from 'reporting/components/modal/mmr-detail-modal'
import _transformTime from '../utilities/transformTime'

import {
  hideModal,
  showModal
} from 'reporting/actions/modal'

function mapStateToProps (state) {
  return {
    tableError: state.mttaMttr.getIn(['error', 'table']),
    orgslug: state.auth.config.get('orgslug', ''),
    data: state.mttaMttr.getIn(['table', 'data', 'incidents'], iMap({})),
    loading: state.mttaMttr.getIn(['table', 'loading'], true)
  }
}

function mapDispatchToProps (dispatch) {
  return {
    hideModal: (payload) => dispatch(hideModal(payload)),
    showModal: (payload) => dispatch(showModal(payload))
  }
}

class MttaMttrTable extends Component {
  constructor () {
    super()

    this.tableLimit = 100
    this.dataLimit = 5000
    this._generateDownloadCSVRow = this._generateDownloadCSVRow.bind(this)
  }

  _generateDownloadCSVRow () {
    return {
      id: 'incidentsSeeMore',
      columns: [{
        component: DownloadCSVRow,
        id: 'downloadCSV',
        content: {
          orgslug: this.props.orgslug,
          start: this.props.beginDate,
          end: this.props.endDate,
          team: this.props.selectedTeam
        },
        type: 'component',
        colspan: 6
      }]
    }
  }

  _transformIncidentName (name, transmog, id) {
    const transmogIconComponent = <Icon type='Transmog' />
    const transmogIcon = transmog ? transmogIconComponent : null
    return () =>
      <div className='mtta-mttr--table--incident-name'>
        {transmogIcon} [{id}] {name}
      </div>
  }

  _transformPages (pages) {
    if (pages === 1) return pages.toString() + ' page'
    else if (pages > 1) return pages.toString() + ' pages'
    else return ''
  }

  _transformReroutes (reroutes) {
    if (reroutes === 1) return reroutes.toString() + ' reroute'
    else if (reroutes > 1) return reroutes.toString() + ' reroutes'
    else return ''
  }

  _formatTimeSpacing (time) {
    while (time.length < 2) {
      time = '0' + time
    }
    return time
  }

  _splitIntoChunks (list, chunkSize = 1) {
    return iRange(0, list.count(), chunkSize)
      .map(chunkStart => list.slice(chunkStart, chunkStart + chunkSize))
  }

  _transformRows (data) {
    if (data.isEmpty()) return []
    let reducedData = data.map((incident, index) => {
      const incidentName = incident.get('incident')
      const incidentId = incident.get('id')
      const date = incident.get('date')
      const timeToAck = incident.get('time_to_ack', 0)
      const timeToRes = incident.get('time_to_res', 0)
      const pages = incident.get('pages', 0)
      const reroutes = incident.get('reroutes', 0)
      const transmog = incident.get('transmog', false)

      const formattedDate = moment(date).format('MMM. D, YYYY')
      const formattedTimeToAck = _transformTime(timeToAck, data.length)
      const formattedTimeToRes = _transformTime(timeToRes, data.length)

      const formattedPages = this._transformPages(pages)
      const formattedReroutes = this._transformReroutes(reroutes)

      const formattedIncidentName = this._transformIncidentName(incidentName, transmog, incidentId)

      return {
        id: incident.get('id'),
        key: index,
        columns: [
          {type: 'component', component: formattedIncidentName, value: incidentName},
          {type: 'cell', content: formattedDate, value: date},
          {type: 'cell', content: formattedTimeToAck, value: timeToAck},
          {type: 'cell', content: formattedTimeToRes, value: timeToRes},
          {type: 'cell', content: formattedPages, value: pages},
          {type: 'cell', content: formattedReroutes, value: reroutes}
        ]
      }
    })

    if (reducedData.size === 0) {
      return []
    } else {
      return reducedData.toJS()
    }
  }

  _rowClickFnGenerator (rowId) {
    return () => {
      this._openIncidentDetailModal(rowId)
    }
  }

  _openIncidentDetailModal (rowId) {
    const incident = this.props.data.find((x) => x.get('id') === rowId)

    if (!incident) return
    const integration = incident.get('monitoring_tool', '')
    const incidentId = rowId
    const modalTitle = `Incident #${incidentId}`
    const modalComponent =
      <MmrIncidentDetailModal
        incidentId={incidentId}
        integration={integration} />

    const modalConfig = {
      modalType: 'confirm',
      modalProps: {
        title: modalTitle,
        component: modalComponent,
        onCancel: () => this.props.hideModal(),
        modalClass: 'mtta-mttr--incident-detail--modal modal-is-scrollable',
        actionBar: false
      }
    }

    this.props.showModal(modalConfig)
  }

  render () {
    const rowItems = this._transformRows(this.props.data)
    const tooMuchData = rowItems.length > this.dataLimit
    let tableData = {
      index: 1,
      columnWidths: ['30%', '14%', '18%', '18%', '10%', '10%'],
      columnHeaders: [
        {label: 'Incidents', isSortable: !tooMuchData},
        {label: 'Date', isSortable: !tooMuchData},
        {label: 'Time to Acknowledge', isSortable: !tooMuchData},
        {label: 'Time to Resolve', isSortable: !tooMuchData},
        {label: '# Pages', isSortable: !tooMuchData},
        {label: '# Reroutes', isSortable: !tooMuchData}
      ],
      rowItems: rowItems,
      limitTo: this.tableLimit,
      generateRowClickFn: (row) => this._rowClickFnGenerator(row)
    }
    if (rowItems.length >= this.tableLimit) {
      tableData.exceededLimitToRow = this._generateDownloadCSVRow
    }

    return (
      <div>
        {(this.props.tableError)
          ? <p className='col-12 text-center padded-double-flow heading-4 text--danger'>Sorry, something went wrong, please try again</p>
          : <div className='mtta-mttr--table has-loading-gradient fade-in'>
            <ReactCSSTransitionGroup
              transitionName='mtta-mttr--transition'
              transitionAppear
              transitionAppearTimeout={500}
              transitionEnterTimeout={500}
              transitionLeaveTimeout={200}>
              <Table
                {...tableData}
                showLoader={this.props.loading} />
            </ReactCSSTransitionGroup>
          </div>
        }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MttaMttrTable)
