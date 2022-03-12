import moment from 'moment';

function zeroFill(number, width) {
    width -= number.toString().length;
    if (width > 0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
    }
    return number + ""; // always return a string
}

function getFormattedTime(timeInSeconds) {
    const duration = moment.duration(timeInSeconds * 1000);
    return zeroFill(duration.minutes(), 2).toString() + ":" + zeroFill(duration.seconds(), 2).toString();
}

export default {
    getFormattedTime,
    getDistanceAndTimeFromResult: (result) => {
        if (!result) return {
            distance: '',
            time: '',
        };

        const [point, time] = result.split(':');
        return {
            distance: (point === 'START' ? 0 : point),
            time: time === 'START' ? '00:00' : getFormattedTime(parseFloat(time)),
        }
    }
}
