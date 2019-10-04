import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';

export const socketLoader: MicroframeworkLoader = (
    settings: MicroframeworkSettings | undefined
) => {
    if (settings) {
        const socket = require('socket.io')(4110);

        socket.on('connection', (sock: any) => {

           /********** Opportunity real time data **********/
            sock.on('newOpportunity', createdOpportunity => {
              sock.broadcast.emit('newOpportunity', createdOpportunity);
            });
            sock.on('opportunityEditing', updatedOpportunity => {
                sock.broadcast.emit('opportunityEditing', updatedOpportunity);
            });
            sock.on('deleteOpportunity', deletedOpportunity => {
                sock.broadcast.emit('deleteOpportunity', deletedOpportunity);
            });

           /********** Trainer real time data **********/
            sock.on('newTrainer', createdTrainer => {
              sock.broadcast.emit('newTrainer', createdTrainer);
            });
            sock.on('trainerEditing', updatedTrainer => {
                sock.broadcast.emit('trainerEditing', updatedTrainer);
            });
            sock.on('deleteTrainer', deletedTrainer => {
                sock.broadcast.emit('deleteTrainer', deletedTrainer);
            });

           /********** Module real time data **********/
            sock.on('newModule', createdModule => {
              sock.broadcast.emit('newModule', createdModule);
            });
            sock.on('moduleEditing', updatedModule => {
                sock.broadcast.emit('moduleEditing', updatedModule);
            });
            sock.on('deleteModule', deletedModule => {
                sock.broadcast.emit('deleteModule', deletedModule);
            });

           /********** Assembly real time data **********/
            sock.on('newAssembly', createdAssembly => {
              sock.broadcast.emit('newAssembly', createdAssembly);
            });
            sock.on('assemblyEditing', updatedAssembly => {
                sock.broadcast.emit('assemblyEditing', updatedAssembly);
            });
            sock.on('deleteAssembly', deletedAssembly => {
                sock.broadcast.emit('deleteAssembly', deletedAssembly);
            });

           /********** Stock real time data **********/
            sock.on('newStock', createdStock => {
              sock.broadcast.emit('newStock', createdStock);
            });
            sock.on('stockEditing', updatedStock => {
                sock.broadcast.emit('stockEditing', updatedStock);
            });
            sock.on('deleteStock', deletedStock => {
                sock.broadcast.emit('deleteStock', deletedStock);
            });

            /********** Component real time data **********/
            sock.on('newComponent', createdComponent => {
              sock.broadcast.emit('newComponent', createdComponent);
            });
            sock.on('componentEditing', updatedComponent => {
              sock.broadcast.emit('componentEditing', updatedComponent);
            });
            sock.on('deleteComponent', deletedComponent => {
              sock.broadcast.emit('deleteComponent', deletedComponent);
            });

            /********** Service real time data **********/
            sock.on('newService', createdService => {
              sock.broadcast.emit('newService', createdService);
            });
            sock.on('serviceEditing', updatedService => {
              sock.broadcast.emit('serviceEditing', updatedService);
            });
            sock.on('deleteService', deletedService => {
              sock.broadcast.emit('deleteService', deletedService);
            });

            /********** Transaction real time data **********/
            sock.on('newTransaction', createdTransaction => {
              sock.broadcast.emit('newTransaction', createdTransaction);
            });
            sock.on('transactionEditing', updatedTransaction => {
              sock.broadcast.emit('transactionEditing', updatedTransaction);
            });
            sock.on('deleteTransaction', deletedTransaction => {
              sock.broadcast.emit('deleteTransaction', deletedTransaction);
            });

            /********** Shop real time data **********/
            sock.on('newShop', createdShop => {
              sock.broadcast.emit('newShop', createdShop);
            });
            sock.on('shopEditing', updatedShop => {
              sock.broadcast.emit('shopEditing', updatedShop);
            });
            sock.on('deleteShop', deletedShop => {
              sock.broadcast.emit('deleteShop', deletedShop);
            });

            /********** Vendor real time data **********/
            sock.on('newVendor', createdVendor => {
              sock.broadcast.emit('newVendor', createdVendor);
            });
            sock.on('vendorEditing', updatedVendor => {
              sock.broadcast.emit('vendorEditing', updatedVendor);
            });
            sock.on('deleteVendor', deletedVendor => {
              sock.broadcast.emit('deleteVendor', deletedVendor);
            });

            /********** Customer real time data **********/
            sock.on('newCustomer', createdCustomer => {
              sock.broadcast.emit('newCustomer', createdCustomer);
            });
            sock.on('customerEditing', updatedCustomer => {
              sock.broadcast.emit('customerEditing', updatedCustomer);
            });
            sock.on('deleteCustomer', deletedCustomer => {
              sock.broadcast.emit('deleteCustomer', deletedCustomer);
            });

            /********** Reseller real time data **********/
            sock.on('newReseller', createdReseller => {
              sock.broadcast.emit('newReseller', createdReseller);
            });
            sock.on('resellerEditing', updatedReseller => {
              sock.broadcast.emit('resellerEditing', updatedReseller);
            });
            sock.on('deleteReseller', deletedReseller => {
              sock.broadcast.emit('deleteReseller', deletedReseller);
            });

            /********** Tag real time data **********/
            sock.on('newTag', createdTag => {
              sock.broadcast.emit('newTag', createdTag);
            });
            sock.on('tagEditing', updatedTag => {
              sock.broadcast.emit('tagEditing', updatedTag);
            });
            sock.on('deleteTag', deletedTag => {
              sock.broadcast.emit('deleteTag', deletedTag);
            });

            /********** User real time data **********/
            sock.on('newUser', createdUser => {
              sock.broadcast.emit('newUser', createdUser);
            });
            sock.on('userEditing', updatedUser => {
              sock.broadcast.emit('userEditing', updatedUser);
            });
            sock.on('deleteUser', deletedUser => {
              sock.broadcast.emit('deleteUser', deletedUser);
            });

            /********** Stock real time data **********/
            sock.on('newStock', createdStock => {
              sock.broadcast.emit('newStock', createdStock);
            });
            sock.on('stockEditing', updatedStock => {
              sock.broadcast.emit('stockEditing', updatedStock);
            });
            sock.on('deleteStock', deletedStock => {
              sock.broadcast.emit('deleteStock', deletedStock);
            });
        });

        socket.on('disconnect', (sock: any) => {
            console.log('a user disconnected to ', sock);
        });

        // Here we can set the data for other loaders
        settings.setData('socket', socket);
    }
};
