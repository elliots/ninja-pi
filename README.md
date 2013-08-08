ninja-pi
========

##NinjaBlocks Raspberry Pi Driver

###Overview
Exposes some useful stats from your rPi as NinjaBlocks devices

###Features
1. CPU Temperature
2. CPU Usage
3. RAM Usage
4. Bandwidth In
5. Bandwidth Out

Note! : Requires the new dashboard, and no widgets exist yet (but you could use a temperature one to get something to display).

###Forum Post
http://forums.ninjablocks.com/index.php?p=/discussion/1586/

###Installation

Install this Driver with:

ninja_install -g git@github.com:elliots/ninja-pi.git (Requires ninja toolbelt)

####Manual Installation

1. cd into your drivers directory (/opt/ninja/drivers on your Ninja Block)
2. git clone git://github.com/elliots/ninja-pi.git
3. cd ninja-pi && npm install

###History

v0.0.0

Initial version. 
