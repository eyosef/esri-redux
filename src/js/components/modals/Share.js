import { toggleShareModal } from 'js/actions/mapActions';
import Wrapper from 'js/components/modals/Wrapper';
import React, { Component } from 'react';
import appStore from 'js/appStore';

export default class ShareModal extends Component {
  // displayName: 'ShareModal';

  close = () => {
    appStore.dispatch(toggleShareModal({ visible: false }));
  };

  render () {
    let { visible } = this.props;

    return (
      <Wrapper theme='share-modal' visible={visible} close={this.close}>
        <h3>Share Something</h3>
      </Wrapper>
    );
  }
}
