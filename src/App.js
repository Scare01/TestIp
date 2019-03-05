import React, { Component } from "react";
import axios from "axios";
import { Header, Segment, Input, Button, Card } from "semantic-ui-react";
import v4 from "uuid";
import validate from "ip-validator";

class App extends Component {
  state = {
    ipAddress: "",
    respList: []
  };

  componentDidMount() {
    if (localStorage.getItem("ipAddress")) {
      this.setState({ ipAddress: localStorage.getItem("idAddress") });
    }
    if (localStorage.getItem("Responses")) {
      let responses = localStorage.getItem("Responses");
      this.setState({ respList: JSON.parse(responses) });
    }
  }

  clickButton = () => {
    let url = "https://api.2ip.ua/geo.json?ip=" + this.state.ipAddress;
    axios.get(url).then(res => {
      if (res.status === 200) {
        this.setState({ respList: [...this.state.respList, res.data] });
        let newResponses = JSON.stringify(this.state.respList);
        localStorage.setItem("Responses", newResponses);
      } else {
        console.log("status = ", res.staus);
        console.log("status text = ", res.statusText);
      }
    });
  };

  handleChangeIP = e => {
    this.setState({ ipAddress: e.target.value });
  };

  render() {
    let respList = this.state.respList.map(resp => (
      <Card key={v4()}>
        <Card.Content>
          <Card.Header>Requested IP: {resp.ip}</Card.Header>
          <Card.Description>
            <div>Country: {resp.country}</div>
            <div>Region: {resp.region}</div>
            <div>City: {resp.city}</div>
          </Card.Description>
        </Card.Content>
      </Card>
    ));
    let valid = validate.ipv4(this.state.ipAddress);
    return (
      <div>
        <Header as="h1" textAlign="center">
          Test IP
        </Header>
        <Segment textAlign="center">
          <Input onChange={this.handleChangeIP} />
          <Button disabled={!valid} onClick={this.clickButton}>
            Test
          </Button>
        </Segment>
        <Header as="h2" textAlign="center">
          Responses:
        </Header>
        <div id="responses">{respList}</div>
      </div>
    );
  }
}

export default App;
