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

    this.state = {
      tableLimit: 100
    }
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

  _transformRows (_data) {
    let reducedData
    if (_data.size) {
      const data = this._splitIntoChunks(_data, this.state.tableLimit).get(0)
      reducedData = data.map((incident, index) => {
        const incidentName = incident.get('incident')
        const incidentId = incident.get('id')
        const date = incident.get('date')
        const timeToAck = incident.get('time_to_ack', 0)
        const timeToRes = incident.get('time_to_res', 0)
        const pages = incident.get('pages', 0)
        const reroutes = incident.get('reroutes', 0)
        const transmog = incident.get('transmog', false)

        const formattedDate = moment(date).format('MMM. D, YYYY')
        const formattedTimeToAck = _transformTime(timeToAck * 60, data.length)
        const formattedTimeToRes = _transformTime(timeToRes * 60, data.length)

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
      } else if (reducedData.size >= this.state.tableLimit) {
        return reducedData.push(this._generateDownloadCSVRow()).toJS()
      } else {
        return reducedData.toJS()
      }
    }
    return []
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
    const tableData = {
      index: 1,
      columnWidths: ['30%', '10%', '15%', '15%', '15%', '15%'],
      columnHeaders: [
        {label: 'Incidents', isSortable: false},
        {label: 'Date', isSortable: false},
        {label: 'Time to Ack.', isSortable: false},
        {label: 'Time to Res.', isSortable: false},
        {label: '# Pages', isSortable: false},
        {label: '# Reroutes', isSortable: false}
      ],
      rowItems: rowItems,
      generateRowClickFn: (row) => this._rowClickFnGenerator(row)
    }

    return (
      <div className='mtta-mttr--table has-loading-gradient fade-in'>
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
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MttaMttrTable)
