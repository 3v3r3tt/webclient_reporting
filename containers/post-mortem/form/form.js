import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import Victory from '@victorops/victory'
import moment from 'moment'

import {
  updatePostMortemDateRange,
  updateReportField,
  savePostMortem
} from 'reporting/actions/post-mortem'

const {
  BreadCrumbs,
  DateRangePicker
} = Victory

function mapStateToProps (state, ownProps) {
  return {
  }
}

function mapDispatchToProps (dispatch) {
  return {
    updatePostMortemDateRange: (payload) => dispatch(updatePostMortemDateRange(payload)),
    updateReportField: (payload) => dispatch(updateReportField(payload)),
    savePostMortem: (payload) => dispatch(savePostMortem(payload))
  }
}

class PostMortemForm extends React.Component {
  constructor (props) {
    super(props)

    this._beginDateChange = this._beginDateChange.bind(this)
    this._endDateChange = this._endDateChange.bind(this)
    this._isValidEndDate = this._isValidEndDate.bind(this)
    this._isValidBeginDate = this._isValidBeginDate.bind(this)
    this._saveForm = this._saveForm.bind(this)
    this._onReportTitleChange = this._onReportTitleChange.bind(this)
    this._updateCheckBox = this._updateCheckBox.bind(this)

    this.state = {
      formIsValid: false,
      requiredFields: {
        title: {
          isDirty: false,
          isValid: false,
          validation: 'required'
        },
        end: {
          isDirty: false,
          isValid: false,
          validation: 'required'
        },
        begin: {
          isDirty: false,
          isValid: false,
          validation: 'required'
        }
      }
    }
  }

  _onReportTitleChange (e) {
    this._testRequiredFields('title', e.currentTarget.value.length > 0)
    this._updateReportField({title: e.currentTarget.value})
  }

  _validateTitle () {
    return this.refs.title.value.length > 0
  }

  _validateDates () {
    const pm = this.props.postmortem
    const dates = pm.getIn(['report', 'begin'], false) && pm.getIn(['report', 'end'], false)
    return dates !== null
  }

  _validateKey (key) {
    switch (key) {
      case 'title':
        return this._validateTitle()
      case 'end':
      case 'begin':
        return this._validateDates()
    }
  }

  _testRequiredFields (key, value) {
    const field = this.state.requiredFields[key]

    this.setState({
      ...this.state,
      requiredFields: {
        ...this.state.requiredFields,
        [key]: {
          ...field,
          isDirty: value,
          isValid: this._validateKey(key)
        }
      }
    })
  }

  _updateCheckBox (e) {
    const name = e.currentTarget.name
    this._updateReportField({name: !this.props.postmortem.getIn(['report', name])})
  }

  _checkForURLQueries () {
    const location = this.props.location
    const query = location.query
    if (location.pathname.includes('new') && Object.keys(query).length > 0) {
      for (var param in query) {
        this._updateReportDateRange({[param]: this._formatQuery(param, query[param])})
      }
    }
  }

  _formatQuery (param, value) {
    switch (param) {
      case 'end':
      case 'begin':
        return parseInt(value)
      default:
        return value
    }
  }

  _validateForm () {
    const fields = this.state.requiredFields
    let formIsValid = true

    for (var field in fields) {
      if (!this._validateKey(field)) {
        formIsValid = false
      }
    }
    this.setState({
      formIsValid: formIsValid
    })

    return formIsValid
  }

  componentWillMount () {
    this._checkForURLQueries()
  }

  _endDateChange (momentDate) {
    this._testRequiredFields('end', true)
    this._updateReportDateRange({end: momentDate.valueOf()})
  }

  _beginDateChange (momentDate) {
    this._testRequiredFields('begin', true)
    this._updateReportDateRange({begin: momentDate.valueOf()})
  }

  _updateReportDateRange (formData = {}) {
    this.props.updatePostMortemDateRange(formData)
  }

  _updateReportField (formData = {}) {
    this.props.updateReportField(formData)
  }

  _saveForm (e) {
    e.preventDefault()
    if (typeof this.refs === 'undefined') return

    const formIsInValid = !this._validateForm()
    if (formIsInValid) return

    const payload = {
      'title': this.refs.title.value,
      'begin': this.props.postmortem.getIn(['report', 'begin']),
      'end': this.props.postmortem.getIn(['report', 'end']),
      'can_edit': this.refs.can_edit.checked,
      'can_delete': this.refs.can_delete.checked,
      'is_customer_impacted': this.refs.is_customer_impacted.checked
    }

    this._savePostMortem(payload)
  }

