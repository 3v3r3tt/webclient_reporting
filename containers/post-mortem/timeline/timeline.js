import React, {
  Component
} from 'react'

import {
  AutoSizer,
  CellMeasurerCache,
  List as VirtualizedList
} from 'react-virtualized'

import {
  connect
} from 'react-redux'

import {
  Map
} from 'immutable'

import {
  compose,
  withState,
  withHandlers
} from 'recompose'

import {
  flushTimelineMessages,
  requestAlertDetails,
  showNewTimelineMessages,
  requestTimelineMessages
} from 'components/store/actions'

import {
  getAlertDetails,
  getBackboneContainerRendered,
  getBackboneTimelineContainerActive,
  makeGetTimelineEndOfHistory,
  getTimelineFilters,
  makeGetNewTimelineMessageCount,
  makeGetTimelineMessages,
  makeGetShowNewTimelineMessages
} from 'components/store/selectors'

// helpers
import getFilteredMessages from 'components/timeline/helpers/get-filtered-messages'

import {
  getRowRenderer
} from 'components/timeline/components'

import vent from 'util/vent'

const makeMapStateToProps = (state, ownProps) => {
  const newMessageCount = makeGetNewTimelineMessageCount(ownProps.roomId)
  const shouldShowNewMessages = makeGetShowNewTimelineMessages(ownProps.roomId)
  const getTimelineMessages = makeGetTimelineMessages(ownProps.roomId)
  const checkForEndOfHistory = makeGetTimelineEndOfHistory(ownProps.roomId)

  return function mapStateToProps (state, ownProps) {
    const showBlankSlate = checkForEndOfHistory(state)
    const canFilter = ownProps.disableFilters || ownProps.disableInfiniteScroll
    const filters = getTimelineFilters(state)
    const messageState = getTimelineMessages(state)
    const lastSequence = messageState.size > 0 ? messageState.last().get('sequence') : 0

    const loadingComponentMessage = Map({
      sequence: lastSequence + 0.11,
      eventType: 'progressLoader'
    })

    const endOfHistoryMessage = Map({
      componentProps: Map({
        displayMessage: 'You have reached the end of your history',
        eventType: 'chat'
      }),
      IS_ROBOT: true,
      sequence: lastSequence + 0.11,
      USER_ID: 'victorops'
    })

    const finalMessage = showBlankSlate ? endOfHistoryMessage : loadingComponentMessage
    const unfilteredMessages = ownProps.disableInfiniteScroll ? messageState : messageState.push(finalMessage)

    return {
      alertData: getAlertDetails(state),
      backBoneContainerRendered: getBackboneContainerRendered(state),
      blankSlate: showBlankSlate,
      filters: filters,
      isActive: !ownProps.isPrimary || (ownProps.isPrimary && getBackboneTimelineContainerActive(state)),
      lastMessageSequence: lastSequence,
      messages: canFilter ? unfilteredMessages : getFilteredMessages(unfilteredMessages, filters),
      newMessageCount: newMessageCount(state),
      showNewMessages: shouldShowNewMessages(state)
    }
  }
}

function mapDispatchToProps (dispatch, ownProps) {
  const requestDetails = (uuid) => {
    const onExpand = ownProps.expandCard(uuid)

    return () => {
      dispatch(requestAlertDetails(uuid))
      onExpand()
    }
  }

  return {
    makeGetAlertDetails: requestDetails,
    flushMessages: (roomId) => dispatch(flushTimelineMessages(roomId)),
    requestHistoryTo: (lastSequence, roomId) => dispatch(requestTimelineMessages({sequence: lastSequence, room: roomId})),
    setShowNewMessages: (shouldShow) => dispatch(showNewTimelineMessages({roomId: ownProps.roomId, shouldShowNewMessages: shouldShow}))
  }
}

class Timeline extends Component {
  constructor (props) {
    super(props)

    this.state = {
      cellMeasurerCache: new CellMeasurerCache({
        defaultHeight: 64,
        fixedWidth: true
      }),
      scrollToIndex: undefined
    }

    this.onScroll = this.onScroll.bind(this)
    this.flushMessagesAndResetScroll = this.flushMessagesAndResetScroll.bind(this)
  }

  componentDidMount () {
    vent.trigger('timeline:initialized')
  }

  componentWillReceiveProps (nextProps) {
    const {
      disableInfiniteScroll,
      lastMessageSequence,
      messages
    } = this.props

    this.state.cellMeasurerCache.clearAll()

    if (!lastMessageSequence) {
      return
    }

    // TODO: this will should away as soon as we rewrite the filters and lean on server-side
    // Load more items if we don't have a full payload after loading or filtering
    if (!disableInfiniteScroll && messages.size < 25 && !(messages.size < nextProps.messages.size)) {
      return this.props.requestHistoryTo(lastMessageSequence, this.props.roomId)
    }
  }

  onScroll ({clientHeight, scrollHeight, scrollTop}) {
    if (scrollTop !== 0) {
      if (!this.props.isScrolled) this.props.calculateScrollTop(!this.props.isScrolled)
      if (this.props.showNewMessages) this.props.setShowNewMessages(false)
    } else if (scrollTop === 0) {
      if (this.props.isScrolled) this.props.calculateScrollTop(!this.props.isScrolled)
      if (this.props.newMessageCount > 0) this.props.flushMessages(this.props.roomId)
      this.setState({scrollToIndex: undefined})
      this.props.setShowNewMessages(true)
    }

    if (!this.props.lastMessageSequence) {
      return
    }

    if (!this.props.disableInfiniteScroll && ((scrollTop + clientHeight + 200) >= scrollHeight)) {
      this.props.requestHistoryTo(this.props.lastMessageSequence, this.props.roomId)
    }
  }

  flushMessagesAndResetScroll () {
    this.props.flushMessages(this.props.roomId)
    this.setState({scrollToIndex: 0})
  }

  render () {
    const {
      alertData,
      expandCard,
      expandedCards,
      isActive,
      makeGetAlertDetails,
      messages
    } = this.props

    const {
      cellMeasurerCache,
      scrollToIndex
    } = this.state

    return (
      <div className='react-timeline js-timeline-anchor timeline-anchor l-scrollable' ref={(el) => { this.containerRef = el }}>
        <div className='js-timeline timeline'>
          { isActive
            ? <AutoSizer>
              {({height, width}) => {
                return (
                  <VirtualizedList
                    className='react-timeline-list'
                    deferredMeasurementCache={cellMeasurerCache}
                    height={10000}
                    onScroll={this.onScroll}
                    rowCount={messages.count()}
                    rowHeight={cellMeasurerCache.rowHeight}
                    rowRenderer={getRowRenderer(cellMeasurerCache, messages, makeGetAlertDetails, alertData, expandCard, expandedCards)}
                    scrollToIndex={scrollToIndex}
                    width={width}
                  />
                )
              }}
            </AutoSizer>
            : null
          }
        </div>
      </div>
    )
  }
}

const enhance = compose(
  withState('isScrolled', 'setIsScrolled', false),
  withState('expandedCards', 'setCardIsExpanded', Map()),
  withHandlers({
    calculateScrollTop: function ({ setIsScrolled }) { return (isScrolled) => setIsScrolled(isScrolled) },
    expandCard: ({ setCardIsExpanded }) => (cardId) => (expandedCards) => {
      setCardIsExpanded(expandedCards => expandedCards.set(cardId, !expandedCards.get(cardId, false)))
    }
  })
)

const TimelineState = connect(makeMapStateToProps, mapDispatchToProps)(Timeline)

export default enhance(TimelineState)
