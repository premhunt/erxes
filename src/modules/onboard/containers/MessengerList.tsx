import gql from 'graphql-tag';
import { Spinner } from 'modules/common/components';
import { Alert, confirm, withProps } from 'modules/common/utils';
import { mutations, queries } from 'modules/settings/integrations/graphql';
import {
  IntegrationsQueryResponse,
  RemoveMutationResponse
} from 'modules/settings/integrations/types';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { MessengerList } from '../components';

type FinalProps = {
  integrationsQuery: IntegrationsQueryResponse;
} & RemoveMutationResponse;

const MessengerListContainer = (props: FinalProps) => {
  const { integrationsQuery, removeMutation } = props;

  const messengerApps = integrationsQuery.integrations || [];

  const remove = appId => {
    confirm().then(() => {
      removeMutation({ variables: { _id: appId } })
        .then(() => {
          Alert.success('Congrats');
        })

        .catch(error => {
          Alert.error(error.reason);
        });
    });
  };

  const updatedProps = {
    ...props,
    remove,
    messengerApps
  };

  return <MessengerList {...updatedProps} />;
};

export default withProps<{}>(
  compose(
    graphql<{}, IntegrationsQueryResponse>(gql(queries.integrations), {
      name: 'integrationsQuery',
      options: () => {
        return {
          notifyOnNetworkStatusChange: true,
          variables: {
            kind: 'messenger'
          },
          fetchPolicy: 'network-only'
        };
      }
    }),
    graphql<{}, RemoveMutationResponse>(gql(mutations.integrationsRemove), {
      name: 'removeMutation',
      options: () => {
        return {
          refetchQueries: [
            {
              query: gql(queries.integrations),
              variables: {
                kind: 'messenger'
              }
            },
            {
              query: gql(queries.integrationTotalCount)
            }
          ]
        };
      }
    })
  )(MessengerListContainer)
);
