
module.exports = [
    /*{
        name: 'Uptime',
        command: 'uptime',
        regex: /up (\d+) days/
    },*/
    {
        name: 'CPU Usage',
        command: "top -b -n 2 |grep Cpu |tail -n 1 |awk '{print $2}' |sed 's/.[^.]*$//'",
        data: [parseInt],
        deviceId: 503
    },
    {
        name: 'CPU Temperature',
        command: "/opt/vc/bin/vcgencmd measure_temp",
        regex: /=([0-9\.]*)'C/,
        data: [parseFloat],
        deviceId: 513
    },
    {
        name: 'RAM Usage',
        command: 'cat /proc/meminfo',
        deviceId: 523,
        data: [function(result) {
            var total = parseInt(result.match(/MemTotal:\s*(\d*) kB/));
            var free = parseInt(result.match(/MemFree:\s*(\d*) kB/));

            return 100 - ((free/total)* 100);
        }]
    },
    {
        name: 'Bandwidth In',
        command: '/sbin/ifconfig "eth0" | grep "RX bytes" | cut -d: -f2 | awk \'{ print $1 }\'',
        deviceId: 533,
        data: [parseInt, changePerSecond, bytesToKilobytes]
    },
    {
        name: 'Bandwidth Out',
        command: '/sbin/ifconfig "eth0" | grep "TX bytes" | cut -d: -f2 | awk \'{ print $1 }\'',
        deviceId: 543,
        data: [parseInt, changePerSecond, bytesToKilobytes]
    }
];


function changePerSecond() {
    var lastVal, lastTime;
    return function(val) {
        var time = new Date().getTime();
        var rate;

        if (lastTime) {
            rate = (val-lastVal) / ((time-lastTime)/1000);
        }

        lastVal = val;
        lastTime = time;

        return rate;
    };
}

function bytesToKilobytes(val) {
    return val / 1000;
}
