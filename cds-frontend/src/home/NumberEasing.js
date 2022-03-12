const React = require('react');

const eases = require('eases');

const NumberEasing = React.createClass({

  propTypes: {
    value: React.PropTypes.any.isRequired,
    speed: React.PropTypes.number,
    ease: React.PropTypes.oneOf(Object.keys(eases)),
    useLocaleString: React.PropTypes.bool,
    delayValue: React.PropTypes.number,
  },

  timeout: null,
  startAnimationTime: null,

  getInitialState() {
    const value = parseFloat(this.props.value, 10);

    return {
      previousValue: value,
      displayValue: value,
    };
  },

  getDefaultProps() {
    return {
      speed: 500,
      ease: 'quintInOut',
      useLocaleString: false,
    };
  },

  componentWillReceiveProps(nextProps) {
    const value = parseFloat(this.props.value, 10);

    if (parseFloat(nextProps.value, 10) === value) return;

    this.setState({
      previousValue: this.state.displayValue,
    });

    if (!isNaN(parseFloat(this.props.delayValue, 10))) {
      this.delayTimeout = setTimeout(() => {
        this.startAnimationTime = (new Date()).getTime();
        this.updateNumber();
      }, this.props.delayValue);
    } else {
      this.startAnimationTime = (new Date()).getTime();
      this.updateNumber();
    }
  },

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.displayValue !== this.state.displayValue;
  },

  updateNumber() {
    const value = parseFloat(this.props.value, 10);

    const now = (new Date()).getTime();
    const elapsedTime = Math.min(this.props.speed, (now - this.startAnimationTime));
    const progress = eases[this.props.ease](elapsedTime / this.props.speed);

    const currentDisplayValue = (value - this.state.previousValue) * progress + this.state.previousValue;

    this.setState({
      displayValue: currentDisplayValue,
    });

    if (elapsedTime < this.props.speed) {
      this.timeout = setTimeout(this.updateNumber, 16);
    } else {
      this.setState({
        previousValue: value,
      });
    }
  },

  componentWillUnmount() {
    clearTimeout(this.timeout);
    clearTimeout(this.delayTimeout);
  },

  render() {
    const { className, useLocaleString, ease, ...other } = this.props;
    const { displayValue } = this.state;

    let classes = 'react-number-easing';
    if (className) classes += ` ${className}`;

    return (
      <span {...other} className={classes}>
        {displayValue.toFixed(2)}
      </span>
    );
  },

});

export default NumberEasing;
