import gql from 'graphql-tag';
import { ManageIntegrations } from 'modules/settings/integrations/components/common';
import { queries } from 'modules/settings/integrations/graphql';
import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';

type State = {
  perPage: number
};

class ManageIntegrationsContainer extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { perPage: 20 };
  }

  render() {
    const { allIntegrationsQuery, save } = this.props;

    const search = (value, loadmore) => {
      if (!loadmore) {
        this.setState({ perPage: 0 });
      }

      this.setState({ perPage: this.state.perPage + 20 }, () => {
        allIntegrationsQuery.refetch({
          searchValue: value,
          perPage: this.state.perPage
        });
      });
    };

    const clearState = () => {
      allIntegrationsQuery.refetch({ searchValue: '' });
    };

    const updatedProps = {
      ...this.props,
      search,
      save,
      clearState,
      perPage: this.state.perPage,
      allIntegrations: allIntegrationsQuery.integrations || []
    };

    return <ManageIntegrations {...updatedProps} />;
  }
}

type Props = {
  current: any,
  allIntegrationsQuery: any,
  save: () => void
};

export default compose(
  graphql(gql(queries.integrations), {
    name: 'allIntegrationsQuery',
    options: {
      variables: {
        perPage: 20
      }
    }
  })
)(ManageIntegrationsContainer);