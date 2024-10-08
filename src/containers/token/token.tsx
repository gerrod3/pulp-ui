import { Trans, t } from '@lingui/macro';
import { Button, Card, CardBody, CardTitle } from '@patternfly/react-core';
import React, { Component } from 'react';
import { AppContext, type IAppContextType } from 'src/app-context';
import {
  AlertList,
  type AlertType,
  BaseHeader,
  CopyURL,
  EmptyStateUnauthorized,
  LoadingSpinner,
  Main,
  closeAlert,
} from 'src/components';
import { type RouteProps, withRouter } from 'src/utilities';

interface IState {
  token: string;
  alerts: AlertType[];
  loadingToken: boolean;
}

class Token extends Component<RouteProps, IState> {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      token: undefined,
      alerts: [],
      loadingToken: false,
    };
  }

  render() {
    const { token, alerts, loadingToken } = this.state;
    const unauthorized =
      !(this.context as IAppContextType).user ||
      (this.context as IAppContextType).user.is_anonymous;

    return (
      <>
        <AlertList
          alerts={alerts}
          closeAlert={(i) =>
            closeAlert(i, {
              alerts,
              setAlerts: (alerts) => this.setState({ alerts }),
            })
          }
        />
        <BaseHeader title={t`API token`} />
        <Main>
          {unauthorized ? (
            <EmptyStateUnauthorized />
          ) : (
            <Card>
              <section className='pulp-section pf-v5-c-content'>
                <CardTitle>
                  <h2>{t`API token`}</h2>
                </CardTitle>
                <CardBody>
                  <p>
                    <Trans>
                      Use this token to authenticate the{' '}
                      <code>ansible-galaxy</code> client.
                    </Trans>
                  </p>
                  {token ? (
                    <>
                      <div className='pf-v5-c-content'>
                        <Trans>
                          <b>WARNING</b> copy this token now. This is the only
                          time you will ever see it.
                        </Trans>
                      </div>
                      <div
                        style={{
                          paddingTop: 'var(--pf-v5-global--spacer--sm)',
                        }}
                      >
                        <CopyURL url={token} />
                      </div>
                    </>
                  ) : !token && !loadingToken ? (
                    <>
                      <div className='pf-v5-c-content'>
                        <Trans>
                          <b>WARNING</b> loading a new token will delete your
                          old token.
                        </Trans>
                      </div>
                      <div
                        style={{
                          paddingTop: 'var(--pf-v5-global--spacer--sm)',
                        }}
                      >
                        <Button
                          onClick={() => this.loadToken()}
                        >{t`Load token`}</Button>
                      </div>
                    </>
                  ) : (
                    <LoadingSpinner />
                  )}
                </CardBody>
              </section>
            </Card>
          )}
        </Main>
      </>
    );
  }

  private loadToken() {
    this.setState({ loadingToken: true }, () => {
      /* FIXME
      ActiveUserAPI.getToken()
        .then((result) =>
          this.setState({ token: result.data.token, loadingToken: false }),
        )
        .catch((e) => {
          const { status, statusText } = e.response;
          this.setState({
            alerts: [
              ...this.state.alerts,
              {
                variant: 'danger',
                title: t`Token could not be displayed.`,
                description: jsxErrorMessage(status, statusText),
              },
            ],
            loadingToken: false,
          });
        });
        */
    });
  }
}

export default withRouter(Token);
