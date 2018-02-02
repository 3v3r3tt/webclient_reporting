import React, { Component } from 'react'
import { connect } from 'react-redux'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import DownloadCSVRow from './download-csv-row'

import moment from 'moment'
import { Range, Map as iMap } from 'immutable'

import { Table } from '@victorops/victory'
import MmrIncidentDetailModal from 'reporting/components/modal/mmr-detail-modal'

import {
  hideModal,
  showModal
} from 'reporting/actions/modal'

import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { faStrikethrough } from '@fortawesome/fontawesome-pro-regular'

function mapStateToProps (state) {
  return {
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

    this._next = this._next.bind(this)
    this._prev = this._prev.bind(this)
    this.state = {
      iterator: 0,
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
          start: this.props.beginDate,
          end: this.props.endDate,
          team: this.props.selectedTeam
        },
        type: 'component',
        colspan: 6
      }]
    }
  }
  _transformIncidentName (name, transmog) {
    const transmogIconComponent = <FontAwesomeIcon icon={faStrikethrough} />
    const transmogIcon = transmog ? transmogIconComponent : null
    return () =>
      <div className='mtta-mttr--table--incident-name'>
        {transmogIcon} {name}
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

  _transformTime (time) {
    const duration = moment.duration(time, 's')
    let hours = Math.floor(duration.asHours()).toString()
    let minutes = duration.minutes().toString()
    let seconds = duration.seconds().toString()
    hours = this._formatTimeSpacing(hours)
    minutes = this._formatTimeSpacing(minutes)
    return hours + ':' + minutes + ':' + seconds
  }

  // TODO move this to a utility function globally
  _splitIntoChunks (list, chunkSize = 1) {
    return Range(0, list.count(), chunkSize)
      .map(chunkStart => list.slice(chunkStart, chunkStart + chunkSize))
  }

  _transformRows (_data) {
    let reducedData = null
    if (_data.size) {
      const data = this._splitIntoChunks(_data, this.state.tableLimit).get(this.state.iterator)
      reducedData = data.map((item, index) => {
        // TODO: these are all the keys I need to check match the API response
        //
        if (index < this.state.tableLimit) {
          const incident = item.get('incident')
          const date = item.get('date')
          const timeToAck = item.get('time_to_ack', 0)
          const timeToRes = item.get('time_to_res', 0)
          const pages = item.get('pages', 0)
          const reroutes = item.get('reroutes', 0)
          const transmog = item.get('transmog', false)

          const formattedDate = moment(date).format('MMM. D, YYYY')
          const formattedTimeToAck = this._transformTime(timeToAck)
          const formattedTimeToRes = this._transformTime(timeToRes)

          const formattedPages = this._transformPages(pages)
          const formattedReroutes = this._transformReroutes(reroutes)

          const formattedIncidentName = this._transformIncidentName(incident, transmog)

          return {
            id: item.get('id'),
            key: index,
            columns: [
              {type: 'component', component: formattedIncidentName, value: incident},
              {type: 'cell', content: formattedDate, value: date},
              {type: 'cell', content: formattedTimeToAck, value: timeToAck},
              {type: 'cell', content: formattedTimeToRes, value: timeToRes},
              {type: 'cell', content: formattedPages, value: pages},
              {type: 'cell', content: formattedReroutes, value: reroutes}
            ]
          }
        }
      })

      return reducedData.push(this._generateDownloadCSVRow())
    }
  }

  _iterate (increment) {
    const newValue = this.state.iterator + increment
    const max = Math.ceil(this.props.data.count() / this.state.tableLimit)

    if (newValue > 0 && newValue < max) {
      this.setState({
        iterator: newValue
      })
    }
  }

  _next () {
    this._iterate(1)
  }

  _prev () {
    this._iterate(-1)
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
      rowItems: rowItems ? rowItems.toJS() : [],
      generateRowClickFn: (row) => this._rowClickFnGenerator(row)
    }

    const max = Math.ceil(this.props.data.size / this.state.tableLimit) - 1

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
        <button className='btn btn-outline-primary' onClick={this._prev} disabled={this.state.iterator === 0} >Prev</button>
        <button className='btn btn-outline-primary' onClick={this._next} disabled={this.state.iterator >= max}>Next</button>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MttaMttrTable)
