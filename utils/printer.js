'use strict';

class Printer{

    constructor(app,socket){
        this.app = app;
        this.io = socket;
    }


    appRoutes(){

        this.app.get('/', (request,response) => {
            response.render('index');
        });

    }

    socketEvents(){

        this.io.on('connection', (socket) => {
            socket.on('printReceipt', (data) => {
                this.io.emit('printReceipt', data);
            
                if (data) {
                    const escpos = require('escpos');
                    escpos.USB = require('escpos-usb');
                    const device  = new escpos.USB();
                    const options = { encoding: "GB18030" };
                    const printer = new escpos.Printer(device, options);

                    device.open(function(error){
                        if (error) {
                            console.log('there is an error ', error)
                        } else {
                            printer
                                .font('a')
                                .align('ct')
                                .style('bu')
                                .size(1, 1)
                                .text(data)
                                .cut()
                                .close();
                        }
                    });
                }
            });
        });

    }

    routesConfig(){
        this.socketEvents();
    }
}
module.exports = Printer;