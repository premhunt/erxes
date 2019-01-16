import gql from 'graphql-tag';
import { Alert, withProps } from 'modules/common/utils';
import { BrandsQueryResponse } from 'modules/settings/brands/types';
import { mutations, queries } from 'modules/settings/integrations/graphql';
import {
  IntegrationsCountQueryResponse,
  SaveMessengerMutationResponse,
  SaveMessengerMutationVariables
} from 'modules/settings/integrations/types';
import * as React from 'react';
import { ChildProps, compose, graphql } from 'react-apollo';
import { MessengerAdd } from '../components';

type Props = { queryParams: any };

type FinalProps = {
  brandsQuery: BrandsQueryResponse;
  totalCountQuery: IntegrationsCountQueryResponse;
} & Props &
  SaveMessengerMutationResponse;

const MessengerAddContainer = (props: ChildProps<FinalProps>) => {
  const { brandsQuery, saveMessengerMutation, totalCountQuery } = props;

  let totalCount = 0;

  if (!totalCountQuery.loading) {
    totalCount = totalCountQuery.integrationsTotalCount.byKind.messenger;
  }

  const brands = brandsQuery.brands || [];

  const save = (doc, callback: () => void) => {
    const { name, brandId, languageCode } = doc;

    if (!languageCode) {
      return Alert.error('Set language');
    }

    if (!brandId) {
      return Alert.error('Choose brand');
    }

    saveMessengerMutation({
      variables: { name, brandId, languageCode }
    })
      .then(() => {
        Alert.success('Successfully saved.');
        callback();
      })
      .catch(error => {
        Alert.error(error.message);
      });
  };

  const updatedProps = {
    ...props,
    brands,
    save,
    totalCount
  };

  return <MessengerAdd {...updatedProps} />;
};

export default withProps<Props>(
  compose(
    graphql<
      Props,
      SaveMessengerMutationResponse,
      SaveMessengerMutationVariables
    >(gql(mutations.integrationsCreateMessenger), {
      name: 'saveMessengerMutation'
    }),
    graphql<Props, BrandsQueryResponse>(gql(queries.brands), {
      name: 'brandsQuery',
      options: () => ({
        fetchPolicy: 'network-only'
      })
    }),
    graphql(gql(queries.integrationTotalCount), { name: 'totalCountQuery' })
  )(MessengerAddContainer)
);