  _savePostMortem (formData = {}) {
    this.props.savePostMortem(formData)
  }

  _isValidBeginDate (current) {
    return true
  }

  _isValidEndDate (current) {
    return true
  }

  _getBreadCrumbs () {
    const orgslug = this.props.auth.config.get('orgslug', '')
    const ReportHomeLink = <Link className='link--default' to={`/reports/${orgslug}`}>Reports</Link>
    const PIRS = <Link className='link--default' to={`/reports/${orgslug}/post-mortems`}>Post Incident Review</Link>

    return (
      <BreadCrumbs breadcrumbs={[
        {label: ReportHomeLink, active: true},
        {label: PIRS, uri: '#reports/post-mortems', active: true},
        {label: this.props.postmortem.getIn(['data', 'title'], ''), active: true}
      ]} light />
    )
  }

  _getDateRangeSelector () {
    const pm = this.props.postmortem
    const beginDate = pm.getIn(['report', 'begin']) ? moment(pm.getIn(['report', 'begin'])) : 'choose start date'
    const endDate = pm.getIn(['report', 'end']) ? moment(pm.getIn(['report', 'end'])) : 'choose end date'

    return (
      <DateRangePicker
        beginDate={{
          isValidDate: this._isValidBeginDate,
          onChange: this._beginDateChange,
          value: beginDate
        }}
        endDate={{
          isValidDate: this._isValidEndDate,
          onChange: this._endDateChange,
          value: endDate
        }}
      />
    )
  }
  render () {
    const pm = this.props.postmortem
    return (
      <div>
        <div className='js-post-mortem-header post-mortem-header-wrapper'><div>
          <header className='post-mortem-header'>
            <form>
              <div id='post-mortem--header' className='post-mortem--header'>
                <div className='post-mortem--header_wrapper'>
                  <div className='row'>
                    { this._getBreadCrumbs() }
                    <div className='col-12 col-xs-12'>
                      <h1 className='post-mortem--header_text pull-left'>
                        <label htmlFor='report-title' className='post-mortem--header--title-label'>Report title</label>
                        <input onChange={this._onReportTitleChange} id='report-title' ref='title' className='post-mortem--header--title-input' placeholder='Post-Incident Review title...' name='title' type='text' maxLength='120' value={pm.getIn(['report', 'title'])} />
                      </h1>
                      <button onClick={this._saveForm} className='post-mortem--header--save-button pull-right btn btn-outline-info'>
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className='report-fields'>
                <div className='padded-double-bottom'>
                  <h2 className='post-mortem--report-summary--section-header'>Timeline start and end dates</h2>
                  { this._getDateRangeSelector() }
                  <div className='js-error-wrapper' />
                </div>
                <div rv-show='model:token' className='hidden-fade padded-double-bottom'>
                  <div rv-show='options.isOwner'>
                    <h2 className='post-mortem--report-summary--section-header'>Allow others to:</h2>
                    <ul>
                      <li>
                        <label><input type='checkbox' onChange={this._updateCheckBox} name='can_edit' ref='can_edit' checked={pm.getIn(['report', 'can_edit'])} />Edit this report</label>
                      </li>
                      <li>
                        <label><input type='checkbox' onChange={this._updateCheckBox} name='can_delete' ref='can_delete' checked={pm.getIn(['report', 'can_delete'])} />Delete this report</label>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className='hidden-fade padded-double-bottom'>
                  <h2 className='post-mortem--report-summary--section-header'>
                      Customer was impacted:
                  </h2>
                  <div className=''>
                    <div className='post-mortem--on-off col-xs-9'>
                      <div className='victory--switch'>
                        <div className='victory--switch_wrapper' >
                          <input type='checkbox' id='victory--switch' ref='is_customer_impacted' className='victory--switch_checkbox' onChange={this._updateCheckBox} name='is_customer_impacted' checked={pm.getIn(['report', 'customer_is_impacted'], false)} data-error-target='.js-error-wrapper' />
                          <label htmlFor='victory--switch' className='victory--switch_toggle'>
                            <span className='victory--switch_togglehandler' />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='hidden-fade'>
                  <h2 className='post-mortem--report-summary--section-header'>
                      Event summary (optional):
                  </h2>
                  <div className=''>
                    <textarea cols='40' rows='10' placeholder='We recommend writing this after you add notes and action items.' value={pm.getIn(['report', 'summary'], '')} ref='summary' className='post-mortem--report-summary--text-area col-xs-12' />
                  </div>
                </div>
              </div>
            </form>
          </header>
        </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PostMortemForm)
