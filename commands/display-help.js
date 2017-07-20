function displayHelp(message) {
    if(message.original_message.roomType === 'group'){
        bot.reply(message,{text: 'Hello! I am Ridebot, you can use me to request a Lyft:\
        \n -@Ridebot ETA will give you an estimated pick up time\
        \n -@Ridebot COST will provide a cost estimate for your ride\
        \n -@Ridebot REQUEST will request a ride for you\
        \n -@Ridebot STATUS will show the status of your Lyft ride\
        \n -@Ridebot CANCEL will attempt to cancel your Lyft ride\
        \n -@Ridebot HELP will list all available commands \n',
        markdown: 'Hello! I am Ridebot, you can use me to request a Lyft:\
        \n* `@Ridebot ETA` will give you an estimated pick up time\n * `@Ridebot COST` will provide a cost estimate for your ride\
        \n* `@Ridebot REQUEST` will request a ride for you\n * `@Ridebot STATUS` will show the status of your Lyft ride\
        \n* `@Ridebot CANCEL` will attempt to cancel your Lyft ride\n * `@Ridebot HELP` will list all available commands\n'});
    }else{
        bot.reply(message,{text: 'Hello! I am Ridebot, you can use me to request a Lyft:\
        \n ETA will give you an estimated pick up time\
        \n COST will provide a cost estimate for your ride\
        \n REQUEST will request a ride for you\
        \n STATUS will show the status of your Lyft ride\
        \n CANCEL will attempt to cancel your Lyft ride\
        \n HELP will list all available commands \n',
        markdown: 'Hello! I am Ridebot, you can use me to request a Lyft:\
        \n* `ETA` will give you an estimated pick up time\n * `COST` will provide a cost estimate for your ride\
        \n* `REQUEST` will request a ride for you\n * `STATUS` will show the status of your Lyft ride\
        \n* `CANCEL` will attempt to cancel your Lyft ride\n * `HELP` will list all available commands\n'});

    }
}

module.exports = displayHelp;
