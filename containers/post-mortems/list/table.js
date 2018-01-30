import React from 'react'
import Victory from '@victorops/victory'
import ListCTAs from './action-buttons'
import moment from 'vendor/moment'
import { Link, browserHistory } from 'react-router'
import { unescape } from 'components/__utils/format'

const {
  Table
} = Victory

class PostMortems extends React.Component {
  constructor () {
    super()

    this._rowClickFnGenerator = this._rowClickFnGenerator.bind(this)
  }

  _rowClickFnGenerator (rowId) {
    return () => {
      browserHistory.push(`/reports/${this.props.orgslug}/post-mortem/${rowId}`)
    }
  }

  _formatTime (report) {
    let begin = report.get('begin', false)
    let end = report.get('end', false)

    if (!(begin && end)) { return }

    begin = moment(begin)
    end = moment(end)

    if (begin.isSame(end, 'day')) {
      return begin.format('MMM Do YYYY, h:mm a \u2014 ') + end.format('h:mm a')
    } else {
      return begin.format('MMM Do YYYY, h:mm a \u2014 ') + end.format('MMM Do YYYY, h:mm a')
    }
  }

  _getFullname (user) {
    return user.get('firstName', '') + user.get('lastName', '')
  }

  _generateOnCallRows () {
    const reports = this.props.postmortems
    const users = this.props.users
    const generatedRows = reports.map((report, index) => {
      const owner = users.find((user) => user.get('username') === report.get('owner'))
      const userName = (owner) ? this._getFullname(owner) : report.get('owner', '')

      return ({
        id: report.get('token', 12312),
        key: index,
        columns: [{
          content: unescape(report.get('title', 'Unnamed Report')),
          value: report.get('title'),
          id: 'title',
          type: 'cell'
        },
        {
          content: this._formatTime(report),
          value: 2,
          id: 'date',
          type: 'cell'
        },
        {
          content: unescape(userName),
          value: report.get('owner'),
          id: 'created-by',
          type: 'cell'
        },
        {
          component: ListCTAs,
          content: {
            orgslug: this.props.orgslug,
            model: report,
            collection: reports,
            ...report.toJSON()
          },
          value: '',
          id: 'pm-reports--actions',
          type: 'component'
        }
        ]
      })
    })

    console.log('generated', generatedRows.toJS())
    return generatedRows.toJSON()
  }

  _getDescription () {
    return (
      <div>
        { (!this.props.postmortems.size && !this.props.showLoader)
          ? <div className='padded post-mortems--list-placeholder'>
            <div className='col-xs-12 col-12 text-center margin-10'>
              <h1>Create your first Post-Incident Review</h1>
            </div>
            <div className='col-xs-12 col-12 text-center'>
              <img src='/public/img/pm-reports-blank-state-art.svg' title='Post-Incident Review Placeholder' />
            </div>
            <div className='col-xs-12 col-12 text-center margin-10'>
              <p>Create a post-incident review to analyze timeline activity for a specific period and review how your team responded. <a href='https://help.victorops.com/knowledge-base/post-incident-review/' target='_blank'>Learn more.</a></p>
            </div>
            <div className='col-xs-12 col-12 text-center margin-bottom-20'>
              <Link to={`/reports/${this.props.orgslug}/post-mortem/new`} className='btn btn-lg btn-outline-info'>Create Post-Incident Review</Link>
            </div>
          </div>
        : <div>
          <div className='page-intro'>
            <Link to={`/reports/${this.props.orgslug}/post-mortem/new`} className='padded-flow button-add pull-right'><span className='padded-right'><i className='fas fa-plus' /></span> New Report</Link>
            <p>
                Create a post-incident review to analyze timeline activity for a specific period and review how your team responded. <a href='https://help.victorops.com/knowledge-base/post-incident-review/' target='_blank'>Learn more.</a>
            </p>
          </div>

          <div>
            <div className='ui-mask' />
            <div className='js-post-mortems-list' />
          </div>
        </div>
      }
      </div>
    )
  }

  render () {
    const generatedRows = this.props.postmortems.size ? this._generateOnCallRows() : []

    const tableConfig = {
      columnHeaders: [
        {
          label: 'Title',
          isSortable: true
        },
        {
          label: 'Time Range',
          isSortable: true
        },
        {
          label: 'Created By',
          isSortable: true
        },
        {
          label: '',
          isSortable: false
        }
      ],
      columnWidths: ['20%', '40%', '30%', '10%'],
      loaderRowHeight: 42,
      rowItems: generatedRows,
      generateRowClickFn: this._rowClickFnGenerator
    }

    return (
      <div className='post-mortem--table' id='post-mortem--table'>
        <div className='post-mortem--list'>
          <header>
            <nav className='js-admin-nav admin-nav'>
              <div className='js-subheader tab-title'>
                <h3 className='tab-title--header padded-flow'>Reports</h3>
                <p className='tab-title--paragraph padded-flow'>Create and view reports.</p>
              </div>
            </nav>
          </header>
        </div>
        { this._getDescription() }

        { (this.props.postmortems.size)
          ? <div className='has-loading-gradient'>
            <Table showLoader={this.props.showLoader} customClasses={['rows--have_hover']} {...tableConfig} />
          </div>
          : null
        }
      </div>
    )
  }
}

export default PostMortems
