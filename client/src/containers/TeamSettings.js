import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import {
  Container, Input, Checkbox, Loading, Row, Text, Spacer, Button, Divider, Grid, Card
} from "@nextui-org/react";

import { getTeam, updateTeam } from "../actions/team";
import { cleanErrors as cleanErrorsAction } from "../actions/error";
import Chatbox from "../components/Chat"

/*
  Contains team update functionality
*/
function TeamSettings(props) {
  const {
    team, getTeam, match, cleanErrors, style, updateTeam,
  } = props;

  const [loading, setLoading] = useState(false);
  const [teamState, setTeamState] = useState({ name: "" });
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  useEffect(() => {
    cleanErrors();
    getTeam(match.params.teamId)
      .then((teamData) => {
        setTeamState({ name: teamData.name });
      });
  }, []);

  const _onTeamUpdate = () => {
    setSubmitError(false);
    setLoading(true);
    setSuccess(false);

    updateTeam(team.id, teamState)
      .then(() => {
        setSuccess(true);
        setLoading(false);
      })
      .catch(() => {
        setSubmitError(true);
        setLoading(false);
      });
  };

  if (!team) {
    return (
      <Container css={{ pt: 50 }} justify="center">
        <Row justify="center" align="center">
          <Loading type="spinner" size="lg" />
        </Row>
      </Container>
    );
  }

  return (
    <div style={style}>
      <Container>
        <Row>
          <Text h3>Understand your data & improve your dashboard!</Text>
        </Row>
        <Spacer y={1} />
        <Row>
          <Chatbox />
        </Row>

      </Container>
      
    </div>
  );
}

TeamSettings.defaultProps = {
  style: {},
};

TeamSettings.propTypes = {
  getTeam: PropTypes.func.isRequired,
  team: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  updateTeam: PropTypes.func.isRequired,
  style: PropTypes.object,
  cleanErrors: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  return {
    team: state.team.active,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getTeam: id => dispatch(getTeam(id)),
    updateTeam: (teamId, data) => dispatch(updateTeam(teamId, data)),
    cleanErrors: () => dispatch(cleanErrorsAction()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TeamSettings));
