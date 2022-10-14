import React, {Component} from "react";

class Timer extends Component {
    constructor(props) {
        super(props);

        this.state = {count: this.props.countdown};
        this.interval = "0";

        //Event-Handler:
        this.update = this.update.bind(this);
        this.start = this.start.bind(this);
    }

    update() {
        this.setState({ count: this.state.count - 1});
        if (this.state.count <= 1) {
            this.setState({msg: "Fertig"});
            this.setState({count: ""});
            clearInterval(this.interval);
            this.interval = "0";
        }
    }

    start() {
        this.setState({count: this.props.countdown})

        if (this.interval != "0")
        {
            clearInterval(this.interval);
        }
        this.interval = setInterval(this.update, 1000)
    }

    render() {
        return (<>
            <hr/>
            <h2>Timer 50 Sekunden</h2>
            <p>{this.state.count}</p>
            <p>{this.state.msg}</p>
            <button onClick={this.start}>Countcouwn starten</button>
        </>);
    }
}

export default Timer;