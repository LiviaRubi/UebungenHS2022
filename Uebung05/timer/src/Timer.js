import React, {Component} from "react";
import Button from '@mui/material/Button';
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/Textfield";


class Timer extends Component {
    constructor(props) {
        super(props);

        this.state = {count: this.props.countdown, text: "", render: true};
        this.interval = "0";
    
        this.start = this.start.bind(this);
        this.update = this.update.bind(this);
        this.time = this.time.bind(this);
    }

    time(event) {
        const sek = event.target.value;
        this.setState({count: sek});
    }

    start() {
        this.setState({count: this.state.count -1});
        if (this.state.count <= 1) {
            this.setState({count: "", text: "Fertig!!", render: true});
            clearInterval(this.interval);
            this.interval = "0";
        }
    }

    update() {
        this.setState({text: "", render: false});

        if (this.interval != "0") {
            clearInterval(this.interval);
        }

        this.interval = setInterval(this.start, 1000);
    }


    render() {
        return (<>
            {this.state.render &&
            <Grid>
                <Grid>
                    <Typography variant="body">Zeit einstellen:</Typography>
                    <br/>
                    <br/>
                    <TextField label="Sekunden" value={this.state.countdown} onChange={this.time} variant='filled'></TextField>
                </Grid>
            </Grid>
            }
            <h4>verbleibende Zeit:</h4>
            <p>{this.state.count}</p>
            <p>{this.state.text}</p>
            <Button onClick={this.update} size="small" variant="contained" color="primary">Countdown starten</Button>
        </>)
    }
}

export default Timer;