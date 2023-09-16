import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import {
  Input, Loading, Row, Text, Spacer, Button, Divider, Grid, Card
} from "@nextui-org/react";
import cookie from "react-cookies";
import { API_HOST } from "../../config/settings";

function Integrations(props) {

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    handleSubmit()
  }, []);

  const handleSubmit = () => {
    if (!cookie.load("brewToken")) {
      return new Promise((resolve, reject) => reject(new Error("No Token")));
    }
    const token = cookie.load("brewToken");
    const url = `${API_HOST}/project/recommendations/suggest/`;
    const method = "GET";
    const headers = new Headers({
      "Accept": "application/json",
      "authorization": `Bearer ${token}`,
    });

    fetch(url, { method, headers })
      .then((response) => {
        console.log(response)
        response.json().then((res) => {
          console.log(res)
          setMessages(res)
        });
      });
  };

  return (
    <Grid.Container gap={2}>
      {messages.map((c) => {
        return (
          <>
            <Grid.Container>
              <Grid xs={12} md={8}>
                <Card
                  variant="bordered"
                  isPressable
                  isHoverable
                >
                  <Card.Body css={{ p: 0 }}>
                    <Grid.Container>
                      <Grid xs={12} sm={9} css={{ px: 20, py: 20 }} direction="column">
                        <Text h4 css={{ py: 5 }}>
                          {c.title}
                        </Text>
                        <Text>
                          {c.description}
                        </Text>
                        <Spacer y={0.5} />
                      </Grid>
                    </Grid.Container>
                  </Card.Body>
                </Card>
                <Spacer />
              </Grid>
              <Spacer />
            </Grid.Container>
            <Spacer />
          </>
        );
      })}
    </Grid.Container>
  )
}

Integrations.propTypes = {
  integrations: PropTypes.arrayOf(PropTypes.object).isRequired,
  getTeamIntegrations: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  integrations: state.integration.data,
});

const mapDispatchToProps = (dispatch) => ({
  getTeamIntegrations: (teamId) => dispatch(getTeamIntegrationsAction(teamId)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Integrations));
