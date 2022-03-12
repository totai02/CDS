/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types'
import cx from 'classnames';
import s from './Layout.css';
import { Grid, Row, Form, Button } from 'react-bootstrap';
import Modal from 'react-modal';
import SlidingPane from 'react-sliding-pane';
import { Redirect } from 'react-router-dom';

class Layout extends React.Component {
  static propTypes = {
    className: PropTypes.string,
  };

  state = {
    button1: 'default',
    button2: 'default',
    redirectToControlPanel: false,
    redirectToEditResult: false,
    isPaneOpen: false
  };

  componentDidMount() {
    if (this.props.name === 'control-panel') {
      this.setState({button1: 'primary'})
    } else if (this.props.name === 'input-result') {
      this.setState({button2: 'primary'})
    }
    Modal.setAppElement(document.getElementById('container'));
  }

  render() {
    if (this.state.redirectToControlPanel === true) {
      return <Redirect to='/admin'/>
    }
    if (this.state.redirectToEditResult === true) {
      return <Redirect to='/admin/setting'/>
    }
    return (
      <div>
        <SlidingPane
          isOpen={ this.state.isPaneOpen }
          from='left'
          title='Dashboard'
          width='250px'
          onRequestClose={ () => this.setState({ isPaneOpen: false }) }>
          <div>
            <Form>
              <Row style={{ marginBottom: 10}}>
                <Button bsStyle={this.state.button1} style={{ width: '100%', height: '50px', fontSize: '16' }} onClick={() => {this.setState({redirectToControlPanel: true})}}>Thi đấu</Button>
              </Row>
              <Row style={{ marginBottom: 10}}>
                <Button bsStyle={this.state.button2} style={{ width: '100%', height: '50px', fontSize: '16'}} onClick={() => {this.setState({redirectToEditResult: true})}}>Nhập kết quả thủ công</Button>
              </Row>
            </Form>
          </div>
        </SlidingPane>
        <section className="content">
          <Grid>
            <h2 className="text-center">Admin Control Panel</h2>
            <div style={{ marginBottom: 15 }}>
            </div>
            <div {...this.props} className={cx(s.content, this.props.className)} />
          </Grid>
        </section>
      </div>
    );
  }
}

export default Layout;
