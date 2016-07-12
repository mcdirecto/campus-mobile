'use strict'

import React from 'react'
import {
	View,
  ListView,
	Text,
	TouchableHighlight,
} from 'react-native';
import EventService from '../../services/eventService'
import Card from '../card/Card'
import EventList from './EventList'

var css = require('../../styles/css');
var logger = 			require('../../util/logger');

export default class EventCard extends React.Component {

  constructor(props) {
    super(props);

    this.fetchEventsErrorInterval =  15 * 1000;			// Retry every 15 seconds
		this.fetchEventsErrorLimit = 3;
  	this.fetchEventsErrorCounter = 0;

    this.state = {
      eventsData: [],
      eventsRenderAllRows: false,
			eventsDataLoaded: false,
      fetchEventsErrorLimitReached: false,
			eventsDefaultResults: 3
    }
  }

	componentDidMount() {
		this.refresh();
	}

  refresh() {
		var that = this;
    EventService.FetchEvents()
			.then((responseData) => {
				this.setState({
					eventsData: responseData,
					eventsDataLoaded: true
				});
			})
			.catch((error) => {
				logger.error(error);
				if (that.fetchEventsErrorLimit > that.fetchEventsErrorCounter) {
					that.fetchEventsErrorCounter++;
					logger.custom('ERR: fetchEvents1: refreshing again in ' + that.fetchEventsErrorInterval/1000 + ' sec');
					that.refreshEventsTimer = setTimeout( () => { that.refresh() }, that.fetchEventsErrorInterval);
				} else {
					logger.custom('ERR: fetchEvents2: Limit exceeded - max limit:' + that.fetchEventsErrorLimit);
					that.setState({ fetchEventsErrorLimitReached: true });
				}
			})
			.done();
	}

  render() {
    return (
			<Card title='Events'>
        <View style={css.events_list}>
					{this.state.eventsDataLoaded ? (
						<EventList data={this.state.eventData} />
					) : null}

          {this.state.fetchEventsErrorLimitReached ? (
            <View style={[css.flexcenter, css.pad40]}>
              <Text>There was a problem loading Student Events</Text>
            </View>
          ) : null }
					</View>
					</Card>
      );
    }
  }
