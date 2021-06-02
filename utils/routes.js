'use strict';

class Routes{

    constructor(app,socket){
        this.app = app;
        this.io = socket;

        /* 
            Array to store the list of users along with there respective socket id.
        */        
       this.users = [];
       this.admins = [];
       this.orders = [];
    }


    appRoutes(){

        this.app.get('/', (request,response) => {
            response.render('index');
        });

    }

    socketEvents(){

        this.io.on('connection', (socket) => {

            console.log('user connected => ', socket.id)

            // crud order
            socket.on('order', (data) => {
                this.orders.push({
                    order_id: data.order_id,
                    customer_id: data.customer_id,
                    owner_id: data.owner_id,
                    title: data.title,
                    subtitle: data.subtitle,
                    link: data.link
                });

                console.log('added order => ', data);

                this.io.emit('orderList', this.orders);
            })

            socket.on('admin', (data) => {
                this.admins.push({
                    id: socket.id,
                    admin_id: data.id,
                    name: data.name,
                    email: data.email,
                    token: data.token
                });

                console.log('added admin => ', data)

                this.io.emit('adminList', this.admins)
            });

            socket.on('username', (userName) => {

                this.users.push({
                    id : socket.id,
                    userName : userName
                });

                let len = this.users.length;
                len--;

                this.io.emit('userList',this.users,this.users[len].id); 
            });

            socket.on('getMsg', (data) => {
                socket.broadcast.to(data.toid).emit('sendMsg',{
                    msg:data.msg,
                    name:data.name
                });
            });

            socket.on('disconnect',()=>{
                
                for(let i=0; i < this.users.length; i++){
                    
                    if(this.users[i].id === socket.id){
                        this.users.splice(i,1); 
                    }
                }
                this.io.emit('exit',this.users); 
            });

        });

    }

    routesConfig(){
        this.appRoutes();
        this.socketEvents();
    }
}
module.exports = Routes;